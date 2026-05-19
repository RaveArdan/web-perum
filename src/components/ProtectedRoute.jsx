import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Cek apakah di browser tersimpan status login admin
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";

  if (!isAuthenticated) {
    // Jika belum login, tendang ke halaman /login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, izinkan masuk ke halaman admin
  return children;
};

export default ProtectedRoute;