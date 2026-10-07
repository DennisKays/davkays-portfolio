import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setChecking(false);
        return;
      }

      const { data: admin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      setAuthorized(Boolean(admin));
      setChecking(false);
    }

    checkAdmin();
  }, []);

  if (checking) {
    return <div className="admin-loading">Loading control panel...</div>;
  }

  if (!authorized) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
