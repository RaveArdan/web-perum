import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80')] bg-cover bg-center px-6 md:px-12 py-20 overflow-hidden">
      {/* Eco-Luxury dark green/black overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#113025]/60 to-[#0e241c]/90"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        {/* Subtle decorative gold line & badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="w-8 h-[1px] bg-secondary"></span>
          <span className="text-secondary font-headers font-bold tracking-widest text-xs uppercase">
            PAGUYUBAN WARGA
          </span>
          <span className="w-8 h-[1px] bg-secondary"></span>
        </div>

        <h1 className="text-4xl md:text-6xl font-headers font-bold mb-6 text-white leading-tight tracking-tight">
          Hunian Nyaman Bernuansa Asri <br />
          di Yogyakarta
        </h1>
        
        <p className="text-base md:text-lg mb-10 text-white/80 max-w-2xl mx-auto leading-relaxed font-sans">
          Selamat datang di portal warga Perumahan Banguntapan Asri. Lingkungan hijau yang asri berpadu dengan kebersamaan warga untuk menciptakan kenyamanan hunian terbaik.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link 
            to="/berita" 
            className="px-8 py-3 rounded-full font-sans font-semibold text-xs tracking-widest uppercase bg-secondary hover:bg-secondary-light text-white transition-all duration-300"
          >
            Lihat Kegiatan Warga
          </Link>
          <Link 
            to="/cek-iuran" 
            className="px-8 py-3 rounded-full font-sans font-semibold text-xs tracking-widest uppercase border-2 border-white hover:bg-white hover:text-primary-dark text-white transition-all duration-300"
          >
            Cek Status Iuran
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero; 