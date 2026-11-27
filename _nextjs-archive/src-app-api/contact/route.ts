
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(160),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().email().max(254),
  phone: z
  .string()
  .trim()
  .refine(
    (value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    },
    "Please enter a valid phone number"
  ),
  country: z.string().trim().min(2).max(100),
  service: z.string().trim().min(1).max(160),
  requirements: z.string().trim().min(20).max(5000),
  timeline: z.string().trim().max(120).optional(),
  consent: z.literal(true),
});

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character] ?? character,
  );
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data." },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (!apiKey || !recipient) {
      console.error("Contact notification configuration is missing.");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 },
      );
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
      return NextResponse.json(
        { error: "Unable to send your enquiry right now. Please try again." },
        { status: 503 },
      );
    }

    console.info("Contact notification accepted by Resend.", {
      emailId: sentEmail.id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      "Contact form error:",
      err instanceof Error ? err.message : "Unknown error",
    );

    return NextResponse.json(
      { error: "Unable to process your enquiry right now." },
      { status: 500 },
    );
  }
}
