import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { ADMIN_SESSION_COOKIE, getAdminAuthConfig, verifyAdminSessionToken, } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
export default async function AdminCareersLayout({ children, }) {
    const config = getAdminAuthConfig();
    const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    const isAuthenticated = config !== null && verifyAdminSessionToken(token, config.sessionSecret);
    if (!isAuthenticated)
        redirect("/admin/login");
    return <AdminDashboard>{children}</AdminDashboard>;
}
