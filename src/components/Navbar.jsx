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
        {/* Tombol Login */}
        <Link 
          to="/login" 
          className="hidden md:inline-flex items-center justify-center bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-full font-sans font-bold text-xs tracking-wider uppercase shadow-sm transition-all duration-200"
        >
          LOGIN PENGURUS
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
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="w-full text-center bg-primary hover:bg-primary-light text-white py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all"
          >
            LOGIN PENGURUS
          </Link>
        </div>
      )}

      {/* Modal Aspirasi Warga menggunakan React Portal */}
      {isAspirasiOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-primary/5 relative space-y-6">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsAspirasiOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg p-2 transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-3xl">
              ✉️
            </div>

            {/* Header */}
            <div className="text-center">
              <h3 className="text-xl font-headers font-bold text-primary-dark tracking-tight">
                Kotak Aspirasi Warga
              </h3>
              <p className="text-xs text-secondary font-bold uppercase tracking-wider mt-1">
                Perum Banguntapan Asri
              </p>
            </div>

            {/* Rules / Description */}
            <div className="p-4 bg-warm border border-primary/5 rounded-2xl text-center space-y-3">
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                Silakan sampaikan aspirasi, kritik, maupun saran Anda demi kemajuan perumahan kita.
              </p>
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold p-3.5 rounded-xl leading-relaxed text-left">
                ⚠️ <strong>Pemberitahuan Penting:</strong>
                <p className="mt-1 text-rose-600/90 font-medium">
                  Tidak diperkenankan menulis aspirasi yang mengandung unsur provokatif dan SARA.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <a 
                href={aspirasiUrl || "#"}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsAspirasiOpen(false)}
                className={`w-full text-center py-4 bg-primary hover:bg-primary-light text-white rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-md ${!aspirasiUrl ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {aspirasiUrl ? "Isi Formulir Aspirasi" : "Tautan Belum Tersedia"}
              </a>
              <button 
                onClick={() => setIsAspirasiOpen(false)}
                className="w-full text-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
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