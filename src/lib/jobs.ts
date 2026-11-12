import type { Job as DatabaseJob, EmploymentType, WorkMode } from "@/types/database";

export type PublicJob = Pick<
  DatabaseJob,
  | "id"
  | "slug"
  | "title"
  | "department"
  | "location"
  | "employment_type"
  | "work_mode"
  | "experience"
  | "description"
  | "deadline"
>;

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  on_site: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};
