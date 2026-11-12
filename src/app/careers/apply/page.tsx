import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { sql } from "@/lib/neon";
import type { PublicJob } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Apply – Careers",
  description: "Submit your job application to ISM Data Technology.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>;
}) {
  const { jobId } = await searchParams;
  let jobs: Pick<PublicJob, "id" | "title">[] = [];

  try {
    jobs = await sql`
      SELECT id, title
      FROM jobs
      WHERE state = 'published'
        AND (deadline IS NULL OR deadline >= CURRENT_DATE)
      ORDER BY title ASC
    ` as Pick<PublicJob, "id" | "title">[];
  } catch (error) {
    console.error(
      "Could not initialize open positions for application form:",
      error instanceof Error ? error.message : "Unknown server error",
    );
  }

  const initialJobId = jobs.some((job) => job.id === jobId) ? jobId : undefined;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-[66px] min-h-screen s-soft">
        <div className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 dot-bg opacity-40" />
          <div className="max-w-3xl mx-auto px-5 sm:px-8 relative">
            <div className="text-center mb-10">
              <div className="eyebrow justify-center mb-4">Careers Application</div>
              <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--navy)", letterSpacing: "-0.03em" }}>
                Join <span className="tg-purple">ISM Data Technology</span>
              </h1>
              <p style={{ color: "var(--text2)", marginTop: 12, fontSize: 14 }}>
                Choose an open position and our HR team will review your application.
              </p>
            </div>
            <div className="card p-8">
              {jobs.length > 0
                ? <ApplicationForm jobs={jobs} initialJobId={initialJobId} />
                : <p role="status" className="text-center text-sm" style={{ color: "var(--text2)" }}>No open positions are accepting applications right now.</p>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
