import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";
import { ADMIN_SESSION_COOKIE, getAdminAuthConfig, verifyAdminSessionToken, } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
export const metadata = {
    title: "Admin Login",
    robots: { index: false, follow: false },
};
export default async function AdminLoginPage() {
    const config = getAdminAuthConfig();
    const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    if (config && verifyAdminSessionToken(token, config.sessionSecret)) {
        redirect("/admin/careers");
    }
    return <AdminLogin />;
}
