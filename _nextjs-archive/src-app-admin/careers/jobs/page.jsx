import JobManagement from "@/components/admin/JobManagement";
export const metadata = {
    title: "Job Openings – Careers Admin",
    robots: { index: false, follow: false },
};
export default function AdminJobsPage() {
    return <JobManagement />;
}
