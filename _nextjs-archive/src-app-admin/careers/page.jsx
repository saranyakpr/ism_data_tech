import AdminOverview from "@/components/admin/AdminOverview";
export const metadata = {
    title: "Admin Dashboard – Careers",
    description: "Overview of careers jobs and applications.",
    robots: { index: false, follow: false },
};
export default function AdminCareersPage() {
    return <AdminOverview />;
}
