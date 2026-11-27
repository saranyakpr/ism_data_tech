import { randomUUID } from "node:crypto";

import { sql } from "../config/database.js";
import {
  uploadResume,
  deleteResume,
} from "../config/storage.js";
import { applicationSchema } from "../config/application-schema.js";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function getFileExtension(contentType) {
  const extensions = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
  };

  return extensions[contentType] || null;
}

function validateResumeSignature(buffer, contentType) {
  if (contentType === "application/pdf") {
    return buffer.subarray(0, 5).toString() === "%PDF-";
  }

  if (contentType === "application/msword") {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from("D0CF11E0A1B11AE1", "hex"));
  }

  if (
    contentType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return (
      buffer.subarray(0, 2).toString() === "PK" &&
      buffer.includes(Buffer.from("[Content_Types].xml"))
    );
  }

  return false;
}

function getResumeBuffer(base64) {
  // Strip the data URL prefix if present
  const cleanBase64 = base64
    .replace(/^data:[^;]+;base64,/i, "")
    // Remove any whitespace/newlines that FileReader or browsers may insert
    .replace(/\s/g, "");

  if (
    !cleanBase64 ||
    !/^[A-Za-z0-9+/]+=*$/.test(cleanBase64)
  ) {
    return null;
  }

  const buffer = Buffer.from(cleanBase64, "base64");

  if (buffer.length === 0 || buffer.length > MAX_RESUME_SIZE) {
    return null;
  }

  return buffer;
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

async function sendApplicationEmail(application) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !adminEmail) {
    console.error("Application email configuration is missing.");
    return;
  }

  const fields = [
    ["Name", application.fullName],
    ["Email", application.email],
    ["Phone", application.phone],
    ["Location", application.location],
    ["Experience", application.experience],
    ["Education", application.education],
    ["Skills", application.skills],
    ["LinkedIn", application.linkedin],
    ["Portfolio", application.portfolio],
    ["Cover Letter", application.coverLetter],
  ];

  const details = fields
    .map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value || "Not provided")}</p>`
    )
    .join("");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ISM Careers <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New job application: ${application.jobTitle}`,
        html: `
          <h2>New Career Application</h2>
          <p>A new application has been submitted for <strong>${escapeHtml(application.jobTitle)}</strong>.</p>
          ${details}
          <p>Please log in to the ISM admin portal to review the application and download the resume.</p>
        `,
      }),
    });

    if (!response.ok) {
      console.error("Application notification email could not be sent.");
    }
  } catch (error) {
    console.error("Application email failed:", error.message);
  }
}
export async function submitCareerApplication(req, res) {
  let uploadedKey = null;

  try {
    const parsed = applicationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Please check the application details and try again.",
      });
    }

    const data = parsed.data;

    const phoneDigits = data.phone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return res.status(400).json({
        error: "Please enter a valid phone number.",
      });
    }

    const resumeBase64 = data.resumeData || data.resume;

    if (!resumeBase64) {
      return res.status(400).json({
        error: "Please upload your resume.",
      });
    }

    const dataUrlMatch = resumeBase64.match(
      /^data:([^;]+);base64,/i
    );

    const contentType =
      data.resumeType || dataUrlMatch?.[1] || "";

    const extension = getFileExtension(contentType);

    if (!extension || !ALLOWED_RESUME_TYPES.has(contentType)) {
      return res.status(400).json({
        error: "Please upload a PDF, DOC or DOCX resume.",
      });
    }

    const resumeBuffer = getResumeBuffer(resumeBase64);

    if (
      !resumeBuffer ||
      !validateResumeSignature(resumeBuffer, contentType)
    ) {
      return res.status(400).json({
        error: "The uploaded resume file is invalid.",
      });
    }

    const jobs = await sql`
      SELECT id, title, state, deadline
      FROM jobs
      WHERE id = ${data.jobId}
      LIMIT 1
    `;

    const job = jobs[0];

    if (!job || job.state !== "published") {
      return res.status(404).json({
        error: "This job opening is no longer available.",
      });
    }

    if (
      job.deadline &&
      new Date(job.deadline).getTime() <
        new Date().setHours(0, 0, 0, 0)
    ) {
      return res.status(400).json({
        error: "The application deadline has passed.",
      });
    }

    const safeResumeName = data.resumeName
      .replace(/[\r\n"\\/]/g, "_")
      .slice(0, 180);

    uploadedKey = `applications/${data.jobId}/${randomUUID()}.${extension}`;

    await uploadResume(
      uploadedKey,
      resumeBuffer,
      contentType
    );

    const applications = await sql`
      INSERT INTO applications (
        job_id,
        job_title_snapshot,
        full_name,
        email,
        phone,
        location,
        experience,
        education,
        skills,
        linkedin_url,
        portfolio_url,
        cover_letter,
        consent,
        resume_storage_key,
        resume_original_name,
        resume_content_type,
        resume_size_bytes,
        status
      )
      VALUES (
        ${data.jobId},
        ${job.title},
        ${data.fullName},
        ${data.email},
        ${data.phone},
        ${data.location},
        ${data.experience},
        ${data.education},
        ${data.skills},
        ${data.linkedin},
        ${data.portfolio},
        ${data.coverLetter},
        ${true},
        ${uploadedKey},
        ${safeResumeName},
        ${contentType},
        ${resumeBuffer.length},
        'new'
      )
      RETURNING id, submitted_at
    `;

    const application = applications[0];

    await sendApplicationEmail({
      ...data,
      jobTitle: job.title,
    });

    return res.status(201).json({
      success: true,
      message: "Your application has been submitted successfully.",
      applicationId: application.id,
    });
  } catch (error) {
    if (uploadedKey) {
      try {
        await deleteResume(uploadedKey);
      } catch (cleanupError) {
        console.error(
          "Resume cleanup failed:",
          cleanupError.message
        );
      }
    }

    console.error(
      "Career application submission failed:",
      error instanceof Error ? error.message : "Unknown server error"
    );

    return res.status(500).json({
      error: "Unable to submit your application. Please try again.",
    });
  }
}