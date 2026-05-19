const AdminKas = () => {
  const dataKas = [
    { id: 1, tanggal: "12 Mei 2026", ket: "Pembelian Lampu Jalan", jenis: "keluar", nominal: 150000 },
    { id: 2, tanggal: "10 Mei 2026", ket: "Iuran Warga", jenis: "masuk", nominal: 3500000 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Kas & Iuran</h2>
          <p className="text-gray-600 text-sm mt-1">Manajemen pemasukan dan pengeluaran perumahan.</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md transition">
          + Tambah Transaksi
        </button>
      </div>

      {/* Tiga Kartu Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500 font-medium">Total Pemasukan</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">Rp 3.500.000</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
          <p className="text-sm text-gray-500 font-medium">Total Pengeluaran</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">Rp 150.000</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-teal-600">
          <p className="text-sm text-gray-500 font-medium">Saldo Saat Ini</p>
          <h3 className="text-2xl font-bold text-teal-600 mt-1">Rp 3.350.000</h3>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-sm border-b">
              <th className="p-4">Tanggal</th>
              <th className="p-4">Keterangan</th>
              <th className="p-4">Jenis</th>
              <th className="p-4 text-right">Nominal</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataKas.map((trx) => (
              <tr key={trx.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-4 text-gray-600">{trx.tanggal}</td>
                <td className="p-4 font-medium text-gray-800">{trx.ket}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${trx.jenis === 'masuk' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trx.jenis.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right font-semibold text-gray-800">
                  Rp {trx.nominal.toLocaleString('id-ID')}
                </td>
                <td className="p-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-800 font-medium text-xs">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminKas;