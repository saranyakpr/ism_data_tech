
import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/neon";
import { uploadResume, deleteResume } from "@/lib/storage";

const applicationSchema = z.object({
  jobId: z.string().uuid(),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(20),
  location: z.string().trim().min(2).max(150),
  experience: z.string().trim().max(100).optional().default(""),
  education: z.string().trim().min(2).max(150),
  skills: z.string().trim().min(2).max(1000),
  linkedin: z.string().trim().optional().default(""),
  portfolio: z.string().trim().optional().default(""),
  coverLetter: z.string().trim().max(5000).optional().default(""),
  consent: z.literal(true),
  resume: z.string().optional(),
  resumeData: z.string().optional(),
  resumeName: z.string().min(1).max(180),
  resumeType: z.string().optional(),
});

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function getFileExtension(contentType: string) {
  switch (contentType) {
    case "application/pdf":
      return "pdf";
    case "application/msword":
      return "doc";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
    default:
      return null;
  }
}

function validateResumeSignature(buffer: Buffer, contentType: string) {
  if (contentType === "application/pdf") {
    return buffer.subarray(0, 5).toString() === "%PDF-";
  }

  if (contentType === "application/msword") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
    );
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

function getResumeBuffer(base64: string) {
  const cleaned = base64.replace(/^data:[^;]+;base64,/, "");

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
    throw new Error("Invalid resume file encoding.");
  }

  const buffer = Buffer.from(cleaned, "base64");

  if (buffer.length === 0 || buffer.length > MAX_RESUME_SIZE) {
    throw new Error("Resume must be smaller than 5 MB.");
  }

  return buffer;
}

async function sendApplicationEmail(application: {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  coverLetter: string;
  jobTitle: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ADMIN_EMAIL;

  if (!apiKey || !recipient) {
    console.error("Application email configuration is incomplete.");
    return;
  }

  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (char) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[char];
    });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ISM Careers <onboarding@resend.dev>",
        to: [recipient],
        subject: `New job application: ${application.jobTitle}`,
        html: `
          <h2>New Job Application</h2>
          <p><strong>Position:</strong> ${escapeHtml(application.jobTitle)}</p>
          <p><strong>Name:</strong> ${escapeHtml(application.fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(application.phone)}</p>
          <p><strong>Location:</strong> ${escapeHtml(application.location)}</p>
          <p><strong>Experience:</strong> ${escapeHtml(application.experience || "Not provided")}</p>
          <p><strong>Cover Letter:</strong></p>
          <p>${escapeHtml(application.coverLetter || "Not provided")}</p>
          <p>Log in to the ISM admin portal to view the application and download the resume.</p>
        `,
      }),
    });

    if (!response.ok) {
      console.error("Application email failed:", await response.text());
    }
  } catch (error) {
    console.error("Application email error:", error);
  }
}

export async function POST(request: Request) {
  let uploadedKey: string | null = null;

  try {
    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Application validation failed:", parsed.error.flatten());

      return NextResponse.json(
        { error: "Please check the application details and try again." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const phoneDigits = data.phone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    // Support both resume and resumeData from the frontend.
    const resumeBase64 = data.resumeData || data.resume;

    if (!resumeBase64) {
      return NextResponse.json(
        { error: "Please upload your resume." },
        { status: 400 }
      );
    }

    // Detect the MIME type from the data URL or supplied value.
    const dataUrlMatch = resumeBase64.match(
      /^data:([^;]+);base64,/
    );

    const contentType = data.resumeType || dataUrlMatch?.[1] || "";

    const extension = getFileExtension(contentType);

    if (!extension || !ALLOWED_CONTENT_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: "Only PDF, DOC, and DOCX resumes are allowed." },
        { status: 415 }
      );
    }

    let fileContent: Buffer;

    try {
      fileContent = getResumeBuffer(resumeBase64);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Invalid resume file.",
        },
        { status: 400 }
      );
    }

    if (!validateResumeSignature(fileContent, contentType)) {
      return NextResponse.json(
        { error: "The uploaded file does not match its file type." },
        { status: 415 }
      );
    }

    // Check whether the job is published and accepting applications.
    const jobs = (await sql`
      SELECT id, title, state, deadline
      FROM jobs
      WHERE id = ${data.jobId}
      LIMIT 1
    `) as {
      id: string;
      title: string;
      state: string;
      deadline: string | null;
    }[];

    const job = jobs[0];

    if (!job || job.state !== "published") {
      return NextResponse.json(
        { error: "This job opening is no longer available." },
        { status: 404 }
      );
    }

    if (
      job.deadline &&
      new Date(job.deadline).getTime() < new Date().setHours(0, 0, 0, 0)
    ) {
      return NextResponse.json(
        { error: "The application deadline for this job has passed." },
        { status: 400 }
      );
    }

    const safeOriginalName =
      data.resumeName.replace(/[\r\n"\\/]/g, "_").slice(0, 180) ||
      `resume.${extension}`;

    const storageKey = `applications/${data.jobId}/${crypto.randomUUID()}.${extension}`;

    // Upload resume to private Neon Object Storage.
    await uploadResume(storageKey, fileContent, contentType);
    uploadedKey = storageKey;

    // Save application details in Neon PostgreSQL.
    await sql`
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
        ${data.linkedin || null},
        ${data.portfolio || null},
        ${data.coverLetter},
        ${data.consent},
        ${storageKey},
        ${safeOriginalName},
        ${contentType},
        ${fileContent.length},
        'new'
      )
    `;

    console.info("Application saved successfully.");

    // Send notification email.
    await sendApplicationEmail({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      experience: data.experience,
      coverLetter: data.coverLetter,
      jobTitle: job.title,
    });

    return NextResponse.json(
      { message: "Your application has been submitted successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Application submission failed:",
      error instanceof Error ? error.stack || error.message : error
    );

    // Clean up the uploaded resume if the database insert fails.
    if (uploadedKey) {
      try {
        await deleteResume(uploadedKey);
      } catch (cleanupError) {
        console.error("Resume cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      { error: "Unable to submit your application. Please try again." },
      { status: 500 }
    );
  }
}
