// 1. Tambahkan import Link di baris paling atas
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#113025] text-gray-300 py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 border-b border-gray-600 pb-10">
        
        {/* Kolom 1 (Tetap) */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-white">
            <span className="text-2xl">🏘️</span>
            <h3 className="text-xl font-bold">Banguntapan Asri</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Portal informasi dan transparansi kas khusus untuk warga Paguyuban Perum Banguntapan Asri, Bantul, DIY.
          </p>
        </div>

        {/* Kolom 2: Tautan Cepat (UBAH MENJADI LINK) */}
        <div>
          <h4 className="text-white font-bold mb-4">Tautan Cepat</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-teal-400 transition">Beranda</Link></li>
            <li><a href="/#tentang" className="hover:text-teal-400 transition">Tentang Paguyuban</a></li>
            <li><Link to="/berita" className="hover:text-teal-400 transition">Berita & Pengumuman</Link></li>
            {/* Diubah menjadi <Link to="/keuangan"> */}
            <li><Link to="/keuangan" className="hover:text-teal-400 transition">Laporan Keuangan RT</Link></li>
          </ul>
        </div>

        {/* Kolom 3 (Tetap) */}
        <div>
          <h4 className="text-white font-bold mb-4">Kontak Darurat</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">👤 Ketua RT: 0898-7654-3210</li>
            <li className="flex items-center gap-2">⚡ PLN: 123</li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
        <p>© 2026 Paguyuban Warga Perum Banguntapan Asri. Dibuat dengan React & Tailwind.</p>
      </div>
    </footer>
  );
};

export default Footer;