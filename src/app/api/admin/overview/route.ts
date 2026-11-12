import { requireAdminApiSession, adminApiJson } from "@/lib/admin-api-auth";
import { sql } from "@/lib/neon";
import type { Application, Job } from "@/lib/supabase/database.types";

export async function GET() {
  const authError = await requireAdminApiSession();
  if (authError) return authError;

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
    const [jobs] = jobCounts as { total: number; published: number; closed: number }[];
    const [applications] = applicationCounts as {
      total: number;
      new: number;
      shortlisted: number;
    }[];
    const recentJobsWithCounts = recentJobs as (
      Pick<Job, "id" | "title" | "department" | "location" | "state" | "created_at"> & {
        applicant_count: number;
      }
    )[];
    const latestApplications = recentApplications as Pick<
      Application,
      "id" | "full_name" | "email" | "job_title_snapshot" | "status" | "submitted_at"
    >[];

    return adminApiJson({
      counts: {
        totalJobs: jobs.total,
        publishedJobs: jobs.published,
        closedJobs: jobs.closed,
        totalApplications: applications.total,
        newApplications: applications.new,
        shortlistedApplications: applications.shortlisted,
      },
      recentJobs: recentJobsWithCounts.map(({ applicant_count, ...job }) => ({
        ...job,
        applicantCount: applicant_count,
      })),
      recentApplications: latestApplications,
    });
  } catch (error) {
    console.error(
      "Admin overview failed:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    return adminApiJson({ error: "Unable to load dashboard overview." }, { status: 503 });
  }
}
