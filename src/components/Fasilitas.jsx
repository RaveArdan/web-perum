const Fasilitas = () => {
  const dataFasilitas = [
    { icon: "📷", nama: "Keamanan & CCTV 24 Jam" },
    { icon: "🕌", nama: "Masjid Al-Ikhlas" },
    { icon: "🛝", nama: "Taman Bermain Anak" },
    { icon: "♻️", nama: "Pengelolaan Sampah" }
  ];

  return (
    <section id="fasilitas" className="py-20 px-6 md:px-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h4 className="text-teal-600 font-bold tracking-wider text-sm mb-2">KENYAMANAN WARGA</h4>
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Fasilitas Perumahan</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {dataFasilitas.map((fasi, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col items-center">
              <div className="text-5xl mb-4">{fasi.icon}</div>
              <h3 className="font-semibold text-gray-800 text-center">{fasi.nama}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fasilitas;