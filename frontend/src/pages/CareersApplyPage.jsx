import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ApplicationForm from "../components/careers/ApplicationForm.jsx";

export default function CareersApplyPage() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || "";

  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "error"

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error("Failed to load jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
        setStatus("ok");
      } catch {
        setStatus("error");
      }
    }
    loadJobs();
  }, []);

  // Validate that the jobId from the URL actually exists in the published list
  const initialJobId =
    jobId && jobs.some((j) => j.id === jobId) ? jobId : undefined;

  return (
    <main className="pt-[72px] min-h-screen s-soft">
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 dot-bg opacity-40" />

        <div className="max-w-3xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-10">
            <div className="eyebrow justify-center mb-4">Careers Application</div>
            <h1
              style={{
                fontSize: "clamp(2rem,5vw,3.5rem)",
                color: "var(--navy)",
                letterSpacing: "-0.03em",
              }}
            >
              Join <span className="tg-purple">ISM Data Technology</span>
            </h1>
            <p style={{ color: "var(--text2)", marginTop: 12, fontSize: 14 }}>
              Choose an open position and our HR team will review your application.
            </p>
          </div>

          <div className="card p-8">
            {status === "loading" && (
              <p
                role="status"
                className="text-center text-sm py-8"
                style={{ color: "var(--text2)" }}
              >
                Loading open positions…
              </p>
            )}

            {status === "error" && (
              <div className="text-center py-8">
                <p className="text-sm mb-4" style={{ color: "var(--text2)" }}>
                  Unable to load open positions right now. Please try again later.
                </p>
                <Link to="/careers" className="btn-outline text-sm">
                  Back to Careers
                </Link>
              </div>
            )}

            {status === "ok" && jobs.length === 0 && (
              <p
                role="status"
                className="text-center text-sm py-8"
                style={{ color: "var(--text2)" }}
              >
                No open positions are accepting applications right now.
              </p>
            )}

            {status === "ok" && jobs.length > 0 && (
              <ApplicationForm jobs={jobs} initialJobId={initialJobId} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
