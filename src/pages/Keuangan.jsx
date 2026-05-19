// src/pages/Keuangan.jsx
const Keuangan = () => {
  const riwayatTransaksi = [
    { id: 1, tanggal: "12 Mei 2026", ket: "Pembelian Lampu Jalan Blok C", jenis: "keluar", nominal: 150000 },
    { id: 2, tanggal: "10 Mei 2026", ket: "Iuran Warga Bulan Mei (Akumulasi)", jenis: "masuk", nominal: 3500000 },
    { id: 3, tanggal: "05 Mei 2026", ket: "Biaya Konsumsi Kerja Bakti", jenis: "keluar", nominal: 300000 },
  ];

  return (
    <div className="py-12 px-6 md:px-12 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Transparansi Kas RT</h1>
      <p className="text-gray-600 mb-8">Laporan pemasukan dan pengeluaran kas Paguyuban Banguntapan Asri.</p>

      {/* Kartu Saldo */}
      <div className="bg-[#113025] text-white p-8 rounded-xl shadow-lg mb-10 text-center">
        <p className="text-gray-300 font-medium mb-2">Total Saldo Saat Ini</p>
        <h2 className="text-4xl md:text-5xl font-bold text-green-400">Rp 15.000.000</h2>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="p-4 border-b">Tanggal</th>
                <th className="p-4 border-b">Keterangan</th>
                <th className="p-4 border-b text-right">Pemasukan</th>
                <th className="p-4 border-b text-right">Pengeluaran</th>
              </tr>
            </thead>
            <tbody>
              {riwayatTransaksi.map((trx) => (
                <tr key={trx.id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="p-4 text-gray-600">{trx.tanggal}</td>
                  <td className="p-4 font-medium text-gray-800">{trx.ket}</td>
                  <td className="p-4 text-right font-semibold text-green-600">
                    {trx.jenis === "masuk" ? `+ Rp ${trx.nominal.toLocaleString('id-ID')}` : "-"}
                  </td>
                  <td className="p-4 text-right font-semibold text-red-500">
                    {trx.jenis === "keluar" ? `- Rp ${trx.nominal.toLocaleString('id-ID')}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Keuangan;