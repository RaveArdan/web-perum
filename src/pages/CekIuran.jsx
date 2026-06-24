import { useState, useEffect } from "react";
import { getSupabase } from "../utils/supabase";

const CekIuran = () => {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("https://docs.google.com/spreadsheets/d/1_YOUR_SPREADSHEET_ID_HERE/edit?usp=sharing");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from("settings").select("*");
        if (data && data[0] && data[0].iuran_sheet_url) {
          setSpreadsheetUrl(data[0].iuran_sheet_url);
        }
      } catch (err) {
        console.error("Gagal memuat setting iuran warga:", err);
      }
    };
    loadSettings();
  }, []);

  return (
    <div className="bg-[#faf9f6] min-h-screen py-20 px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="max-w-2xl w-full font-sans">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-secondary font-headers font-bold tracking-widest text-sm uppercase block mb-3">LAYANAN WARGA</span>
          <h1 className="text-3xl md:text-5xl font-headers font-bold text-primary-dark tracking-tight mb-4">Cek Status Iuran</h1>
          <p className="text-primary-light/90 text-[15px] leading-relaxed">
            Data pembayaran iuran bulanan warga Perumahan Banguntapan Asri dikelola secara terbuka dan real-time.
          </p>
        </div>

        {/* Google Sheets Access Card */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-primary/5 flex flex-col items-center text-center">
          {/* Green Sheets Icon */}
          <div className="w-16 h-16 bg-[#107c41]/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-8 h-8 text-[#107c41]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </div>

          <h2 className="text-xl md:text-2xl font-headers font-bold text-primary-dark mb-4">
            Akses Lembar Kerja (Spreadsheet)
          </h2>
          <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mb-8 max-w-md">
            Untuk transparansi penuh, seluruh catatan iuran warga dapat dilihat secara langsung melalui link Google Sheets resmi Bendahara RT di bawah ini.
          </p>

          <a
            href={spreadsheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#107c41] hover:bg-[#0b592e] text-white rounded-full font-headers font-bold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-[-2px]"
          >
            {/* Google Sheets SVG Icon */}
            <svg 
              className="w-5 h-5 fill-current" 
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15H7v-2.25h5V18zm0-3.75H7v-2.25h5V14.25zm0-3.75H7V8.25h5V10.5zm6 7.5h-5v-2.25h5V18zm0-3.75h-5v-2.25h5V14.25zm0-3.75h-5V8.25h5V10.5z"/>
            </svg>
            Buka Google Sheets Iuran
          </a>
        </div>

        {/* Guidelines / Help Card */}
        <div className="mt-8 bg-white p-6 md:p-8 rounded-3xl border border-primary/5 shadow-sm">
          <h3 className="font-headers font-bold text-primary-dark text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <span>💡</span> Petunjuk Penggunaan
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 font-medium">
            <li className="flex items-start gap-2.5">
              <span className="text-secondary-light">1.</span>
              <span>Klik tombol hijau di atas untuk membuka dokumen lembar kerja iuran warga di tab baru.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-secondary-light">2.</span>
              <span>Gunakan fitur pencarian bawaan browser (tekan <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border text-xs font-bold font-sans">Ctrl + F</kbd> atau <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border text-xs font-bold font-sans">Cmd + F</kbd>) lalu ketik nomor blok rumah Anda untuk pencarian cepat.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-secondary-light">3.</span>
              <span>Jika status pembayaran tidak sesuai atau ada yang perlu dikonfirmasi, silakan hubungi Bendahara RT.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default CekIuran;