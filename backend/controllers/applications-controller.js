import { sql } from "../config/database.js";

const PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

const STATUSES = [
  "new",
  "under_review",
  "shortlisted",
  "interview_scheduled",
  "selected",
  "rejected",
];

export async function getApplications(req, res) {
  const page = Number(req.query.page ?? "1");
  const pageSize = Number(req.query.pageSize ?? PAGE_SIZE);
  const search = (req.query.search ?? "").trim();
  const status = req.query.status ?? "";

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > MAX_PAGE_SIZE ||
    (page - 1) * pageSize > Number.MAX_SAFE_INTEGER ||
    search.length > 100 ||
    (status !== "" && !STATUSES.includes(status))
  ) {
    return res.status(400).json({
      error: "Invalid application filters.",
    });
  }

  try {
    const safeSearch = search
      .replace(/[,%_*()\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const statusFilter = status || null;
    const searchPattern = safeSearch ? `%${safeSearch}%` : null;
    const from = (page - 1) * pageSize;

    const [countRows, applications] = await Promise.all([
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

    return res.json({
      applications,
      total: countRows[0]?.total ?? 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(
      "Admin applications query failed:",
      error instanceof Error ? error.message : "Unknown server error"
    );

    return res.status(503).json({
      error: "Unable to load applications.",
    });
  }
}