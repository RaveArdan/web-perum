// src/components/Hero.jsx
import { Link } from "react-router-dom"; // <-- INI YANG KURANG TADI

const Hero = () => {
  return (
    <section className="relative bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80')] bg-cover bg-center pt-24 pb-36 px-6 md:px-12">
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/60"></div>
      
      <div className="relative z-10 max-w-3xl text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Membangun Kerukunan <br /> di Perum Banguntapan Asri
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl">
          Informasi Terkini, Transparansi Iuran, dan Layanan <br className="hidden md:block" /> Warga Banguntapan Asri.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/berita" className="bg-white text-gray-900 px-6 py-2.5 rounded font-bold text-sm hover:bg-gray-100 transition shadow-lg text-center">
            Daftar Kegiatan
          </Link>
          <Link to="/cek-iuran" className="border border-white text-white px-6 py-2.5 rounded font-bold text-sm hover:bg-white hover:text-gray-900 transition text-center">
            Cek Status Iuran
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero; 