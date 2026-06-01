import laporanKeuanganExcel from "../assets/Laporan Keuangan BTA.xlsx";

const Keuangan = () => {
  const riwayatTransaksi = [
    { id: 1, tanggal: "12 Mei 2026", ket: "Pembelian Lampu Jalan Blok C", jenis: "keluar", nominal: 150000 },
    { id: 2, tanggal: "10 Mei 2026", ket: "Iuran Warga Bulan Mei (Akumulasi)", jenis: "masuk", nominal: 3500000 },
    { id: 3, tanggal: "05 Mei 2026", ket: "Biaya Konsumsi Kerja Bakti", jenis: "keluar", nominal: 300000 },
  ];

  return (
    <div className="bg-[#faf9f6] min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto font-sans">
        {/* Page Header */}
        <div className="relative mb-12 pb-8 border-b border-primary/5">
          <span className="text-secondary font-headers font-bold tracking-widest text-sm uppercase block mb-3">TRANSPARANSI KAS</span>
          <h1 className="text-3xl md:text-5xl font-headers font-bold text-primary-dark tracking-tight">Laporan Keuangan</h1>
          <p className="text-primary-light/90 mt-2 text-sm md:text-base">Laporan arus kas masuk dan keluar secara terbuka untuk seluruh warga Perum Banguntapan Asri.</p>
        </div>

        {/* Dashboard Balance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Main Balance Card */}
          <div className="lg:col-span-2 bg-primary text-white p-8 rounded-3xl shadow-sm flex flex-col justify-between min-h-[160px] border border-primary-light/10">
            <div>
              <p className="text-sm text-secondary-light uppercase tracking-widest font-bold mb-1">Total Saldo Kas RT</p>
              <h2 className="text-3xl md:text-4xl font-headers font-bold text-white tracking-tight">Rp 15.000.000</h2>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-200/90 mt-6 pt-4 border-t border-white/5 font-medium">
              <span>Status Rekening: Aktif</span>
              <span>Terakhir Update: Hari Ini</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-4">
              <span className="text-secondary text-lg">📈</span>
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">Total Pemasukan</p>
                <h4 className="font-bold text-primary-dark text-base mt-0.5">Rp 3.500.000</h4>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-4">
              <span className="text-rose-500 text-lg">📉</span>
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">Total Pengeluaran</p>
                <h4 className="font-bold text-primary-dark text-base mt-0.5">Rp 450.000</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
          <div className="p-6 border-b border-primary/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-headers font-bold text-primary-dark text-base tracking-wide uppercase">Riwayat Transaksi</h3>
              <span className="text-xs text-secondary font-bold uppercase tracking-wider bg-warm px-3 py-1 rounded-full border border-primary/5">Kas RT</span>
            </div>
            <a 
              href={laporanKeuanganExcel}
              download="Laporan Keuangan BTA.xlsx"
              className="inline-flex items-center gap-2 bg-[#1d6f42] hover:bg-[#155230] text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md w-fit"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-3.5 h-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Unduh Excel Laporan
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf9f6] text-primary-dark/80 text-sm font-bold uppercase tracking-wider">
                  <th className="p-5">Tanggal</th>
                  <th className="p-5">Keterangan</th>
                  <th className="p-5 text-right">Pemasukan</th>
                  <th className="p-5 text-right">Pengeluaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {riwayatTransaksi.map((trx) => (
                  <tr key={trx.id} className="hover:bg-[#faf9f6]/40 transition-colors text-sm text-slate-700 font-medium">
                    <td className="p-5 whitespace-nowrap">{trx.tanggal}</td>
                    <td className="p-5 font-bold text-primary-dark">{trx.ket}</td>
                    <td className="p-5 text-right font-bold text-primary whitespace-nowrap">
                      {trx.jenis === "masuk" ? `+ Rp ${trx.nominal.toLocaleString('id-ID')}` : "-"}
                    </td>
                    <td className="p-5 text-right font-bold text-rose-600 whitespace-nowrap">
                      {trx.jenis === "keluar" ? `- Rp ${trx.nominal.toLocaleString('id-ID')}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Keuangan;