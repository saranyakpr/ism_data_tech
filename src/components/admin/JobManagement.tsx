"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Eye,
  FileText,
  LockKeyhole,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import type {
  EmploymentType,
  Job,
  JobState,
  WorkMode,
} from "@/types/database";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODE_LABELS,
} from "@/lib/jobs";

const PAGE_SIZE = 25;

type JobPayload = {
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: EmploymentType;
  work_mode: WorkMode;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: string[];
  deadline: string | null;
  state: JobState;
};

type JobWithApplicantCount = Job & { applicant_count: number };

type JobsResponse = {
  jobs: JobWithApplicantCount[];
  total: number;
  page: number;
  pageSize: number;
  summary: {
    total: number;
    draft: number;
    published: number;
    closed: number;
  };
};

const STATE_STYLES: Record<JobState, string> = {
  draft: "admin-status-cyan",
  published: "admin-status-green",
  closed: "admin-status-amber",
};

const FIELD_CLASS =
  "admin-field w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none";

export default function JobManagement() {
  const [jobs, setJobs] = useState<JobWithApplicantCount[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<JobsResponse["summary"]>({
    total: 0,
    draft: 0,
    published: 0,
    closed: 0,
  });
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<JobState | "all">("all");
  const [employmentFilter, setEmploymentFilter] =
    useState<EmploymentType | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchJobs = useCallback(async (requestedPage: number) => {
    const params = new URLSearchParams({
      page: String(requestedPage),
      pageSize: String(PAGE_SIZE),
    });
    if (search.trim()) params.set("search", search.trim());
    if (stateFilter !== "all") params.set("state", stateFilter);
    if (employmentFilter !== "all") {
      params.set("employmentType", employmentFilter);
    }
    const response = await fetch(`/api/admin/jobs?${params}`, {
      cache: "no-store",
    });
    const body = await response.json() as JobsResponse | { error?: string };
    if (!response.ok || !("jobs" in body)) {
      throw new Error(
        "error" in body && body.error
          ? body.error
          : "Unable to load jobs.",
      );
    }
    return body;
  }, [employmentFilter, search, stateFilter]);

  const loadJobs = useCallback(async (requestedPage: number) => {
    setIsLoading(true);
    setLoadError("");
    try {
      const body = await fetchJobs(requestedPage);
      setJobs(body.jobs);
      setTotal(body.total);
      setPage(body.page);
      setSummary(body.summary);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load jobs.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchJobs]);

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      try {
        const body = await fetchJobs(page);
        if (active) {
          setJobs(body.jobs);
          setTotal(body.total);
          setPage(body.page);
          setSummary(body.summary);
          setLoadError("");
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load jobs.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadPage();
    return () => {
      active = false;
    };
  }, [fetchJobs, page]);

  const saveJob = async (payload: JobPayload) => {
    setIsSaving(true);
    setActionError("");
    try {
      const response = await fetch(
        editingJob ? `/api/admin/jobs/${editingJob.id}` : "/api/admin/jobs",
        {
          method: editingJob ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const body = await response.json() as { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Unable to save the job.");
      }

      setEditingJob(null);
      setIsCreating(false);
      await loadJobs(page);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to save the job.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const changeJobState = async (job: Job, state: JobState) => {
    setActionError("");
    try {
      const response = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(job, state)),
      });
      const body = await response.json() as { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Unable to update the job.");
      }
      setOpenMenuId(null);
      await loadJobs(page);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to update the job.",
      );
    }
  };

  return (
    <section id="jobs" className="admin-section admin-enter">
      <div className="admin-section-heading">
        <div className="flex items-center gap-4">
          <div className="admin-heading-icon"><Briefcase size={23} /></div>
          <div>
            <p className="admin-eyebrow">Recruitment workspace</p>
            <h1 className="admin-title">Job Management</h1>
            <p className="admin-subtitle">
              Create and manage job openings for your organization.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setActionError("");
            setEditingJob(null);
            setIsCreating(true);
          }}
          className="admin-new-job"
        >
          <Plus size={18} /> New Job
        </button>
      </div>

      <div className="admin-summary-grid">
        {[
          { label: "Total Jobs", value: summary.total, Icon: FileText, theme: "blue" },
          { label: "Draft Jobs", value: summary.draft, Icon: CircleDot, theme: "green" },
          { label: "Published Jobs", value: summary.published, Icon: Star, theme: "purple" },
          { label: "Closed Jobs", value: summary.closed, Icon: LockKeyhole, theme: "amber" },
        ].map(({ label, value, Icon, theme }) => (
          <article key={label} className={`admin-stat-card admin-stat-${theme}`}>
            <div className="admin-stat-icon"><Icon size={22} /></div>
            <div className="min-w-0">
              <p>{label}</p>
              <strong>{isLoading && summary.total === 0 ? "—" : value}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-job-filters">
        <label className="admin-search">
          <Search size={18} aria-hidden="true" />
          <input
            value={search}
            maxLength={100}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
              setIsLoading(true);
            }}
            placeholder="Search jobs..."
            aria-label="Search jobs"
          />
        </label>
        <select
          value={stateFilter}
          onChange={(event) => {
            setStateFilter(event.target.value as JobState | "all");
            setPage(1);
            setIsLoading(true);
          }}
          className="admin-field"
          aria-label="Filter by job status"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={employmentFilter}
          onChange={(event) => {
            setEmploymentFilter(event.target.value as EmploymentType | "all");
            setPage(1);
            setIsLoading(true);
          }}
          className="admin-field"
          aria-label="Filter by employment type"
        >
          <option value="all">All Employment Types</option>
          {(Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][]).map(
            ([value, label]) => <option key={value} value={value}>{label}</option>,
          )}
        </select>
      </div>

      {actionError && (
        <p role="alert" className="admin-alert">{actionError}</p>
      )}

      {isLoading ? (
        <p role="status" className="admin-empty">
          Loading jobs…
        </p>
      ) : loadError ? (
        <div role="alert" className="admin-empty">
          <p className="mb-3">{loadError}</p>
          <button
            type="button"
            onClick={() => void loadJobs(page)}
            className="admin-secondary-button"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="admin-empty">
          <Briefcase size={27} className="mx-auto mb-3 text-blue-300/70" />
          <p>{search || stateFilter !== "all" || employmentFilter !== "all"
            ? "No jobs match your filters."
            : "No job openings yet."}</p>
          <span>Create a job and save it as a draft or publish it.</span>
        </div>
      ) : (
        <>
          <div className="admin-table-card">
            <div className="overflow-x-auto">
              <table className="admin-jobs-table">
                <thead>
                  <tr>
                  {["Job", "Location", "Type / Mode", "Deadline", "Applicants", "State", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      className="text-left"
                    >
                      {heading}
                    </th>
                  ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                    <td>
                      <p className="admin-job-title">{job.title}</p>
                      <p className="admin-job-department">{job.department}</p>
                    </td>
                    <td className="admin-location">
                      <MapPin size={15} />
                      <span>{job.location}</span>
                    </td>
                    <td>
                      <div className="admin-pill-stack">
                        <span className="admin-pill admin-pill-blue">{EMPLOYMENT_TYPE_LABELS[job.employment_type]}</span>
                        <span className="admin-pill admin-pill-muted">{WORK_MODE_LABELS[job.work_mode]}</span>
                      </div>
                    </td>
                    <td className="admin-table-muted">{job.deadline ?? "—"}</td>
                    <td className="admin-applicant-count">
                      <UsersRound size={17} />
                      {job.applicant_count}
                    </td>
                    <td>
                      <span className={`admin-state-badge ${STATE_STYLES[job.state]}`}>
                        <span className="admin-state-dot" />
                        {job.state}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setActionError("");
                            setIsCreating(false);
                            setEditingJob(job);
                          }}
                          className="admin-icon-button"
                          aria-label={`Edit ${job.title}`}
                          title="Edit job"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingJob(job)}
                          className="admin-icon-button"
                          aria-label={`View ${job.title}`}
                          title="View job details"
                        >
                          <Eye size={16} />
                        </button>
                        <div className="admin-more-wrap">
                          <button
                            type="button"
                            onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                            className="admin-icon-button"
                            aria-label={`More actions for ${job.title}`}
                            aria-expanded={openMenuId === job.id}
                          >
                            <MoreHorizontal size={17} />
                          </button>
                          {openMenuId === job.id && (
                            <div className="admin-action-menu">
                              <button type="button" onClick={() => void changeJobState(job, job.state === "published" ? "draft" : "published")}>
                                {job.state === "closed" ? "Reopen" : job.state === "published" ? "Unpublish to draft" : "Publish"}
                              </button>
                              {job.state !== "closed" && (
                                <button type="button" onClick={() => void changeJobState(job, "closed")}>Close position</button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-pagination">
            <p>
              {total === 0 ? "0 jobs" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} jobs`}
            </p>
            <div className="admin-pagination-controls">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setPage((current) => Math.max(1, current - 1));
                }}
                className="admin-page-button"
                aria-label="Previous jobs page"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="admin-page-current">{page}</span>
              <span className="admin-page-total">/ {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setPage((current) => current + 1);
                }}
                className="admin-page-button"
                aria-label="Next jobs page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}

      {(isCreating || editingJob) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto p-4 flex items-start justify-center">
          <JobEditor
            job={editingJob}
            isSaving={isSaving}
            error={actionError}
            onCancel={() => {
              setIsCreating(false);
              setEditingJob(null);
              setActionError("");
            }}
            onSave={saveJob}
          />
        </div>
      )}
      {viewingJob && (
        <JobDetails job={viewingJob} onClose={() => setViewingJob(null)} />
      )}
    </section>
  );
}

function JobDetails({ job, onClose }: { job: Job; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#020817]/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <section className="admin-editor-card my-4 w-full max-w-2xl p-6 sm:p-8" onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="admin-eyebrow">Position overview</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{job.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{job.department} · {job.location}</p>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-button" aria-label="Close job details"><X size={17} /></button>
        </div>
        <div className="space-y-5 text-sm text-slate-300">
          <DetailSection title="Description" value={job.description} />
          <DetailSection title="Experience" value={job.experience} />
          <DetailSection title="Requirements" value={job.requirements.join("\n")} />
          <DetailSection title="Responsibilities" value={job.responsibilities.join("\n")} />
          <DetailSection title="Qualifications" value={job.qualifications.join("\n")} />
        </div>
        <div className="mt-7 flex justify-end">
          <button type="button" onClick={onClose} className="admin-secondary-button">Close</button>
        </div>
      </section>
    </div>
  );
}

function DetailSection({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h3 className="mb-1 font-semibold text-white">{title}</h3>
      <p className="whitespace-pre-line leading-6">{value || "Not specified"}</p>
    </div>
  );
}

function JobEditor({
  job,
  isSaving,
  error,
  onCancel,
  onSave,
}: {
  job: Job | null;
  isSaving: boolean;
  error: string;
  onCancel: () => void;
  onSave: (payload: JobPayload) => Promise<void>;
}) {
  const [title, setTitle] = useState(job?.title ?? "");
  const [slug, setSlug] = useState(job?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(job));
  const [department, setDepartment] = useState(job?.department ?? "");
  const [location, setLocation] = useState(job?.location ?? "");
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    job?.employment_type ?? "full_time",
  );
  const [workMode, setWorkMode] = useState<WorkMode>(
    job?.work_mode ?? "on_site",
  );
  const [experience, setExperience] = useState(job?.experience ?? "");
  const [description, setDescription] = useState(job?.description ?? "");
  const [requirements, setRequirements] = useState(
    job?.requirements.join("\n") ?? "",
  );
  const [responsibilities, setResponsibilities] = useState(
    job?.responsibilities.join("\n") ?? "",
  );
  const [qualifications, setQualifications] = useState(
    job?.qualifications.join("\n") ?? "",
  );
  const [deadline, setDeadline] = useState(job?.deadline ?? "");
  const [formError, setFormError] = useState("");

  const submit = async (state: JobState) => {
    const payload: JobPayload = {
      slug: slug.trim(),
      title: title.trim(),
      department: department.trim(),
      location: location.trim(),
      employment_type: employmentType,
      work_mode: workMode,
      experience: experience.trim(),
      description: description.trim(),
      requirements: parseLines(requirements),
      responsibilities: parseLines(responsibilities),
      qualifications: parseLines(qualifications),
      deadline: deadline || null,
      state,
    };

    if (
      !payload.title ||
      !payload.slug ||
      !payload.department ||
      !payload.location ||
      !payload.experience ||
      !payload.description
    ) {
      setFormError("Complete all required fields before saving.");
      return;
    }

    setFormError("");
    await onSave(payload);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit(job?.state ?? "draft");
      }}
      className="admin-editor-card rounded-2xl p-5 sm:p-7 w-full max-w-3xl my-4"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">
            {job ? "Edit Job Opening" : "Create Job Opening"}
          </h2>
          <p className="text-[#8fa3bf] text-sm mt-1">
            Required fields are marked in the form.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-[#8fa3bf] hover:text-white p-1"
          aria-label="Close job editor"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Job title">
          <input
            required
            maxLength={160}
            value={title}
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);
              if (!slugEdited) setSlug(makeSlug(nextTitle));
            }}
            className={FIELD_CLASS}
          />
        </Field>
        <Field label="Slug">
          <input
            required
            maxLength={120}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setSlugEdited(true);
            }}
            className={FIELD_CLASS}
          />
        </Field>
        <Field label="Department">
          <input required maxLength={120} value={department} onChange={(e) => setDepartment(e.target.value)} className={FIELD_CLASS} />
        </Field>
        <Field label="Location">
          <input required maxLength={160} value={location} onChange={(e) => setLocation(e.target.value)} className={FIELD_CLASS} />
        </Field>
        <Field label="Employment type">
          <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmploymentType)} className={FIELD_CLASS}>
            {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>
        <Field label="Work mode">
          <select value={workMode} onChange={(e) => setWorkMode(e.target.value as WorkMode)} className={FIELD_CLASS}>
            {Object.entries(WORK_MODE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>
        <Field label="Experience">
          <input required maxLength={120} value={experience} onChange={(e) => setExperience(e.target.value)} className={FIELD_CLASS} />
        </Field>
        <Field label="Deadline (optional)">
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={FIELD_CLASS} />
        </Field>
        <Field label="Description" wide>
          <textarea required maxLength={10000} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={`${FIELD_CLASS} resize-y`} />
        </Field>
        <Field label="Requirements (one per line)" wide>
          <textarea rows={3} value={requirements} onChange={(e) => setRequirements(e.target.value)} className={`${FIELD_CLASS} resize-y`} />
        </Field>
        <Field label="Responsibilities (one per line)" wide>
          <textarea rows={3} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} className={`${FIELD_CLASS} resize-y`} />
        </Field>
        <Field label="Qualifications (one per line)" wide>
          <textarea rows={3} value={qualifications} onChange={(e) => setQualifications(e.target.value)} className={`${FIELD_CLASS} resize-y`} />
        </Field>
      </div>

      {(formError || error) && (
        <p role="alert" className="text-red-400 text-sm mt-4">{formError || error}</p>
      )}

      <div className="flex flex-wrap justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} className="admin-secondary-button">
          Cancel
        </button>
        <button type="button" disabled={isSaving} onClick={() => void submit("draft")} className="admin-secondary-button disabled:opacity-50">
          Save Draft
        </button>
        {job && job.state !== "closed" && (
          <button type="button" disabled={isSaving} onClick={() => void submit("closed")} className="admin-secondary-button disabled:opacity-50">
            Close Opening
          </button>
        )}
        <button type="button" disabled={isSaving} onClick={() => void submit("published")} className="btn-primary text-sm disabled:opacity-50">
          {isSaving ? "Saving…" : "Publish"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs font-medium text-[#a8bdd8] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120)
    .replace(/-$/, "");
}

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toPayload(job: Job, state: JobState): JobPayload {
  return {
    slug: job.slug,
    title: job.title,
    department: job.department,
    location: job.location,
    employment_type: job.employment_type,
    work_mode: job.work_mode,
    experience: job.experience,
    description: job.description,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    qualifications: job.qualifications,
    deadline: job.deadline,
    state,
  };
}
