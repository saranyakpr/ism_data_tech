import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { isSameOriginAdminRequest } from "@/lib/admin-auth";
import { sql } from "@/lib/neon";
import type { Application } from "@/types/database";

const paramsSchema = z.object({
  id: z.string().uuid(),
});
const bodySchema = z.object({
  status: z.enum([
    "new",
    "under_review",
    "shortlisted",
    "interview_scheduled",
    "selected",
    "rejected",
  ]),
}).strict();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;
  if (!isSameOriginAdminRequest(request)) {
    return adminApiJson({ error: "Invalid request origin." }, { status: 403 });
  }

  const parsedParams = paramsSchema.safeParse(await params);
  if (!parsedParams.success) {
    return adminApiJson({ error: "Invalid application ID." }, { status: 400 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return adminApiJson({ error: "Expected a JSON request." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminApiJson({ error: "Invalid request body." }, { status: 400 });
  }
  const parsedBody = bodySchema.safeParse(body);
  if (!parsedBody.success) {
    return adminApiJson({ error: "Invalid application status." }, { status: 400 });
  }

  try {
    const updated = await sql`
      UPDATE applications
      SET status = ${parsedBody.data.status}
      WHERE id = ${parsedParams.data.id}
      RETURNING id, status, updated_at
    ` as Pick<Application, "id" | "status" | "updated_at">[];
    if (!updated[0]) {
      return adminApiJson({ error: "Application not found." }, { status: 404 });
    }
    return adminApiJson({ application: updated[0] });
  } catch (error) {
    console.error(
      "Admin application update failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson({ error: "Unable to update application status." }, { status: 503 });
  }
}
