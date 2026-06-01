import { Link } from "react-router-dom";

const InfoCards = () => {
  return (
    <section className="relative z-20 px-6 md:px-12 -mt-20 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Card 1: Pengumuman Terbaru */}
        <div className="bg-white p-8 rounded-2xl border border-primary/5 shadow-md hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-secondary font-headers font-bold text-sm tracking-wider uppercase">PENGUMUMAN TERBARU</span>
              <span className="text-primary text-xl"></span>
            </div>
            <ul className="space-y-4 font-sans text-[15px] text-primary-dark/85">
              <li className="border-b border-primary/5 pb-3">
                <h4 className="font-bold text-primary text-[16px]">Jadwal Fogging Lingkungan</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Dilaksanakan tanggal 25 Mei 2026</p>
              </li>
              <li>
                <h4 className="font-bold text-primary text-[16px]">Pemeliharaan Pipa Air Bersih</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Aliran air mati sementara jam 13:00 - 15:00 WIB</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 2: Kegiatan Warga */}
        <div className="bg-white p-8 rounded-2xl border border-primary/5 shadow-md hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-secondary font-headers font-bold text-sm tracking-wider uppercase">KEGIATAN WARGA</span>
              <span className="text-primary text-xl"></span>
            </div>
            <ul className="space-y-4 font-sans text-[15px] text-primary-dark/85">
              <li className="border-b border-primary/5 pb-3">
                <h4 className="font-bold text-primary text-[16px]">Kerja Bakti Sosial</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Minggu pagi pukul 07:00 WIB</p>
              </li>
              <li className="border-b border-primary/5 pb-3">
                <h4 className="font-bold text-primary text-[16px]">Persiapan Lomba HUT RI</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Rapat panitia di Balai RW malam ini</p>
              </li>
              <li>
                <h4 className="font-bold text-primary text-[16px]">Peringatan HUT BTA Ke-10</h4>
                <p className="text-sm text-slate-600 mt-1 font-medium">Puncak acara kesenian warga 10 Juni 2026</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 3: Status Keuangan */}
        <div className="bg-white p-8 rounded-2xl border border-primary/5 shadow-md hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-secondary font-headers font-bold text-sm tracking-wider uppercase">STATUS KEUANGAN</span>
              <span className="text-primary text-xl"></span>
            </div>
            <div className="mb-6 font-sans">
              <p className="text-xs text-slate-600 uppercase tracking-wider font-bold mb-1">Total Saldo Kas RT</p>
              <h2 className="text-3xl font-bold text-primary-dark tracking-tight">Rp 15.000.000</h2>
              <span className="inline-block mt-2 text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-bold">Update: Hari Ini</span>
            </div>
          </div>

          <Link
            to="/keuangan"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white px-5 py-3.5 rounded-full font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300"
          >
            <span>Lihat Laporan Lengkap</span>
            <span>📄</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default InfoCards;