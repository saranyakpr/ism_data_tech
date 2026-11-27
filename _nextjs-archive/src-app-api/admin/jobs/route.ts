import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { isSameOriginAdminRequest } from "@/lib/admin-auth";
import { createJobSchema } from "@/lib/admin-job-validation";
import { sql } from "@/lib/neon";
import type { EmploymentType, Job, JobState } from "@/types/database";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

  const pageParam = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const pageSizeParam = Number(
    request.nextUrl.searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE,
  );
  const search = (request.nextUrl.searchParams.get("search") ?? "").trim();
  const stateParam = request.nextUrl.searchParams.get("state") ?? "";
  const employmentTypeParam =
    request.nextUrl.searchParams.get("employmentType") ?? "";
  const validStates: JobState[] = ["draft", "published", "closed"];
  const validEmploymentTypes: EmploymentType[] = [
    "full_time",
    "part_time",
    "contract",
    "internship",
  ];
  if (
    !Number.isSafeInteger(pageParam) ||
    pageParam < 1 ||
    !Number.isSafeInteger(pageSizeParam) ||
    pageSizeParam < 1 ||
    pageSizeParam > MAX_PAGE_SIZE ||
    (pageParam - 1) * pageSizeParam > Number.MAX_SAFE_INTEGER ||
    search.length > 100 ||
    (stateParam !== "" && !validStates.includes(stateParam as JobState)) ||
    (employmentTypeParam !== "" &&
      !validEmploymentTypes.includes(employmentTypeParam as EmploymentType))
  ) {
    return adminApiJson({ error: "Invalid pagination parameters." }, { status: 400 });
  }

  try {
    const safeSearch = search.replace(/[,%_*()\\]/g, " ").replace(/\s+/g, " ").trim();
    const stateFilter = stateParam || null;
    const employmentTypeFilter = employmentTypeParam || null;
    const searchPattern = safeSearch ? `%${safeSearch}%` : null;
    const from = (pageParam - 1) * pageSizeParam;
    const [summaryRowsResult, countRowsResult, jobsResult] = await Promise.all([
      sql`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE state = 'draft')::int AS draft,
          COUNT(*) FILTER (WHERE state = 'published')::int AS published,
          COUNT(*) FILTER (WHERE state = 'closed')::int AS closed
        FROM jobs
      `,
      sql`
        SELECT COUNT(*)::int AS total
        FROM jobs j
        WHERE (${stateFilter}::text IS NULL OR j.state::text = ${stateFilter})
          AND (${employmentTypeFilter}::text IS NULL OR j.employment_type::text = ${employmentTypeFilter})
          AND (
            ${searchPattern}::text IS NULL
            OR j.title ILIKE ${searchPattern}
            OR j.department ILIKE ${searchPattern}
            OR j.location ILIKE ${searchPattern}
          )
      `,
      sql`
        SELECT j.*,
          (
            SELECT COUNT(*)::int
            FROM applications a
            WHERE a.job_id = j.id
          ) AS applicant_count
        FROM jobs j
        WHERE (${stateFilter}::text IS NULL OR j.state::text = ${stateFilter})
          AND (${employmentTypeFilter}::text IS NULL OR j.employment_type::text = ${employmentTypeFilter})
          AND (
            ${searchPattern}::text IS NULL
            OR j.title ILIKE ${searchPattern}
            OR j.department ILIKE ${searchPattern}
            OR j.location ILIKE ${searchPattern}
          )
        ORDER BY j.created_at DESC
        LIMIT ${pageSizeParam}
        OFFSET ${from}
      `,
    ]);
    const summaryRows = summaryRowsResult as {
      total: number;
      draft: number;
      published: number;
      closed: number;
    }[];
    const countRows = countRowsResult as { total: number }[];
    const jobs = jobsResult as (Job & { applicant_count: number })[];
    const summary = summaryRows[0];

    return adminApiJson({
      jobs: jobs.map(({ applicant_count, ...job }) => ({
        ...job,
        applicant_count,
      })),
      total: countRows[0]?.total ?? 0,
      page: pageParam,
      pageSize: pageSizeParam,
      summary: {
        total: summary?.total ?? 0,
        draft: summary?.draft ?? 0,
        published: summary?.published ?? 0,
        closed: summary?.closed ?? 0,
      },
    });
  } catch (error) {
    console.error(
      "Admin jobs list failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson(
      { error: "Unable to load jobs right now." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminApiSession();
  if (authError) return authError;
  if (!isSameOriginAdminRequest(request)) {
    return adminApiJson({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return adminApiJson(
      { error: "Expected a JSON request." },
      { status: 415 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminApiJson({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = createJobSchema.safeParse(body);
  if (!parsed.success) {
    return adminApiJson(
      { error: "Job fields are invalid.", details: formatZodErrors(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const { slug, title, department, location, employment_type, work_mode,
      experience, description, requirements, responsibilities, qualifications,
      deadline, state } = parsed.data;
    const jobs = await sql`
      INSERT INTO jobs (
        slug, title, department, location, employment_type, work_mode,
        experience, description, requirements, responsibilities, qualifications,
        deadline, state
      )
      VALUES (
        ${slug}, ${title}, ${department}, ${location}, ${employment_type},
        ${work_mode}, ${experience}, ${description}, ${requirements},
        ${responsibilities}, ${qualifications}, ${deadline}, ${state}
      )
      RETURNING *
    ` as Job[];
    if (!jobs[0]) throw new Error("Job insert returned no row.");
    return adminApiJson({ job: jobs[0] }, { status: 201 });
  } catch (error) {
    const code = getPostgresErrorCode(error);
    if (code === "23505") {
      return adminApiJson(
        { error: "A job with this slug already exists." },
        { status: 409 },
      );
    }
    if (code === "23514" || code === "23502") {
      return adminApiJson(
        { error: "The job could not be saved because a database constraint failed." },
        { status: 400 },
      );
    }
    console.error(
      "Admin job creation failed:",
      code ?? (error instanceof Error ? error.message : "Unknown server error"),
    );
    return adminApiJson({ error: "Unable to create the job." }, { status: 503 });
  }
}

function getPostgresErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return undefined;
}

function formatZodErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
