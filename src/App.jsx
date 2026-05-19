// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

// Komponen Publik
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Berita from "./pages/Berita";
import Keuangan from "./pages/Keuangan";
import CekIuran from "./pages/CekIuran";

// Komponen Admin & Auth
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AdminKas from "./pages/AdminKas";

// --- Wrapper untuk Layout Publik ---
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        
        {/* RUTE PUBLIK */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="berita" element={<Berita />} />
          <Route path="keuangan" element={<Keuangan />} />
          <Route path="cek-iuran" element={<CekIuran />} />
        </Route>

        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />

        {/* RUTE ADMIN (DILINDUNGI) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminKas />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;