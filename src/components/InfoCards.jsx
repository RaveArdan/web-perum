// 1. Tambahkan import Link di baris paling atas
import { Link } from "react-router-dom";

const InfoCards = () => {
  return (
    <section className="relative z-20 px-6 md:px-12 -mt-16 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Pengumuman (Tetap) */}
        <div className="bg-white p-6 rounded-lg shadow-xl shadow-gray-200/50 border-t-4 border-teal-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-800 text-sm tracking-wide">PENGUMUMAN TERBARU</h3>
            <span className="text-teal-600">🔔</span>
          </div>
          <ul className="space-y-4">
            <li className="font-medium text-gray-700 text-sm border-b pb-2">Jadwal Fogging: 25 Mei</li>
            <li className="font-medium text-gray-700 text-sm">Matikan Air Jam 1-3</li>
          </ul>
        </div>

        {/* Card 2: Kegiatan Warga (Tetap) */}
        <div className="bg-white p-6 rounded-lg shadow-xl shadow-gray-200/50 border-t-4 border-blue-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-800 text-sm tracking-wide">KEGIATAN WARGA</h3>
            <span className="text-blue-600">📅</span>
          </div>
          <ul className="space-y-4">
            <li className="font-medium text-gray-700 text-sm border-b pb-2">Kerja Bakti Minggu Pagi</li>
            <li className="font-medium text-gray-700 text-sm border-b pb-2">Lomba 17-an</li>
            <li className="font-medium text-gray-700 text-sm">HUT BTA 10 Mei</li>
          </ul>
        </div>

        {/* Card 3: Status Keuangan (UBAH BUTTON MENJADI LINK) */}
        <div className="bg-white p-6 rounded-lg shadow-xl shadow-gray-200/50 border-t-4 border-green-600">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-800 text-sm tracking-wide">STATUS KEUANGAN</h3>
            <span className="text-green-600">💵</span>
          </div>
          <div className="mb-5">
            <p className="text-sm text-gray-500 mb-1">Total Saldo Kas RT</p>
            <h2 className="text-2xl font-bold text-gray-900">Rp 15.000.000</h2>
          </div>
          
          {/* Diubah dari <button> menjadi <Link to="/keuangan"> */}
          <Link 
            to="/keuangan" 
            className="bg-[#1f4b3f] w-full justify-center text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-green-800 transition text-center"
          >
            Lihat Laporan Lengkap 📄
          </Link>
        </div>

      </div>
    </section>
  );
};

export default InfoCards;