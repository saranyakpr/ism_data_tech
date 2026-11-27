/**
 * AdminGuard
 *
 * Wraps protected admin pages. On mount it hits the backend to verify the
 * session cookie. If the backend responds with 401 (or the request fails)
 * the user is redirected to /admin/login. While the check is in progress a
 * neutral loading screen is shown so the protected content is never flashed.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "denied"

  useEffect(() => {
    let cancelled = false;

    // We use the overview endpoint as a lightweight session probe — it is
    // already protected by requireAdmin middleware and returns 401 when the
    // cookie is absent or expired.
    fetch("/api/admin/overview", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    })
      .then((res) => {
        if (cancelled) return;
        if (res.status === 401 || res.status === 403) {
          setStatus("denied");
          navigate("/admin/login", { replace: true });
        } else {
          setStatus("ok");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("denied");
          navigate("/admin/login", { replace: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (status === "checking") {
    return (
      <div
        className="admin-shell"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}
      >
        <p style={{ color: "#9db1d1", fontSize: 14 }}>Verifying session…</p>
      </div>
    );
  }

  if (status === "denied") {
    // navigate() already fired; render nothing while React Router processes it.
    return null;
  }

  return children;
}
