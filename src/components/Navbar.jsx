import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { getSupabase } from "../utils/supabase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAspirasiOpen, setIsAspirasiOpen] = useState(false);
  const [aspirasiUrl, setAspirasiUrl] = useState("");

  const handleBerandaClick = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchAspirasiUrl = async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from("settings").select("aspirasi_form_url");
        if (data && data[0]) {
          setAspirasiUrl(data[0].aspirasi_form_url || "");
        }
      } catch (err) {
        console.error("Gagal mengambil link aspirasi:", err);
      }
    };
    fetchAspirasiUrl();
  }, [isAspirasiOpen]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthLocal = localStorage.getItem("isAdminAuthenticated") === "true";
      if (isAuthLocal) {
        setIsLoggedIn(true);
        return;
      }

      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setIsLoggedIn(!!session);
        });

        return () => subscription?.unsubscribe();
      } catch (err) {
        console.error("Gagal memeriksa sesi auth di navbar:", err);
      }
    };

    checkAuth();
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-primary/5 px-6 md:px-12 py-5 flex justify-between items-center shadow-sm sticky top-0 z-50 transition-all duration-300">
      <Link 
        to="/" 
        onClick={handleBerandaClick}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
      >
        <span className="text-2xl">🏡</span>
        <div className="font-headers font-bold text-primary text-lg md:text-xl leading-tight">
          Perumahan Banguntapan <span className="text-secondary">Asri</span>
        </div>
      </Link>
      
      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-8 font-sans font-medium text-primary-dark/80 text-[15px]">
        <Link 
          to="/" 
          onClick={handleBerandaClick}
          className="relative py-1 hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300"
        >
          Beranda
        </Link>
        <Link to="/#tentang" className="relative py-1 hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300">Tentang Kami</Link>
        <Link to="/#fasilitas" className="relative py-1 hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300">Fasilitas</Link>
        <Link to="/berita" className="relative py-1 hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300">Berita</Link>
        <button 
          onClick={() => setIsAspirasiOpen(true)}
          className="relative py-1 hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300 text-left font-medium cursor-pointer"
        >
          Aspirasi Warga
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Tombol Login atau Dashboard */}
        <Link 
          to={isLoggedIn ? "/admin" : "/login"} 
          className="hidden md:inline-flex items-center justify-center bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-full font-sans font-bold text-xs tracking-wider uppercase shadow-sm transition-all duration-200"
        >
          {isLoggedIn ? "DASHBOARD ADMIN" : "LOGIN PENGURUS"}
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-primary hover:text-secondary focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-[75px] left-0 w-full bg-white border-b border-primary/5 shadow-md px-6 py-6 flex flex-col gap-4 font-sans font-medium text-primary/80 text-[15px] animate-fadeIn">
          <Link 
            to="/" 
            onClick={handleBerandaClick}
            className="hover:text-primary py-2 border-b border-slate-50 transition-colors"
          >
            Beranda
          </Link>
          <Link to="/#tentang" onClick={() => setIsOpen(false)} className="hover:text-primary py-2 border-b border-slate-50 transition-colors">Tentang Kami</Link>
          <Link to="/#fasilitas" onClick={() => setIsOpen(false)} className="hover:text-primary py-2 border-b border-slate-50 transition-colors">Fasilitas</Link>
          <Link to="/berita" onClick={() => setIsOpen(false)} className="hover:text-primary py-2 border-b border-slate-50 transition-colors">Berita</Link>
          <button 
            onClick={() => {
              setIsOpen(false);
              setIsAspirasiOpen(true);
            }}
            className="hover:text-primary py-2 border-b border-slate-50 transition-colors text-left w-full font-medium cursor-pointer"
          >
            Aspirasi Warga
          </button>
          <Link 
            to={isLoggedIn ? "/admin" : "/login"} 
            onClick={() => setIsOpen(false)}
            className="w-full text-center bg-primary hover:bg-primary-light text-white py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all"
          >
            {isLoggedIn ? "DASHBOARD ADMIN" : "LOGIN PENGURUS"}
          </Link>
        </div>
      )}

      {/* Modal Aspirasi Warga menggunakan React Portal */}
      {isAspirasiOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#faf9f6] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-primary/10 relative space-y-6 overflow-hidden animate-scaleUp">
            
            {/* Corner Decorative Waves (Clean Green Accent Curves, Grandeur Reduced) */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary to-primary-light rounded-br-[100px] opacity-100 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary to-primary-light rounded-tr-[80px] opacity-100 pointer-events-none"></div>

            {/* Close Button */}
            <button 
              onClick={() => setIsAspirasiOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 bg-white text-secondary hover:text-primary rounded-full flex items-center justify-center shadow-md border border-slate-100 transition-all hover:scale-105 cursor-pointer z-10"
            >
              ✕
            </button>

            {/* Emblem Circle (Gold Ring with Green Inner) */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-secondary/60"></div>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-1 relative z-10">
              <h3 className="text-2xl font-headers font-bold text-primary tracking-tight">
                Kotak Aspirasi Warga
              </h3>
              <p className="text-xs font-bold text-secondary tracking-widest uppercase">
                Perum Banguntapan Asri
              </p>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <span className="w-6 h-[1px] bg-secondary/35"></span>
                <span className="text-[10px] text-secondary">✦</span>
                <span className="w-6 h-[1px] bg-secondary/35"></span>
              </div>
            </div>

            {/* Inner Content Card */}
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4 relative z-10">
              <p className="text-[14px] font-semibold text-slate-700 leading-relaxed text-center">
                Silakan sampaikan aspirasi, kritik, maupun saran Anda demi kemajuan perumahan kita.
              </p>
              
              {/* Alert box */}
              <div className="bg-[#fdfbf7] border border-secondary/30 text-slate-800 p-4 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wide">
                  <span>⚠️</span>
                  <span>Pemberitahuan Penting:</span>
                </div>
                <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                  Tidak diperkenankan menulis aspirasi yang mengandung unsur provokatif dan SARA.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2 relative z-10">
              <a 
                href={aspirasiUrl || "#"}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsAspirasiOpen(false)}
                className={`w-full text-center py-4 bg-gradient-to-r from-primary to-primary-light hover:brightness-105 text-white rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md ${!aspirasiUrl ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Isi Formulir Aspirasi
              </a>
              <button 
                onClick={() => setIsAspirasiOpen(false)}
                className="w-full text-center py-3.5 bg-white hover:bg-slate-50 border border-secondary/40 hover:border-secondary text-secondary font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
              >
                Kembali
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;