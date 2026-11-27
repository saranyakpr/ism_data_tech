import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  MapPin,
  Monitor,
} from "lucide-react";
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "../lib/jobs.js";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "notfound" | "error"

  useEffect(() => {
    if (!id) {
      setStatus("notfound");
      return;
    }

    async function loadJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.status === 404) {
          setStatus("notfound");
          return;
        }
        if (!res.ok) throw new Error("Failed to load job");
        const data = await res.json();
        if (!data.job) {
          setStatus("notfound");
          return;
        }
        setJob(data.job);
        setStatus("ok");
      } catch {
        setStatus("error");
      }
    }

    loadJob();
  }, [id]);

  if (status === "loading") {
    return (
      <main className="min-h-screen s-soft pt-[72px] flex items-center justify-center">
        <p style={{ color: "var(--text2)", fontSize: 15 }}>Loading job details…</p>
      </main>
    );
  }

  if (status === "notfound") {
    return (
      <main className="min-h-screen s-soft pt-[72px] flex flex-col items-center justify-center gap-5 px-5 text-center">
        <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 28, color: "var(--ism-slate)" }}>
          Job Not Found
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 15 }}>
          This position may have been filled or the link is incorrect.
        </p>
        <Link to="/careers#openings" className="btn-primary" style={{ display: "inline-flex" }}>
          <ArrowLeft size={15} /> View All Openings
        </Link>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen s-soft pt-[72px] flex flex-col items-center justify-center gap-5 px-5 text-center">
        <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 28, color: "var(--ism-slate)" }}>
          Unable to Load Job
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 15 }}>
          Please try again later.
        </p>
        <Link to="/careers#openings" className="btn-outline" style={{ display: "inline-flex" }}>
          <ArrowLeft size={15} /> Back to Careers
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen s-soft pt-[72px]">
      {/* Header */}
      <section
        className="relative overflow-hidden py-16 sm:py-20"
        style={{ background: "var(--d1)" }}
      >
        <div className="pointer-events-none absolute inset-0 fine-grid opacity-40" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <Link
            to="/careers#openings"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--cyan)" }}
          >
            <ArrowLeft size={16} />
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
              {job.department}
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
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm" style={{ color: "var(--text2)" }}>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} style={{ color: "var(--cyan)" }} />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <BriefcaseBusiness size={16} style={{ color: "var(--cyan)" }} />
              {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
            </span>
            <span className="inline-flex items-center gap-2">
              <Monitor size={16} style={{ color: "var(--cyan)" }} />
              {WORK_MODE_LABELS[job.work_mode]}
            </span>
            <span className="inline-flex items-center gap-2">
              <Building2 size={16} style={{ color: "var(--cyan)" }} />
              {job.experience}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-12 sm:py-16" style={{ background: "var(--d2)" }}>
        <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <article className="card-glow p-6 sm:p-8">
              <h2 className="mb-4 text-xl font-extrabold" style={{ color: "var(--ism-slate)" }}>
                Job Description
              </h2>
              <p className="whitespace-pre-line text-sm leading-7" style={{ color: "var(--text2)" }}>
                {job.description}
              </p>
            </article>

            {job.responsibilities?.length > 0 && (
              <article className="card-glow p-6 sm:p-8">
                <h2 className="mb-4 text-xl font-extrabold" style={{ color: "var(--ism-slate)" }}>
                  Responsibilities
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7" style={{ color: "var(--text2)" }}>
                  {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </article>
            )}

            {job.requirements?.length > 0 && (
              <article className="card-glow p-6 sm:p-8">
                <h2 className="mb-4 text-xl font-extrabold" style={{ color: "var(--ism-slate)" }}>
                  Requirements
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7" style={{ color: "var(--text2)" }}>
                  {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </article>
            )}

            {job.qualifications?.length > 0 && (
              <article className="card-glow p-6 sm:p-8">
                <h2 className="mb-4 text-xl font-extrabold" style={{ color: "var(--ism-slate)" }}>
                  Qualifications
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7" style={{ color: "var(--text2)" }}>
                  {job.qualifications.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </article>
            )}
          </motion.div>

          {/* Sticky apply sidebar */}
          <motion.aside
            className="h-fit card-glow p-6 sm:p-7 lg:sticky lg:top-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="mb-3 text-lg font-extrabold" style={{ color: "var(--ism-slate)" }}>
              Ready to apply?
            </h2>
            <p className="mb-6 text-sm leading-6" style={{ color: "var(--text2)" }}>
              Submit your application for this position and our team will be in touch.
            </p>
            <Link
              to={`/careers/apply?jobId=${encodeURIComponent(job.id)}`}
              className="btn-primary flex w-full items-center justify-center gap-2"
            >
              Apply Now
              <ArrowRight size={15} />
            </Link>
            {job.deadline && (
              <p className="mt-4 text-xs" style={{ color: "var(--text3)" }}>
                Application deadline: {job.deadline}
              </p>
            )}
          </motion.aside>
        </div>
      </section>
    </main>
  );
}
