import { Resend } from "resend";

import { contactSchema } from "../config/contact-validation.js";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character] ?? character
  );
}

export async function submitContactEnquiry(req, res) {
  try {
    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid form data.",
      });
    }

    const data = parsed.data;
    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (!apiKey || !recipient) {
      console.error("Contact notification configuration is missing.");

      return res.status(503).json({
        error: "Email service is not configured.",
      });
    }

    const resend = new Resend(apiKey);

    const { data: sentEmail, error } = await resend.emails.send({
      from: "ISM Website <onboarding@resend.dev>",
      to: recipient,
      replyTo: data.email,
      subject: `New Business Enquiry - ${data.name} - ${data.service}`,
      html: [
        "<h2>New Business Enquiry</h2>",
        `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>`,
        `<p><strong>Company:</strong> ${escapeHtml(data.company || "Not provided")}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>`,
        `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>`,
        `<p><strong>Country:</strong> ${escapeHtml(data.country)}</p>`,
        `<p><strong>Service:</strong> ${escapeHtml(data.service)}</p>`,
        `<p><strong>Timeline:</strong> ${escapeHtml(data.timeline || "Not specified")}</p>`,
        "<hr/>",
        "<p><strong>Requirements:</strong></p>",
        `<p>${escapeHtml(data.requirements).replace(/\n/g, "<br/>")}</p>`,
        "<hr/>",
        "<p>Submitted through the ISM Data Technology website.</p>",
      ].join(""),
    });

    if (error || !sentEmail) {
      console.error("Contact notification failed:", error?.message);

      return res.status(503).json({
        error: "Unable to send your enquiry right now. Please try again.",
      });
    }

    console.info("Contact notification accepted by Resend.", {
      emailId: sentEmail.id,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(
      "Contact form error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return res.status(500).json({
      error: "Unable to process your enquiry right now.",
    });
  }
}