import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                setError(response.status === 401
                    ? "Invalid email or password. Please try again."
                    : "Unable to sign in right now. Please try again.");
                return;
            }
            setPassword("");
            navigate("/admin/careers", { replace: true });
        }
        catch {
            setError("Unable to sign in. Please check your connection and try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<main className="admin-login-page min-h-screen flex items-center justify-center px-4 py-10">
      <section className="admin-login-card" aria-labelledby="admin-login-heading">
        <div className="text-center mb-8">
          <img
  src="/images/brand/ismicon.jpeg"
  alt="ISM Data Technology"
  width={58}
  height={96}
  className="admin-login-logo mx-auto mb-4"
/>
          <h1 id="admin-login-heading" className="text-xl font-bold mb-1">
            Admin Access
          </h1>
          <p>ISM Data Technology - Careers Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-medium mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true"/>
              <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" autoComplete="username" required maxLength={254} className="admin-field w-full rounded-xl py-3 pl-11 pr-4 text-sm"/>
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required maxLength={72} className="admin-field w-full rounded-xl py-3 pl-4 pr-12 text-sm"/>
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
                {showPassword ? (<EyeOff size={18} aria-hidden="true"/>) : (<Eye size={18} aria-hidden="true"/>)}
              </button>
            </div>
          </div>

          {error && (<p role="alert" className="text-red-600 text-sm">
              {error}
            </p>)}

          <button type="submit" disabled={isSubmitting} className="admin-new-job w-full disabled:opacity-60">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-xs text-center mt-5">
          For security issues, contact{" "}
          <a href="mailto:official@ismdatatech.com">official@ismdatatech.com</a>
        </p>
      </section>
    </main>);
}
