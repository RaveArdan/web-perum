import { Link, Outlet, useLocation } from "react-router-dom";
import { getSupabase, isLocalFallback } from "../utils/supabase";

const AdminLayout = () => {
  const location = useLocation();

  const handleLogout = async () => {
    localStorage.removeItem("isAdminAuthenticated");
    if (!isLocalFallback) {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="flex h-screen bg-[#faf9f6] font-sans">
      
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-primary-dark border-r border-primary-light/5 text-slate-300 flex flex-col">
        {/* Logo Admin */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-primary-light/10">
          <div className="w-9 h-9 bg-secondary/15 rounded-xl flex items-center justify-center border border-secondary/20">
            <svg className="w-5 h-5 text-secondary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-headers font-bold text-white tracking-tight leading-none mb-1">Admin Portal</h2>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-secondary-light block">Banguntapan Asri</span>
          </div>
        </div>
        
        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
              location.pathname === "/admin" 
                ? "bg-secondary/15 border border-secondary/30 text-secondary-light shadow-sm" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Kelola Kas & Link</span>
          </Link>
          <Link 
            to="/admin/berita" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
              location.pathname === "/admin/berita" 
                ? "bg-secondary/15 border border-secondary/30 text-secondary-light shadow-sm" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span>Kelola Berita</span>
          </Link>
        </nav>

        {/* Bottom Actions: Lihat Website & Logout */}
        <div className="p-4 border-t border-primary-light/10 bg-black/15 space-y-2.5">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full text-xs font-bold tracking-widest uppercase border border-white/5 transition-all duration-300"
          >
            <svg className="w-4 h-4 text-secondary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span>Lihat Website</span>
          </Link>
          <Link 
            to="/" 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-300 hover:text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
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
              <span className="text-sm font-bold text-primary-dark block leading-none mb-1">Bendahara RT</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Akses Administrator</span>
            </div>
            {/* Elegant User Avatar with Active Dot */}
            <div className="relative">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center font-bold shadow-sm">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent border-2 border-white rounded-full"></span>
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