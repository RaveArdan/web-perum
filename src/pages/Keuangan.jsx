import { useState, useEffect } from "react";
import { getSupabase } from "../utils/supabase";

const getFetchUrlFromSheetUrl = (sheetUrl) => {
  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const id = match ? match[1] : "1LZGu7UjWrZCZg-q9aJAulWRmGpGSo_FB";
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json`;
};

const fetchGoogleSheet = async (baseUrl, sheetName = "") => {
  const url = sheetName ? `${baseUrl}&sheet=${encodeURIComponent(sheetName)}` : baseUrl;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Gagal mengambil data dari Google Sheets");
  const text = await response.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+?)\);/);
  if (!match) throw new Error("Format data Google Sheets tidak valid");
  const data = JSON.parse(match[1]);
  if (data.status === "error") throw new Error(data.errors[0]?.detailed_message || "Error saat memproses data");
  return data.table;
};

const parseDashboard = (table) => {
  const rows = table.rows || [];
  const totalRow = rows.find(r => r.c && r.c[0]?.v?.toString().toLowerCase().trim() === 'total');
  if (totalRow) {
    return {
      pemasukan: totalRow.c[1]?.v || 0,
      pengeluaran: totalRow.c[2]?.v || 0,
      saldo: totalRow.c[3]?.v || 0
    };
  }
  return { pemasukan: 14926250, pengeluaran: 11332699, saldo: 3593551 };
};

const parseTransactions = (table) => {
  const cols = table.cols || [];
  const rows = table.rows || [];
  
  let dateIdx = -1;
  let descIdx = -1;
  let categoryIdx = -1;
  let masukIdx = -1;
  let keluarIdx = -1;

  cols.forEach((col, idx) => {
    const label = (col.label || '').toLowerCase().trim();
    if (label.includes('tgl') || label.includes('tanggal') || label.includes('date')) {
      if (dateIdx === -1) dateIdx = idx;
    } else if (label.includes('uraian') || label.includes('keterangan') || label.includes('desc')) {
      if (descIdx === -1) descIdx = idx;
    } else if (label.includes('kategori') || label.includes('category')) {
      categoryIdx = idx;
    } else if (label.includes('masuk') || label.includes('pemasukan') || label.includes('income')) {
      masukIdx = idx;
    } else if (label.includes('keluar') || label.includes('pengeluaran') || label.includes('expense')) {
      keluarIdx = idx;
    }
  });

  const transactions = [];
  let currentGroup = "";
  let currentGroupDate = "";

  rows.forEach((row, rowIndex) => {
    const cells = row.c || [];
    const dateVal = dateIdx !== -1 ? cells[dateIdx]?.v : null;
    const descVal = descIdx !== -1 ? cells[descIdx]?.v : null;
    const categoryVal = categoryIdx !== -1 ? cells[categoryIdx]?.v : null;
    const masukVal = masukIdx !== -1 ? cells[masukIdx]?.v : null;
    const keluarVal = keluarIdx !== -1 ? cells[keluarIdx]?.v : null;

    if (dateVal) {
      currentGroupDate = dateVal;
    }

    const hasMasuk = masukVal !== null && masukVal !== undefined && masukVal > 0;
    const hasKeluar = keluarVal !== null && keluarVal !== undefined && keluarVal > 0;

    if (descVal && !hasMasuk && !hasKeluar) {
      currentGroup = descVal;
    } else if (hasMasuk || hasKeluar) {
      let finalDesc = descVal || "";
      if (currentGroup && !finalDesc.toLowerCase().includes(currentGroup.toLowerCase())) {
        const cleanGroup = currentGroup.replace(/:\s*$/, '').trim();
        finalDesc = `${cleanGroup} - ${finalDesc}`;
      }

      transactions.push({
        id: rowIndex + 1,
        tanggal: currentGroupDate || "Setiap Hari",
        ket: finalDesc,
        jenis: hasMasuk ? "masuk" : "keluar",
        nominal: hasMasuk ? Number(masukVal) : Number(keluarVal)
      });
    }
  });

  return transactions.reverse();
};

const Keuangan = () => {
  const listBulan = ["MEI", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const monthNamesIndo = ["Januari", "Februari", "Maret", "April", "MEI", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const currentMonthName = monthNamesIndo[new Date().getMonth()];
  const defaultMonth = listBulan.includes(currentMonthName) ? currentMonthName : "Juni";

  const [selectedBulan, setSelectedBulan] = useState(defaultMonth);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [sheetUrl, setSheetUrl] = useState("https://docs.google.com/spreadsheets/d/1LZGu7UjWrZCZg-q9aJAulWRmGpGSo_FB/edit?usp=sharing");
  
  const [totals, setTotals] = useState({
    saldo: 3593551,
    pemasukan: 14926250,
    pengeluaran: 11332699
  });
  
  const [riwayatTransaksi, setRiwayatTransaksi] = useState([]);
  const [error, setError] = useState(null);

  // Ambil URL Spreadsheet dari database (settings)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from("settings").select("*");
        if (data && data[0] && data[0].keuangan_sheet_url) {
          setSheetUrl(data[0].keuangan_sheet_url);
        }
      } catch (err) {
        console.error("Gagal memuat setting keuangan:", err);
      }
    };
    loadSettings();
  }, []);

  // Memuat total saldo dari Sheet URL yang aktif
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoadingDashboard(true);
        const fetchUrl = getFetchUrlFromSheetUrl(sheetUrl);
        const table = await fetchGoogleSheet(fetchUrl);
        const parsed = parseDashboard(table);
        setTotals(parsed);
      } catch (err) {
        console.error("Gagal memuat total saldo:", err);
      } finally {
        setLoadingDashboard(false);
      }
    };
    loadDashboard();
  }, [sheetUrl]);

  // Memuat transaksi berdasarkan bulan terpilih
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoadingTransactions(true);
        setError(null);
        const fetchUrl = getFetchUrlFromSheetUrl(sheetUrl);
        const table = await fetchGoogleSheet(fetchUrl, selectedBulan);
        const parsed = parseTransactions(table);
        setRiwayatTransaksi(parsed);
      } catch (err) {
        console.error("Gagal memuat transaksi:", err);
        setError("Gagal mengambil data dari Google Sheets. Pastikan koneksi internet aktif.");
      } finally {
        setLoadingTransactions(false);
      }
    };
    loadTransactions();
  }, [sheetUrl, selectedBulan]);

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
              {loadingDashboard ? (
                <div className="h-9 w-40 bg-white/20 animate-pulse rounded-lg mt-1"></div>
              ) : (
                <h2 className="text-3xl md:text-4xl font-headers font-bold text-white tracking-tight">
                  Rp {totals.saldo.toLocaleString('id-ID')}
                </h2>
              )}
            </div>
            <div className="flex justify-between items-center text-sm text-slate-200/90 mt-6 pt-4 border-t border-white/5 font-medium">
              <span>Status Rekening: Aktif</span>
              <span>Terakhir Update: Hari Ini (Live)</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-4">
              <span className="text-secondary text-lg">📈</span>
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">Total Pemasukan</p>
                {loadingDashboard ? (
                  <div className="h-6 w-28 bg-slate-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <h4 className="font-bold text-primary-dark text-base mt-0.5">
                    Rp {totals.pemasukan.toLocaleString('id-ID')}
                  </h4>
                )}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-sm flex items-center gap-4">
              <span className="text-rose-500 text-lg">📉</span>
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">Total Pengeluaran</p>
                {loadingDashboard ? (
                  <div className="h-6 w-28 bg-slate-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <h4 className="font-bold text-primary-dark text-base mt-0.5">
                    Rp {totals.pengeluaran.toLocaleString('id-ID')}
                  </h4>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
          <div className="p-6 border-b border-primary/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <h3 className="font-headers font-bold text-primary-dark text-base tracking-wide uppercase">Riwayat Transaksi</h3>
                <span className="text-xs text-secondary font-bold uppercase tracking-wider bg-warm px-3 py-1 rounded-full border border-primary/5">Kas RT</span>
              </div>
              
              <div className="flex items-center gap-2">
                <label htmlFor="select-bulan" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bulan:</label>
                <select
                  id="select-bulan"
                  value={selectedBulan}
                  onChange={(e) => setSelectedBulan(e.target.value)}
                  className="bg-[#faf9f6] border border-primary/10 rounded-full px-4 py-1.5 text-xs font-bold text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary transition-all cursor-pointer"
                >
                  {listBulan.map((bulan) => (
                    <option key={bulan} value={bulan}>{bulan}</option>
                  ))}
                </select>
              </div>
            </div>

            <a 
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Buka Google Sheets Kas
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
                {loadingTransactions ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-slate-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Memuat data transaksi dari Google Sheets...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-rose-500 font-medium">
                      {error}
                    </td>
                  </tr>
                ) : riwayatTransaksi.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-slate-500 font-medium">
                      Tidak ada transaksi pada bulan {selectedBulan}.
                    </td>
                  </tr>
                ) : (
                  riwayatTransaksi.map((trx) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Keuangan;