const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. NAVBAR */}
      <nav className="bg-white px-6 md:px-12 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Ikon Logo (Placeholder) */}
          <div className="text-green-800 text-3xl">
            🏘️
          </div>
          <div className="font-bold text-gray-800 leading-tight">
            Paguyuban Warga <br />
            <span className="text-gray-900">Perum Banguntapan Asri</span>
          </div>
        </div>
        
        {/* Menu Desktop */}
        <div className="hidden lg:flex gap-8 font-medium text-gray-600 text-sm">
          <a href="#" className="text-teal-600 font-semibold">Beranda</a>
          <a href="#" className="hover:text-teal-600 transition">Tentang Kami</a>
          <a href="#" className="hover:text-teal-600 transition">Fasilitas</a>
          <a href="#" className="hover:text-teal-600 transition">Berita</a>
          <a href="#" className="hover:text-teal-600 transition">Kontak</a>
        </div>

        {/* Tombol Login */}
        <button className="hidden md:block border border-gray-800 px-5 py-2 rounded font-semibold text-xs tracking-wide hover:bg-gray-800 hover:text-white transition">
          LOGIN AREA WARGA
        </button>
      </nav>

      {/* 2. HERO SECTION */}
      {/* Background menggunakan gambar perumahan. URL bisa diganti nanti */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80')] bg-cover bg-center pt-24 pb-36 px-6 md:px-12">
        {/* Overlay gradient hijau gelap */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/60"></div>
        
        <div className="relative z-10 max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Membangun Kerukunan <br /> di Perum Banguntapan Asri
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl">
            Informasi Terkini, Transparansi Iuran, dan Layanan <br className="hidden md:block" /> Warga Banguntapan Asri.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-gray-900 px-6 py-2.5 rounded font-bold text-sm hover:bg-gray-100 transition shadow-lg">
              Daftar Kegiatan
            </button>
            <button className="border border-white text-white px-6 py-2.5 rounded font-bold text-sm hover:bg-white hover:text-gray-900 transition">
              Cek Status Iuran
            </button>
          </div>
        </div>
      </section>

      {/* 3. CARD SECTION (Overlapping Hero) */}
      <section className="relative z-20 px-6 md:px-12 -mt-16 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Pengumuman */}
          <div className="bg-white p-6 rounded-lg shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-800 text-sm tracking-wide">'PENGUMUMAN TERBARU</h3>
              <span className="text-teal-600">🔔</span>
            </div>
            <ul className="space-y-4">
              <li className="font-semibold text-gray-800">Jadwal Fogging: 25 Mei</li>
              <li className="font-semibold text-gray-800">Matikan Air Jam 1-3</li>
            </ul>
          </div>

          {/* Card 2: Kegiatan Warga */}
          <div className="bg-white p-6 rounded-lg shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-800 text-sm tracking-wide">'KEGIATAN WARGA</h3>
              <span className="text-teal-600">📅</span>
            </div>
            <ul className="space-y-4">
              <li className="font-semibold text-gray-800">Kerja Bakti Minggu Pagi</li>
              <li className="font-semibold text-gray-800">Lomba 17-an</li>
              <li className="font-semibold text-gray-800">HUT BTA 10 Mei</li>
            </ul>
          </div>

          {/* Card 3: Status Keuangan */}
          <div className="bg-white p-6 rounded-lg shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-800 text-sm tracking-wide">'STATUS KEUANGAN</h3>
              <span className="text-teal-600">💵</span>
            </div>
            <div className="mb-5">
              <p className="text-sm text-gray-500 mb-1">Total Saldo Kas RT</p>
              <h2 className="text-2xl font-bold text-gray-900">Rp 15.000.000</h2>
            </div>
            <button className="bg-[#1f4b3f] text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-green-800 transition">
              Lihat Laporan 📄
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default App;