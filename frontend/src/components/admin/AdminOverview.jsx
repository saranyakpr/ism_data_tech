import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BriefcaseBusiness, CheckCircle2, CircleDot, Clock3,
  FileText, LayoutDashboard, LockKeyhole, Star, Users,
} from "lucide-react";
import { safeAdminFetch } from "../../lib/admin-fetch.js";
const EMPTY = {
    counts: {
        totalJobs: 0,
        publishedJobs: 0,
        closedJobs: 0,
        totalApplications: 0,
        newApplications: 0,
        shortlistedApplications: 0,
    },
    recentJobs: [],
    recentApplications: [],
};
export default function AdminOverview() {
    const [data, setData] = useState(EMPTY);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        let active = true;
        safeAdminFetch("/api/admin/overview", { cache: "no-store" })
            .then(({ data: body }) => {
            if (!active) return;
            if (!body || !("counts" in body)) {
                throw new Error("Unable to load the dashboard overview.");
            }
            setData(body);
            setError("");
        })
            .catch((cause) => {
            if (active) {
                setError(cause instanceof Error
                    ? cause.message
                    : "Unable to load the dashboard overview.");
            }
        })
            .finally(() => {
            if (active)
                setLoading(false);
        });
        return () => {
            active = false;
        };
    }, []);
    const cards = [
        { label: "Total Jobs", value: data.counts.totalJobs, Icon: BriefcaseBusiness, theme: "blue" },
        { label: "Published Jobs", value: data.counts.publishedJobs, Icon: CheckCircle2, theme: "green" },
        { label: "Closed Jobs", value: data.counts.closedJobs, Icon: LockKeyhole, theme: "amber" },
        { label: "Total Applications", value: data.counts.totalApplications, Icon: Users, theme: "cyan" },
        { label: "New Applications", value: data.counts.newApplications, Icon: CircleDot, theme: "purple" },
        { label: "Shortlisted", value: data.counts.shortlistedApplications, Icon: Star, theme: "pink" },
    ];
    return (<section className="admin-overview admin-enter">
      <header className="admin-overview-heading">
        <div className="admin-heading-icon"><LayoutDashboard size={22}/></div>
        <div>
          <p className="admin-eyebrow">Careers workspace</p>
          <h1 className="admin-title">Dashboard Overview</h1>
          <p className="admin-subtitle">A live snapshot of jobs and candidate activity.</p>
        </div>
      </header>

      {error && <p role="alert" className="admin-alert">{error}</p>}

      <div className="admin-overview-cards">
        {cards.map(({ label, value, Icon, theme }) => (<article key={label} className={`admin-overview-card admin-overview-${theme}`}>
            <div className="admin-overview-card-icon"><Icon size={19}/></div>
            <div>
              <p>{label}</p>
              <strong>{loading ? "—" : value}</strong>
            </div>
          </article>))}
      </div>

      <section className="admin-activity-card">
        <div className="admin-activity-heading">
          <div>
            <p className="admin-eyebrow">Latest activity</p>
            <h2>Recent Job Openings</h2>
          </div>
          <Link to="/admin/careers/jobs" className="admin-inline-link"></Link>
        </div>
        {loading ? (<p className="admin-overview-empty">Loading recent jobs…</p>) : data.recentJobs.length === 0 ? (<p className="admin-overview-empty">No job openings yet.</p>) : (<div className="admin-recent-list">
            {data.recentJobs.map((job) => (<div key={job.id} className="admin-recent-row">
                <span className="admin-recent-icon"><BriefcaseBusiness size={16}/></span>
                <div className="min-w-0 flex-1">
                  <p className="admin-job-title">{job.title}</p>
                  <p className="admin-job-department">{job.department} · {job.location}</p>
                </div>
                <span className={`admin-state-badge ${job.state === "published" ? "admin-status-green" : job.state === "closed" ? "admin-status-amber" : "admin-status-muted"}`}>
                  <span className="admin-state-dot"/>{job.state}
                </span>
                <span className="admin-recent-meta"><Users size={14}/>{job.applicantCount}</span>
              </div>))}
          </div>)}
      </section>

      <section className="admin-activity-card">
        <div className="admin-activity-heading">
          <div>
            <p className="admin-eyebrow">Candidate pipeline</p>
            <h2>Recent Applications</h2>
          </div>
          <Link to="/admin/careers/applications" className="admin-inline-link"></Link>
        </div>
        {!loading && data.recentApplications.length > 0 && (<div className="admin-mini-chart" aria-label="Applications overview">
            <div>
              <span>New</span>
              <div className="admin-chart-track"><i style={{ width: `${chartPercent(data.counts.newApplications, data.counts.totalApplications)}%` }}/></div>
              <strong>{data.counts.newApplications}</strong>
            </div>
            <div>
              <span>Shortlisted</span>
              <div className="admin-chart-track admin-chart-purple"><i style={{ width: `${chartPercent(data.counts.shortlistedApplications, data.counts.totalApplications)}%` }}/></div>
              <strong>{data.counts.shortlistedApplications}</strong>
            </div>
          </div>)}
        {loading ? (<p className="admin-overview-empty">Loading recent applications…</p>) : data.recentApplications.length === 0 ? (<p className="admin-overview-empty">No applications have been submitted.</p>) : (<div className="admin-recent-list">
            {data.recentApplications.map((application) => (<div key={application.id} className="admin-recent-row">
                <span className="admin-recent-icon admin-recent-icon-cyan"><FileText size={16}/></span>
                <div className="min-w-0 flex-1">
                  <p className="admin-job-title">{application.full_name}</p>
                  <p className="admin-job-department">{application.job_title_snapshot} · {application.email}</p>
                </div>
                <span className={`admin-state-badge ${application.status === "new" ? "admin-status-blue" : application.status === "shortlisted" ? "admin-status-purple" : "admin-status-muted"}`}>
                  <span className="admin-state-dot"/>{application.status.replaceAll("_", " ")}
                </span>
                <span className="admin-recent-meta"><Clock3 size={14}/>{formatDate(application.submitted_at)}</span>
              </div>))}
          </div>)}
      </section>
    </section>);
}
function chartPercent(value, total) {
    return total === 0 ? 0 : Math.max(5, Math.round((value / total) * 100));
}
function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}
