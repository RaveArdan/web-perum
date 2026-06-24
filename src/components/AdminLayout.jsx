import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
  };

  return (
    <div className="flex h-screen bg-[#faf9f6] font-sans">
      
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-primary-dark border-r border-primary-light/5 text-slate-300 flex flex-col">
        {/* Logo Admin */}
        <div className="h-20 flex items-center gap-2 px-6 border-b border-primary-light/10">
          <span className="text-xl">🏡</span>
          <div>
            <h2 className="text-sm font-headers font-bold text-white tracking-tight">Admin Portal</h2>
            <span className="text-xs uppercase tracking-wider font-extrabold text-secondary-light block">Banguntapan Asri</span>
          </div>
        </div>
        
        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5">
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
              location.pathname === "/admin" 
                ? "bg-secondary text-white shadow-sm" 
                : "text-slate-300 hover:bg-primary-light/20 hover:text-white"
            }`}
          >
            <span>📊</span>
            <span>Kelola Kas & Link</span>
          </Link>
          <Link 
            to="/admin/berita" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
              location.pathname === "/admin/berita" 
                ? "bg-secondary text-white shadow-sm" 
                : "text-slate-300 hover:bg-primary-light/20 hover:text-white"
            }`}
          >
            <span>📰</span>
            <span>Kelola Berita</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-primary-light/10 bg-black/10">
          <Link 
            to="/" 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-300 hover:text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300"
          >
            <span>🚪</span>
            <span>Keluar (Logout)</span>
          </Link>
        </div>
      </aside>

      {/* Area Konten Utama Kanan */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Atas */}
        <header className="h-20 bg-white border-b border-primary/5 flex items-center justify-between px-8 z-10 shadow-sm">
          <h1 className="text-lg font-headers font-bold text-primary-dark">Dashboard Pengurus</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-sm font-bold text-primary-dark block">Bendahara RT</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block">Akses Administrator</span>
            </div>
            <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold shadow-sm">
              B
            </div>
          </div>
        </header>

        {/* Tempat Konten Halaman Render (Scrollable) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#faf9f6]/40 p-8 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;