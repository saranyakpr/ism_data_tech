import { sql } from "../config/database.js";

export async function getAdminOverview(req, res) {
  try {
    const [
      jobCounts,
      applicationCounts,
      recentJobs,
      recentApplications,
    ] = await Promise.all([
      sql`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE state = 'published')::int AS published,
          COUNT(*) FILTER (WHERE state = 'closed')::int AS closed
        FROM jobs
      `,
      sql`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'new')::int AS new,
          COUNT(*) FILTER (WHERE status = 'shortlisted')::int AS shortlisted
        FROM applications
      `,
      sql`
        SELECT j.id, j.title, j.department, j.location, j.state, j.created_at,
          (
            SELECT COUNT(*)::int
            FROM applications a
            WHERE a.job_id = j.id
          ) AS applicant_count
        FROM jobs j
        ORDER BY j.created_at DESC
        LIMIT 5
      `,
      sql`
        SELECT id, full_name, email, job_title_snapshot, status, submitted_at
        FROM applications
        ORDER BY submitted_at DESC
        LIMIT 5
      `,
    ]);

    const [jobs] = jobCounts;
    const [applications] = applicationCounts;

    return res.status(200).json({
      counts: {
        totalJobs: jobs.total,
        publishedJobs: jobs.published,
        closedJobs: jobs.closed,
        totalApplications: applications.total,
        newApplications: applications.new,
        shortlistedApplications: applications.shortlisted,
      },

      recentJobs: recentJobs.map(({ applicant_count, ...job }) => ({
        ...job,
        applicantCount: applicant_count,
      })),

      recentApplications,
    });
  } catch (error) {
    console.error(
      "Admin overview failed:",
      error instanceof Error ? error.message : "Unknown server error"
    );

    return res.status(503).json({
      error: "Unable to load dashboard overview.",
    });
  }
}