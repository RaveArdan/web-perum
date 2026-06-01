import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBerandaClick = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <a href="/#tentang" className="relative py-1 hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300">Tentang Kami</a>
        <a href="/#fasilitas" className="relative py-1 hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300">Fasilitas</a>
        <Link to="/berita" className="relative py-1 hover:text-primary transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300">Berita</Link>
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
          <a href="/#tentang" onClick={() => setIsOpen(false)} className="hover:text-primary py-2 border-b border-slate-50 transition-colors">Tentang Kami</a>
          <a href="/#fasilitas" onClick={() => setIsOpen(false)} className="hover:text-primary py-2 border-b border-slate-50 transition-colors">Fasilitas</a>
          <Link to="/berita" onClick={() => setIsOpen(false)} className="hover:text-primary py-2 border-b border-slate-50 transition-colors">Berita</Link>
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="w-full text-center bg-primary hover:bg-primary-light text-white py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all"
          >
            LOGIN PENGURUS
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;