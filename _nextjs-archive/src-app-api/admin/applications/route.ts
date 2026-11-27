import { NextRequest } from "next/server";
import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { sql } from "@/lib/neon";
import type { Application, ApplicationStatus } from "@/types/database";

const PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;
const STATUSES: ApplicationStatus[] = [
  "new",
  "under_review",
  "shortlisted",
  "interview_scheduled",
  "selected",
  "rejected",
];

export async function GET(request: NextRequest) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? PAGE_SIZE);
  const search = (params.get("search") ?? "").trim();
  const status = params.get("status") ?? "";
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > MAX_PAGE_SIZE ||
    (page - 1) * pageSize > Number.MAX_SAFE_INTEGER ||
    search.length > 100 ||
    (status !== "" && !STATUSES.includes(status as ApplicationStatus))
  ) {
    return adminApiJson({ error: "Invalid application filters." }, { status: 400 });
  }

  try {
    const safeSearch = search.replace(/[,%_*()\\]/g, " ").replace(/\s+/g, " ").trim();
    const statusFilter = status || null;
    const searchPattern = safeSearch ? `%${safeSearch}%` : null;
    const from = (page - 1) * pageSize;
    const [countRowsResult, applicationsResult] = await Promise.all([
      sql`
        SELECT COUNT(*)::int AS total
        FROM applications
        WHERE (${statusFilter}::text IS NULL OR status::text = ${statusFilter})
          AND (
            ${searchPattern}::text IS NULL
            OR full_name ILIKE ${searchPattern}
            OR email ILIKE ${searchPattern}
            OR job_title_snapshot ILIKE ${searchPattern}
            OR location ILIKE ${searchPattern}
          )
      `,
      sql`
        SELECT id, job_id, job_title_snapshot, full_name, email, phone, location,
          experience, education, skills, linkedin_url, portfolio_url, cover_letter,
          status, resume_original_name, resume_content_type, resume_size_bytes,
          submitted_at, updated_at
        FROM applications
        WHERE (${statusFilter}::text IS NULL OR status::text = ${statusFilter})
          AND (
            ${searchPattern}::text IS NULL
            OR full_name ILIKE ${searchPattern}
            OR email ILIKE ${searchPattern}
            OR job_title_snapshot ILIKE ${searchPattern}
            OR location ILIKE ${searchPattern}
          )
        ORDER BY submitted_at DESC
        LIMIT ${pageSize}
        OFFSET ${from}
      `,
    ]);
    const countRows = countRowsResult as { total: number }[];
    const applications = applicationsResult as Pick<
      Application,
      | "id"
      | "job_id"
      | "job_title_snapshot"
      | "full_name"
      | "email"
      | "phone"
      | "location"
      | "experience"
      | "education"
      | "skills"
      | "linkedin_url"
      | "portfolio_url"
      | "cover_letter"
      | "status"
      | "resume_original_name"
      | "resume_content_type"
      | "resume_size_bytes"
      | "submitted_at"
      | "updated_at"
    >[];

    return adminApiJson({
      applications,
      total: countRows[0]?.total ?? 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(
      "Admin applications query failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson({ error: "Unable to load applications." }, { status: 503 });
  }
}
