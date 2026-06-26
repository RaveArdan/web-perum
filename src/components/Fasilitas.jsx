import cctvImg from "../assets/cctv bta.png";
import masjidImg from "../assets/masjid alhidayah.png";

const Fasilitas = () => {
  const dataFasilitas = [
    { 
      foto: cctvImg, 
      badge: "📹 Keamanan",
      nama: "Keamanan & CCTV 24 Jam", 
      desc: "Pemantauan aktif 24 jam dengan kamera CCTV di berbagai titik strategis untuk menjaga keamanan warga." 
    },
    { 
      foto: masjidImg, 
      badge: "🕌 Ibadah",
      nama: "Masjid Al-Hidayah", 
      desc: "Sarana ibadah bersama yang nyaman, bersih, serta menjadi pusat kegiatan keagamaan warga." 
    },
    { 
      foto: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80", 
      badge: "🛝 Rekreasi",
      nama: "Taman Bermain Anak", 
      desc: "Area bermain yang hijau, aman, ramah anak, serta dilengkapi tempat bersantai bagi orang tua." 
    },
    { 
      foto: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80", 
      badge: "♻️ Kebersihan",
      nama: "Pengelolaan Sampah", 
      desc: "Sistem pengangkutan sampah terpadu yang higienis, teratur, dan terjadwal secara berkala." 
    }
  ];

  return (
    <section id="fasilitas" className="py-24 px-6 md:px-12 bg-[#faf9f6] border-t border-primary/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center font-sans">
        <span className="text-secondary font-headers font-bold tracking-widest text-sm uppercase block mb-4">KENYAMANAN WARGA</span>
        <h2 className="text-3xl md:text-4xl font-headers font-bold text-primary-dark mb-16 tracking-tight">Fasilitas Perumahan</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dataFasilitas.map((fasi, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5 hover:border-secondary/20 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Image Frame with Zoom Hover Effect and explicit rounding to fix webkit clipping bug */}
              <div className="h-52 w-full overflow-hidden relative rounded-t-3xl" style={{ transform: "translate3d(0, 0, 0)" }}>
                <img 
                  src={fasi.foto} 
                  alt={fasi.nama} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-3xl"
                />
                {/* Floating category badge */}
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-primary/5 text-primary-dark text-[11px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
                  {fasi.badge}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow text-left">
                <h3 className="font-headers font-bold text-primary-dark text-lg mb-2 leading-snug">{fasi.nama}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{fasi.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fasilitas;