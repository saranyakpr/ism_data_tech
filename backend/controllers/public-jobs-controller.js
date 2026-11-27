import { sql } from "../config/database.js";

export async function getPublishedJobs(req, res) {
  try {
    const jobs = await sql`
      SELECT
        id,
        slug,
        title,
        department,
        location,
        employment_type,
        work_mode,
        experience,
        description,
        deadline
      FROM jobs
      WHERE state = 'published'
        AND (deadline IS NULL OR deadline >= CURRENT_DATE)
      ORDER BY created_at DESC
    `;

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Failed to load published jobs:", error);

    return res.status(500).json({
      error: "Unable to load available positions.",
    });
  }
}

export async function getPublishedJobById(req, res) {
  const { id } = req.params;

  // Accept any well-formed UUID (8-4-4-4-12 hex groups).
  // The stricter variant/version checks were rejecting valid Neon-generated UUIDs.
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!UUID_RE.test(id)) {
    return res.status(404).json({ error: "Job not found." });
  }

  try {
    const jobs = await sql`
      SELECT
        id,
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
        deadline
      FROM jobs
      WHERE id = ${id}
        AND state = 'published'
        AND (deadline IS NULL OR deadline >= CURRENT_DATE)
      LIMIT 1
    `;

    const job = jobs[0];

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.error("Failed to load job by id:", error);

    return res.status(500).json({
      error: "Unable to load job details.",
    });
  }
}