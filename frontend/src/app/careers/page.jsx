
import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import JobListings from "@/components/careers/JobListings";

import {
  ArrowRight,
  Bus,
  CalendarDays,
  Gamepad2,
  Heart,
  Lightbulb,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

// Fetch published jobs from the Express backend.
function PublishedJobListings() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error("Unable to load available positions.");
        }

        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to load published jobs:", err);

        setError(
          "Please try again later. Our open positions could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  if (loading) {
    return <JobListingsLoading />;
  }

  return <JobListings jobs={jobs} error={error} />;
}

function JobListingsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="card-glow p-12 text-center"
    >
      <p
        style={{
          color: "var(--text2)",
          lineHeight: 1.8,
          fontSize: 14,
        }}
      >
        Loading current openings...
      </p>
    </div>
  );
}

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Structured paths to advance within the company.",
    col: "#0055ff",
  },
  {
    icon: Users,
    title: "Collaborative Team",
    desc: "Work with a supportive team committed to excellence.",
    col: "#0055ff",
  },
  {
    icon: Heart,
    title: "Meaningful Work",
    desc: "Your work helps preserve history and empower communities.",
    col: "#E8447A",
  },
  {
    icon: Star,
    title: "Inclusive Culture",
    desc: "We create opportunities for rural women professionals.",
    col: "#8ca4bc",
  },
];

const LIFE_AT_ISM = [
  { icon: Lightbulb, label: "Brainstorming" },
  { icon: CalendarDays, label: "Cultural Events" },
  { icon: Bus, label: "Team Outings" },
  { icon: Gamepad2, label: "Workplace Fun" },
];

export default function CareersPage() {
  return (
    <>
      <ScrollProgress />


      <main className="pt-[72px]">
        {/* Hero */}
        <div
          className="py-24 relative overflow-hidden"
          style={{ background: "var(--d1)" }}
        >
          <div className="absolute inset-0 fine-grid opacity-40 pointer-events-none" />

          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(0,85,255,0.07) 0%,transparent 70%)",
              transform: "translate(30%,-30%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
            <div className="max-w-3xl">
              <div className="eyebrow mb-6">We're Hiring</div>

              <h1
                style={{
                  fontSize: "clamp(2.5rem,6.5vw,5rem)",
                  color: "var(--ism-slate)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.02,
                  marginBottom: 20,
                }}
              >
                Build Your Future With{" "}
                <span className="tg-main">ISM Data Technology</span>
              </h1>

              <p
                style={{
                  color: "var(--text2)",
                  fontSize: 17,
                  lineHeight: 1.8,
                  marginBottom: 32,
                  maxWidth: 560,
                }}
              >
                Join a growing team where talent, innovation and
                opportunities come together. We believe in empowering
                people — especially rural women professionals — to
                build meaningful careers.
              </p>

              <a
                href="#openings"
                className="btn-primary"
                style={{ display: "inline-flex" }}
              >
                View Open Positions
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="py-16" style={{ background: "var(--d2)" }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <h2
              className="text-center mb-10"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 28,
                color: "var(--ism-slate)",
              }}
            >
              Why Work With Us
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BENEFITS.map((b, i) => (
                <div key={i} className="card-glow p-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: `${b.col}15`,
                      border: `1px solid ${b.col}30`,
                    }}
                  >
                    <b.icon size={20} style={{ color: b.col }} />
                  </div>

                  <div
                    className="h-0.5 w-7 rounded-full mb-3"
                    style={{
                      background: "linear-gradient(90deg,#0055ff,#0055ff)",
                    }}
                  />

                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 800,
                      fontSize: 16,
                      color: "var(--ism-slate)",
                      marginBottom: 8,
                    }}
                  >
                    {b.title}
                  </h3>

                  <p
                    style={{
                      color: "var(--text2)",
                      fontSize: 15,
                      lineHeight: 1.7,
                    }}
                  >
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Life at ISM */}
        <div className="py-16" style={{ background: "var(--d1)" }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <h2
              className="text-center mb-8"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 28,
                color: "var(--ism-slate)",
              }}
            >
              Life at ISM
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {LIFE_AT_ISM.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="card-glow h-40 flex flex-col items-center justify-center gap-3 rounded-2xl"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(0,85,255,0.12)",
                      border: "1px solid rgba(0,85,255,0.25)",
                    }}
                  >
                    <Icon
                      size={21}
                      strokeWidth={1.8}
                      style={{ color: "var(--cyan)" }}
                    />
                  </div>

                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text2)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div
          id="openings"
          className="py-16"
          style={{ background: "var(--d2)" }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-10">
              <div className="eyebrow justify-center mb-4">
                Open Positions
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 32,
                  color: "var(--ism-slate)",
                }}
              >
                Current <span className="tg-main">Openings</span>
              </h2>
            </div>

            <PublishedJobListings />
          </div>
        </div>
      </main>


      <BackToTop />
    </>
  );
}
