import { sql } from "../config/database.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../config/admin-job-validation.js";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validStates = ["draft", "published", "closed"];

const validEmploymentTypes = [
  "full_time",
  "part_time",
  "contract",
  "internship",
];

function formatZodErrors(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

function getPostgresErrorCode(error) {
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

// GET: List jobs with pagination and filters
export async function getJobs(req, res) {
  const pageParam = Number(req.query.page ?? "1");
  const pageSizeParam = Number(
    req.query.pageSize ?? DEFAULT_PAGE_SIZE
  );

  const search = (req.query.search ?? "").trim();
  const stateParam = req.query.state ?? "";
  const employmentTypeParam = req.query.employmentType ?? "";

  if (
    !Number.isSafeInteger(pageParam) ||
    pageParam < 1 ||
    !Number.isSafeInteger(pageSizeParam) ||
    pageSizeParam < 1 ||
    pageSizeParam > MAX_PAGE_SIZE ||
    (pageParam - 1) * pageSizeParam > Number.MAX_SAFE_INTEGER ||
    search.length > 100 ||
    (stateParam !== "" && !validStates.includes(stateParam)) ||
    (employmentTypeParam !== "" &&
      !validEmploymentTypes.includes(employmentTypeParam))
  ) {
    return res.status(400).json({
      error: "Invalid pagination parameters.",
    });
  }

  try {
    const safeSearch = search
      .replace(/[,%_*()\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const stateFilter = stateParam || null;
    const employmentTypeFilter = employmentTypeParam || null;
    const searchPattern = safeSearch ? `%${safeSearch}%` : null;

    const from = (pageParam - 1) * pageSizeParam;

    const [summaryRows, countRows, jobs] = await Promise.all([
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

    const summary = summaryRows[0];

    return res.json({
      jobs,
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
    console.error("Admin jobs list failed:", error.message);

    return res.status(503).json({
      error: "Unable to load jobs right now.",
    });
  }
}

// POST: Create a job
export async function createJob(req, res) {
  if (!req.is("application/json")) {
    return res.status(415).json({
      error: "Expected a JSON request.",
    });
  }

  const parsed = createJobSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Job fields are invalid.",
      details: formatZodErrors(parsed.error),
    });
  }

  try {
    const {
      slug,
      title,
      department,
      location,
      employment_type,
      work_mode,
      experience,
      description,
      requirements,
      responsibilities,
      qualifications,
      deadline,
      state,
    } = parsed.data;

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
    `;

    if (!jobs[0]) {
      throw new Error("Job insert returned no row.");
    }

    return res.status(201).json({ job: jobs[0] });
  } catch (error) {
    const code = getPostgresErrorCode(error);

    if (code === "23505") {
      return res.status(409).json({
        error: "A job with this slug already exists.",
      });
    }

    if (code === "23514" || code === "23502") {
      return res.status(400).json({
        error: "The job could not be saved because a database constraint failed.",
      });
    }

    console.error("Admin job creation failed:", code ?? error.message);

    return res.status(503).json({
      error: "Unable to create the job.",
    });
  }
}

// PATCH: Update an existing job
export async function updateJob(req, res) {
  const { id } = req.params;

  if (!UUID_PATTERN.test(id)) {
    return res.status(400).json({
      error: "Invalid job ID.",
    });
  }

  if (!req.is("application/json")) {
    return res.status(415).json({
      error: "Expected a JSON request.",
    });
  }

  const parsed = updateJobSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Job fields are invalid.",
      details: formatZodErrors(parsed.error),
    });
  }

  try {
    const {
      slug,
      title,
      department,
      location,
      employment_type,
      work_mode,
      experience,
      description,
      requirements,
      responsibilities,
      qualifications,
      deadline,
      state,
    } = parsed.data;

    const jobs = await sql`
      UPDATE jobs
      SET slug = ${slug},
        title = ${title},
        department = ${department},
        location = ${location},
        employment_type = ${employment_type},
        work_mode = ${work_mode},
        experience = ${experience},
        description = ${description},
        requirements = ${requirements},
        responsibilities = ${responsibilities},
        qualifications = ${qualifications},
        deadline = ${deadline},
        state = ${state}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!jobs[0]) {
      return res.status(404).json({
        error: "Job not found.",
      });
    }

    return res.json({ job: jobs[0] });
  } catch (error) {
    const code = getPostgresErrorCode(error);

    if (code === "23505") {
      return res.status(409).json({
        error: "A job with this slug already exists.",
      });
    }

    if (code === "23514" || code === "23502") {
      return res.status(400).json({
        error: "The job could not be saved because a database constraint failed.",
      });
    }

    console.error("Admin job update failed:", code ?? error.message);

    return res.status(503).json({
      error: "Unable to update the job.",
    });
  }
}