const Fasilitas = () => {
  const dataFasilitas = [
    { icon: "📹", nama: "Keamanan & CCTV 24 Jam", desc: "Pemantauan aktif untuk keamanan & ketertiban lingkungan warga" },
    { icon: "🕌", nama: "Masjid Al-Hidayah", desc: "Sarana ibadah bersama dan pusat kegiatan keagamaan warga" },
    { icon: "🛝", nama: "Taman Bermain Anak", desc: "Area rekreasi hijau yang asri dan aman untuk bermain anak" },
    { icon: "♻️", nama: "Pengelolaan Sampah", desc: "Sistem pengangkutan sampah terpadu dan terjadwal secara berkala" }
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
              className="bg-white p-8 rounded-2xl shadow-sm border border-primary/5 hover:border-secondary/20 hover:translate-y-[-4px] transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-warm text-3xl mb-6 flex items-center justify-center border border-primary/5">
                {fasi.icon}
              </div>
              <h3 className="font-headers font-bold text-primary-dark text-lg mb-2">{fasi.nama}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{fasi.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fasilitas;