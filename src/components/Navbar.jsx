import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white px-6 md:px-12 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="text-green-800 text-3xl">🏘️</div>
        <div className="font-bold text-gray-800 leading-tight">
          Paguyuban Warga <br />
          <span className="text-gray-900">Perum Banguntapan Asri</span>
        </div>
      </div>
      
      <div className="hidden lg:flex gap-8 font-medium text-gray-600 text-sm">
        <Link to="/" className="hover:text-teal-600 transition">Beranda</Link>
        <a href="/#tentang" className="hover:text-teal-600 transition">Tentang Kami</a>
        <a href="/#fasilitas" className="hover:text-teal-600 transition">Fasilitas</a>
        <Link to="/berita" className="hover:text-teal-600 transition">Berita</Link>
        <Link to="/kontak" className="hover:text-teal-600 transition">Kontak</Link>
      </div>

      {/* Tombol Login diubah menjadi Link yang mengarah ke route /login */}
      <Link 
        to="/login" 
        className="hidden md:block border border-gray-800 px-5 py-2 rounded font-semibold text-xs tracking-wide hover:bg-gray-800 hover:text-white transition"
      >
        LOGIN PENGURUS
      </Link>
    </nav>
  );
};

export default Navbar;