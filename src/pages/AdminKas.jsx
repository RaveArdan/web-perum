const AdminKas = () => {
  const dataKas = [
    { id: 1, tanggal: "12 Mei 2026", ket: "Pembelian Lampu Jalan", jenis: "keluar", nominal: 150000 },
    { id: 2, tanggal: "10 Mei 2026", ket: "Iuran Warga (Akumulasi)", jenis: "masuk", nominal: 3500000 },
  ];

  return (
    <div className="space-y-10 font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-headers font-bold text-primary-dark tracking-tight">Kelola Kas & Iuran</h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">Manajemen pencatatan pemasukan dan pengeluaran warga secara tertib.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 text-white px-6 py-3.5 rounded-full font-sans font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5 border-l-4 border-l-primary flex flex-col justify-between min-h-[110px]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pemasukan</p>
          <h3 className="text-3xl font-headers font-bold text-primary-dark mt-2">Rp 3.500.000</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5 border-l-4 border-l-rose-500 flex flex-col justify-between min-h-[110px]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pengeluaran</p>
          <h3 className="text-3xl font-headers font-bold text-primary-dark mt-2">Rp 150.000</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5 border-l-4 border-l-secondary flex flex-col justify-between min-h-[110px]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Saldo Kas Saat Ini</p>
          <h3 className="text-3xl font-headers font-bold text-primary mt-2">Rp 3.350.000</h3>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
        <div className="p-6 border-b border-primary/5">
          <h3 className="font-headers font-bold text-primary-dark text-sm tracking-wider uppercase">Daftar Log Transaksi</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf9f6] text-primary-dark/80 text-sm font-bold uppercase tracking-wider">
                <th className="p-5">Tanggal</th>
                <th className="p-5">Keterangan</th>
                <th className="p-5">Jenis</th>
                <th className="p-5 text-right">Nominal</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5 text-sm text-slate-700 font-medium">
              {dataKas.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="p-5 whitespace-nowrap">{trx.tanggal}</td>
                  <td className="p-5 font-bold text-primary-dark">{trx.ket}</td>
                  <td className="p-5 whitespace-nowrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      trx.jenis === 'masuk' 
                        ? 'bg-primary/5 text-primary' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {trx.jenis}
                    </span>
                  </td>
                  <td className="p-5 text-right font-bold text-primary-dark whitespace-nowrap">
                    Rp {trx.nominal.toLocaleString('id-ID')}
                  </td>
                  <td className="p-5 whitespace-nowrap text-center">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary-dark rounded-full font-bold text-[10px] uppercase tracking-wider mr-2.5 transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Hapus
                    </button>
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

export default AdminKas;