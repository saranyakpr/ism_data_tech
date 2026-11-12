import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  MapPin,
  Monitor,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { sql } from "@/lib/neon";
import type { Job } from "@/lib/supabase/database.types";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODE_LABELS,
} from "@/lib/jobs";

type PublicJobDetails = Pick<
  Job,
  | "id"
  | "title"
  | "department"
  | "location"
  | "employment_type"
  | "work_mode"
  | "experience"
  | "description"
  | "requirements"
  | "responsibilities"
  | "qualifications"
  | "deadline"
>;

export const metadata: Metadata = {
  title: "Job Details - Careers",
  description: "Explore an open role at ISM Data Technology.",
};

export default async function CareerJobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  let job: PublicJobDetails | undefined;
  try {
    const jobs = await sql`
      SELECT id, title, department, location, employment_type, work_mode,
        experience, description, requirements, responsibilities, qualifications,
        deadline
      FROM jobs
      WHERE id = ${id}
        AND state = 'published'
        AND (deadline IS NULL OR deadline >= CURRENT_DATE)
      LIMIT 1
    ` as PublicJobDetails[];
    job = jobs[0];
  } catch (error) {
    console.error(
      "Failed to fetch public career job details:",
      error instanceof Error ? error.message : "Unknown server error",
    );
    throw new Error("Unable to load job details.");
  }
  if (!job) notFound();

  const details = job;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen s-soft pt-[72px]">
        <section className="relative overflow-hidden py-16 sm:py-20" style={{ background: "var(--d1)" }}>
          <div className="pointer-events-none absolute inset-0 fine-grid opacity-40" />
          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <Link
              href="/careers#openings"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--cyan)" }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              All Open Positions
            </Link>
            <div className="mb-5">
              <span
                className="rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                style={{
                  background: "rgba(0,85,255,0.12)",
                  color: "var(--cyan)",
                  borderColor: "rgba(0,85,255,0.25)",
                }}
              >
                {details.department}
              </span>
            </div>
            <h1
              className="mb-7"
              style={{
                color: "var(--ism-slate)",
                fontSize: "clamp(2rem,5vw,3.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
              }}
            >
              {details.title}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm" style={{ color: "var(--text2)" }}>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} style={{ color: "var(--cyan)" }} aria-hidden="true" />
                {details.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <BriefcaseBusiness size={16} style={{ color: "var(--cyan)" }} aria-hidden="true" />
                {EMPLOYMENT_TYPE_LABELS[details.employment_type]}
              </span>
              <span className="inline-flex items-center gap-2">
                <Monitor size={16} style={{ color: "var(--cyan)" }} aria-hidden="true" />
                {WORK_MODE_LABELS[details.work_mode]}
              </span>
              <span className="inline-flex items-center gap-2">
                <Building2 size={16} style={{ color: "var(--cyan)" }} aria-hidden="true" />
                {details.experience}
              </span>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16" style={{ background: "var(--d2)" }}>
          <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-8">
              <article className="card-glow p-6 sm:p-8">
                <h2 className="mb-4 text-xl font-extrabold" style={{ color: "var(--ism-slate)" }}>
                  Job Description
                </h2>
                <p className="whitespace-pre-line text-sm leading-7" style={{ color: "var(--text2)" }}>
                  {details.description}
                </p>
              </article>

              {details.responsibilities.length > 0 && (
                <article className="card-glow p-6 sm:p-8">
                  <h2 className="mb-4 text-xl font-extrabold" style={{ color: "var(--ism-slate)" }}>
                    Responsibilities
                  </h2>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-7" style={{ color: "var(--text2)" }}>
                    {details.responsibilities.map((responsibility, index) => (
                      <li key={`${index}-${responsibility}`}>{responsibility}</li>
                    ))}
                  </ul>
                </article>
              )}

              {details.requirements.length > 0 && (
                <article className="card-glow p-6 sm:p-8">
                  <h2 className="mb-4 text-xl font-extrabold" style={{ color: "var(--ism-slate)" }}>
                    Requirements
                  </h2>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-7" style={{ color: "var(--text2)" }}>
                    {details.requirements.map((requirement, index) => (
                      <li key={`${index}-${requirement}`}>{requirement}</li>
                    ))}
                  </ul>
                </article>
              )}

              {details.qualifications.length > 0 && (
                <article className="card-glow p-6 sm:p-8">
                  <h2 className="mb-4 text-xl font-extrabold" style={{ color: "var(--ism-slate)" }}>
                    Qualifications
                  </h2>
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-7" style={{ color: "var(--text2)" }}>
                    {details.qualifications.map((qualification, index) => (
                      <li key={`${index}-${qualification}`}>{qualification}</li>
                    ))}
                  </ul>
                </article>
              )}
            </div>

            <aside className="h-fit card-glow p-6 sm:p-7 lg:sticky lg:top-24">
              <h2 className="mb-3 text-lg font-extrabold" style={{ color: "var(--ism-slate)" }}>
                Ready to apply?
              </h2>
              <p className="mb-6 text-sm leading-6" style={{ color: "var(--text2)" }}>
                Submit your application for this position and our team will be in touch.
              </p>
              <Link
                href={`/careers/apply?jobId=${encodeURIComponent(details.id)}`}
                className="btn-primary flex w-full items-center justify-center gap-2"
              >
                Apply Now
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              {details.deadline && (
                <p className="mt-4 text-xs" style={{ color: "var(--text3)" }}>
                  Application deadline: {details.deadline}
                </p>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
