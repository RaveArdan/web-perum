// src/pages/Berita.jsx
const Berita = () => {
  const daftarBerita = [
    { id: 1, kategori: "Pengumuman", tanggal: "15 Mei 2026", judul: "Jadwal Fogging Rutin Bulan Mei", img: "https://images.unsplash.com/photo-1584483756208-4103a89e6eb5?auto=format&fit=crop&q=80" },
    { id: 2, kategori: "Kegiatan", tanggal: "10 Mei 2026", judul: "Semarak Perayaan HUT BTA ke-10", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80" },
    { id: 3, kategori: "Kerja Bakti", tanggal: "01 Mei 2026", judul: "Kerja Bakti Membersihkan Gorong-Gorong Blok A", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" },
  ];

  return (
    <div className="py-12 px-6 md:px-12 max-w-6xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kabar Banguntapan Asri</h1>
        <p className="text-gray-600">Informasi terbaru, pengumuman, dan kegiatan warga.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {daftarBerita.map((berita) => (
          <div key={berita.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <img src={berita.img} alt={berita.judul} className="w-full h-48 object-cover" />
            <div className="p-5">
              <div className="flex justify-between items-center mb-3 text-xs font-semibold text-gray-500">
                <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded">{berita.kategori}</span>
                <span>{berita.tanggal}</span>
              </div>
              <h2 className="font-bold text-gray-800 text-lg mb-3 leading-tight">{berita.judul}</h2>
              <button className="text-teal-600 font-semibold text-sm hover:text-teal-800">Baca Selengkapnya →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Berita;