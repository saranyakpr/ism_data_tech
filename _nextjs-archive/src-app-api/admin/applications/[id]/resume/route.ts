
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/admin-api-auth";
import { sql } from "@/lib/neon";
import { downloadResume } from "@/lib/storage";
import type { Application } from "@/types/database";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Verify admin authentication.
  const authError = await requireAdminApiSession();

  if (authError) return authError;

  // Validate application ID.
  const parsedParams = paramsSchema.safeParse(await params);

  if (!parsedParams.success) {
    return NextResponse.json(
      { error: "Invalid application ID." },
      { status: 400 },
    );
  }

  try {
    // Get resume information from Neon PostgreSQL.
    const applications = (await sql`
      SELECT
        resume_storage_key,
        resume_original_name,
        resume_content_type
      FROM applications
      WHERE id = ${parsedParams.data.id}
      LIMIT 1
    `) as Pick<
      Application,
      "resume_storage_key" | "resume_original_name" | "resume_content_type"
    >[];

    const application = applications[0];

    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 },
      );
    }

    // Check the stored file type.
    if (!ALLOWED_CONTENT_TYPES.has(application.resume_content_type)) {
      console.error("Resume has an unsupported stored content type.");

      return NextResponse.json(
        { error: "Resume cannot be downloaded." },
        { status: 415 },
      );
    }

    // Download the private resume from Neon Object Storage.
    const file = await downloadResume(application.resume_storage_key);

    // Sanitize the original filename.
    const safeName =
      application.resume_original_name
        .replace(/[\r\n"\\/]/g, "_")
        .slice(0, 180) || "resume";

    // Return the resume as a downloadable file.
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": application.resume_content_type,
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "Resume download failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );

    return NextResponse.json(
      { error: "Unable to retrieve resume." },
      { status: 503 },
    );
  }
}
