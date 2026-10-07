import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      setError("This account is not authorized as an administrator.");
      setLoading(false);
      return;
    }

    navigate("/admin/dashboard");
  }

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-glow" />

      <div className="admin-auth-card">
        <div className="admin-auth-icon">
          <LockKeyhole size={24} />
        </div>

        <span className="section-label">DavKays Softwares</span>
        <h1>Admin Login</h1>
        <p>Secure access to your business control panel.</p>

        <form onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </label>

          {error && <div className="admin-error">{error}</div>}

          <button
            type="submit"
            className="button button-primary admin-login-button"
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <a href="/" className="admin-back-link">
          ← Back to portfolio
        </a>
      </div>
    </main>
  );
}

export default AdminLogin;

console.log('SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL); console.log('SUPABASE KEY LOADED:', Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY));
