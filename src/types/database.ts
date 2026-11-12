export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type JobState = "draft" | "published" | "closed";
export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship";
export type WorkMode = "on_site" | "remote" | "hybrid";
export type ApplicationStatus =
  | "new"
  | "under_review"
  | "shortlisted"
  | "interview_scheduled"
  | "selected"
  | "rejected";

type JobRow = {
  id: string;
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
  published_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
};

type JobInsert = {
  id?: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: EmploymentType;
  work_mode: WorkMode;
  experience: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  deadline?: string | null;
  state?: JobState;
  published_at?: string | null;
  closed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type JobUpdate = {
  id?: string;
  slug?: string;
  title?: string;
  department?: string;
  location?: string;
  employment_type?: EmploymentType;
  work_mode?: WorkMode;
  experience?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  deadline?: string | null;
  state?: JobState;
  published_at?: string | null;
  closed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ApplicationRow = {
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
  consent: boolean;
  status: ApplicationStatus;
  resume_storage_key: string;
  resume_original_name: string;
  resume_content_type: string;
  resume_size_bytes: number;
  submitted_at: string;
  updated_at: string;
};

type ApplicationInsert = {
  id?: string;
  job_id: string;
  // Filled from the referenced job title by the database trigger.
  job_title_snapshot?: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  education: string;
  skills: string;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  cover_letter?: string | null;
  consent: boolean;
  status?: ApplicationStatus;
  resume_storage_key: string;
  resume_original_name: string;
  resume_content_type: string;
  resume_size_bytes: number;
  submitted_at?: string;
  updated_at?: string;
};

type ApplicationUpdate = {
  id?: string;
  job_id?: string;
  job_title_snapshot?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: string;
  education?: string;
  skills?: string;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  cover_letter?: string | null;
  consent?: boolean;
  status?: ApplicationStatus;
  resume_storage_key?: string;
  resume_original_name?: string;
  resume_content_type?: string;
  resume_size_bytes?: number;
  submitted_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: JobRow;
        Insert: JobInsert;
        Update: JobUpdate;
        Relationships: [];
      };
      applications: {
        Row: ApplicationRow;
        Insert: ApplicationInsert;
        Update: ApplicationUpdate;
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      job_state: JobState;
      employment_type: EmploymentType;
      work_mode: WorkMode;
      application_status: ApplicationStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type JobCreate = Database["public"]["Tables"]["jobs"]["Insert"];
export type JobChanges = Database["public"]["Tables"]["jobs"]["Update"];
export type Application =
  Database["public"]["Tables"]["applications"]["Row"];
export type ApplicationCreate =
  Database["public"]["Tables"]["applications"]["Insert"];
export type ApplicationChanges =
  Database["public"]["Tables"]["applications"]["Update"];
