import { z } from "zod";
import { sql } from "../config/database.js";
import { downloadResume } from "../config/storage.js";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function downloadApplicationResume(req, res) {
  const parsedParams = paramsSchema.safeParse(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid application ID.",
    });
  }

  try {
    const applications = await sql`
      SELECT
        resume_storage_key,
        resume_original_name,
        resume_content_type
      FROM applications
      WHERE id = ${parsedParams.data.id}
      LIMIT 1
    `;

    const application = applications[0];

    if (!application) {
      return res.status(404).json({
        error: "Application not found.",
      });
    }

    if (!ALLOWED_CONTENT_TYPES.has(application.resume_content_type)) {
      console.error("Resume has an unsupported stored content type.");

      return res.status(415).json({
        error: "Resume cannot be downloaded.",
      });
    }

    const file = await downloadResume(application.resume_storage_key);

    const safeName =
      application.resume_original_name
        .replace(/[\r\n"\\/]/g, "_")
        .slice(0, 180) || "resume";

    res.set({
      "Content-Type": application.resume_content_type,
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });

    return res.status(200).send(file);
  } catch (error) {
    console.error(
      "Resume download failed:",
      error instanceof Error ? error.message : "Unknown server error"
    );

    return res.status(503).json({
      error: "Unable to retrieve resume.",
    });
  }
}