import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, getAdminAuthConfig, verifyAdminSessionToken, } from "@/lib/admin-auth";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
    const config = getAdminAuthConfig();
    const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    redirect(config && verifyAdminSessionToken(token, config.sessionSecret)
        ? "/admin/careers"
        : "/admin/login");
}
