"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";
import type { ApplicationStatus } from "@/types/database";

const PAGE_SIZE = 25;

type AdminApplication = {
  id: string;
  job_id: string;
  job_title_snapshot: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  education: string;
  skills: string;
  linkedin_url: string | null;
  portfolio_url: string | null;
  cover_letter: string | null;
  status: ApplicationStatus;
  resume_original_name: string;
  resume_content_type: string;
  resume_size_bytes: number;
  submitted_at: string;
  updated_at: string;
};

type ApplicationsResponse = {
  applications: AdminApplication[];
  total: number;
  page: number;
  pageSize: number;
};

const STATUS_OPTIONS: Array<{ value: ApplicationStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "under_review", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_CLASS: Record<ApplicationStatus, string> = {
  new: "admin-status-blue",
  under_review: "admin-status-amber",
  shortlisted: "admin-status-purple",
  interview_scheduled: "admin-status-cyan",
  selected: "admin-status-green",
  rejected: "admin-status-red",
};

export default function ApplicationManagement() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [selected, setSelected] = useState<AdminApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchApplications = useCallback(async (requestedPage: number) => {
    const params = new URLSearchParams({
      page: String(requestedPage),
      pageSize: String(PAGE_SIZE),
    });
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "all") params.set("status", statusFilter);
    const response = await fetch(`/api/admin/applications?${params}`, {
      cache: "no-store",
    });
    const body = await response.json() as ApplicationsResponse | { error?: string };
    if (!response.ok || !("applications" in body)) {
      throw new Error(
        "error" in body && body.error
          ? body.error
          : "Unable to load applications.",
      );
    }
    return body;
  }, [search, statusFilter]);

  useEffect(() => {
    let active = true;
    fetchApplications(page)
      .then((body) => {
        if (active) {
          setApplications(body.applications);
          setTotal(body.total);
          setPage(body.page);
          setError("");
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Unable to load applications.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchApplications, page]);

  const changeStatus = async (application: AdminApplication, status: ApplicationStatus) => {
    setSavingId(application.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Unable to update application.");
      if (selected?.id === application.id) {
        setSelected({ ...selected, status });
      }
      const refreshed = await fetchApplications(page);
      setApplications(refreshed.applications);
      setTotal(refreshed.total);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update application.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section className="admin-application-page admin-enter">
      <header className="admin-section-heading">
        <div className="flex items-center gap-4">
          <div className="admin-heading-icon"><Users size={22} /></div>
          <div>
            <p className="admin-eyebrow">Candidate pipeline</p>
            <h1 className="admin-title">Applications</h1>
            <p className="admin-subtitle">Review candidates and manage application status.</p>
          </div>
        </div>
        <div className="admin-total-chip"><Users size={15} />{total} total</div>
      </header>

      <div className="admin-application-filters">
        <label className="admin-search">
          <Search size={18} aria-hidden="true" />
          <input
            value={search}
            maxLength={100}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
              setLoading(true);
            }}
            placeholder="Search name, email or position..."
            aria-label="Search applications"
          />
        </label>
        <select
          className="admin-field"
          value={statusFilter}
          aria-label="Filter by application status"
          onChange={(event) => {
            setStatusFilter(event.target.value as ApplicationStatus | "all");
            setPage(1);
            setLoading(true);
          }}
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="admin-alert">{error}</p>}

      <div className="admin-table-card">
        <div className="overflow-x-auto">
          <table className="admin-applications-table">
            <thead>
              <tr>
                {["Applicant", "Applied Position", "Experience", "Location", "Applied Date", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="text-left">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && applications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <p className="admin-job-title">{application.full_name}</p>
                    <p className="admin-job-department">{application.email}</p>
                  </td>
                  <td className="admin-table-muted">{application.job_title_snapshot}</td>
                  <td className="admin-table-muted">{application.experience}</td>
                  <td className="admin-location"><MapPin size={14} /><span>{application.location}</span></td>
                  <td className="admin-table-muted">{formatDate(application.submitted_at)}</td>
                  <td>
                    <select
                      value={application.status}
                      disabled={savingId === application.id}
                      onChange={(event) => void changeStatus(application, event.target.value as ApplicationStatus)}
                      className={`admin-state-badge ${STATUS_CLASS[application.status]}`}
                      aria-label={`Status for ${application.full_name}`}
                    >
                      {STATUS_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        onClick={() => setSelected(application)}
                        className="admin-icon-button"
                        title="View application"
                        aria-label={`View ${application.full_name}'s application`}
                      >
                        <Eye size={16} />
                      </button>
                      <a
                        href={`/api/admin/applications/${application.id}/resume`}
                        className="admin-icon-button"
                        title="Download resume"
                        aria-label={`Download ${application.full_name}'s resume`}
                      >
                        <Download size={15} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <p role="status" className="admin-overview-empty">Loading applications…</p>
          ) : applications.length === 0 ? (
            <div className="admin-empty">
              <FileText size={26} className="mx-auto mb-3 text-blue-300/70" />
              <p>{search || statusFilter !== "all" ? "No applications match these filters." : "No applications have been submitted."}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="admin-pagination">
        <p>{total === 0 ? "0 applications" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} applications`}</p>
        <div className="admin-pagination-controls">
          <button type="button" className="admin-page-button" aria-label="Previous page" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setPage((current) => Math.max(1, current - 1)); }}>
            <ChevronLeft size={16} />
          </button>
          <span className="admin-page-current">{page}</span>
          <span className="admin-page-total">/ {totalPages}</span>
          <button type="button" className="admin-page-button" aria-label="Next page" disabled={page >= totalPages || loading} onClick={() => { setLoading(true); setPage((current) => current + 1); }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#020817]/80 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <section className="admin-editor-card my-4 w-full max-w-2xl p-6 sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="admin-eyebrow">Application details</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{selected.full_name}</h2>
                <p className="mt-1 text-sm text-cyan-300">{selected.job_title_snapshot}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="admin-icon-button" aria-label="Close application details"><X size={17} /></button>
            </div>
            <dl className="admin-application-details">
              <Detail label="Email" value={selected.email} />
              <Detail label="Phone" value={selected.phone} />
              <Detail label="Location" value={selected.location} />
              <Detail label="Experience" value={selected.experience} />
              <Detail label="Education" value={selected.education} />
              <Detail label="Skills" value={selected.skills} />
              <Detail label="Applied on" value={formatDate(selected.submitted_at)} />
              <Detail label="Resume" value={`${selected.resume_original_name} (${formatBytes(selected.resume_size_bytes)})`} />
              {selected.linkedin_url && <Detail label="LinkedIn" value={selected.linkedin_url} />}
              {selected.portfolio_url && <Detail label="Portfolio" value={selected.portfolio_url} />}
              {selected.cover_letter && <Detail label="Cover letter" value={selected.cover_letter} />}
            </dl>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <a className="admin-secondary-button" href={`/api/admin/applications/${selected.id}/resume`}><Download size={14} /> Download resume</a>
              <button type="button" onClick={() => setSelected(null)} className="admin-secondary-button">Close</button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.ceil(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
