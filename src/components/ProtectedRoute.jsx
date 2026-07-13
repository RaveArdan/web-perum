import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSupabase, isLocalFallback } from "../utils/supabase";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (isLocalFallback) {
      const isAuth = localStorage.getItem("isAdminAuthenticated") === "true";
      setAuthenticated(isAuth);
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    
    // Ambil session saat ini secara asinkron
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    // Dengarkan perubahan status auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    // Tampilkan layar loading saat memverifikasi sesi
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-wide text-slate-300">Memeriksa hak akses...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    // Jika belum login, tendang ke halaman /login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, izinkan masuk ke halaman admin
  return children;
};

export default ProtectedRoute;