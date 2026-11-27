import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, LayoutDashboard, LogOut, Menu, Users, X, Images } from "lucide-react";
import { safeAdminFetch } from "../../lib/admin-fetch.js";
const navigation = [
    { href: "/admin/careers", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/admin/careers/jobs", label: "Job Openings", Icon: BriefcaseBusiness },
    { href: "/admin/careers/applications", label: "Applications", Icon: Users },
    { href: "/admin/careers/life-at-ism", label: "Life at ISM", Icon: Images },
];
export default function AdminDashboard({ children, }) {
    const [logoutError, setLogoutError] = useState("");
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const { pathname } = useLocation();
const navigate = useNavigate();
    const handleLogout = async () => {
        setLogoutError("");
        try {
            await safeAdminFetch("/api/admin/auth/logout", {
                method: "POST",
            });
            navigate("/admin/login", { replace: true });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Unable to sign out.";
            // If the backend is unreachable (502/503) the session is already
            // inaccessible — navigate away anyway so the user is not stuck.
            if (msg.includes("502") || msg.includes("503") || msg.includes("Failed to fetch")) {
                navigate("/admin/login", { replace: true });
                return;
            }
            setLogoutError("Unable to sign out. Please try again.");
        }
    };
    return (<div className="admin-shell">
      {mobileSidebarOpen && (<button type="button" className="admin-sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)}/>)}

      <aside className={`admin-sidebar ${mobileSidebarOpen ? "admin-sidebar-open" : ""}`}>
        <div className="admin-brand">
          <img
  src="/images/brand/ismicon.jpeg"
  alt="ISM Data Technology"
  width={32}
  height={53}
  className="admin-brand-logo"
/>

          <div>
            <p>ISM Admin</p>
            <span>Careers Dashboard</span>
          </div>

          <button type="button" className="admin-sidebar-close" onClick={() => setMobileSidebarOpen(false)} aria-label="Close navigation">
            <X size={18}/>
          </button>
        </div>

        <nav className="admin-navigation" aria-label="Admin navigation">
          {navigation.map(({ href, label, Icon }) => {
            const active = pathname === href ||
                (href !== "/admin/careers" && pathname.startsWith(`${href}/`));
            return (<Link to={href} key={href} onClick={() => setMobileSidebarOpen(false)} className={`admin-nav-item ${active ? "admin-nav-active" : ""}`} aria-current={active ? "page" : undefined}>
                <Icon size={18}/>
                <span>{label}</span>
              </Link>);
        })}

          <div className="admin-nav-divider"/>

          <button type="button" onClick={() => void handleLogout()} className="admin-nav-item">
            <LogOut size={18}/>
            <span>Logout</span>
          </button>
        </nav>

        <div className="admin-sidebar-wave" aria-hidden="true"/>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="flex items-center gap-3">
            <button type="button" className="admin-menu-toggle" onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation">
              <Menu size={20}/>
            </button>

            <div className="admin-mobile-brand">
              <img
  src="/images/brand/ismicon.jpeg"
  alt=""
  aria-hidden="true"
  width={20}
  height={33}
  className="admin-brand-logo"
/>
              <span>ISM Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {logoutError && (<p role="alert" className="text-red-400 text-xs">
                {logoutError}
              </p>)}

            <span className="admin-avatar">A</span>
            <span className="admin-profile-name">Admin</span>

            <button onClick={() => void handleLogout()} className="admin-signout">
              <LogOut size={15}/>
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>);
}
