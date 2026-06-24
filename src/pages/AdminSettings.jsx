import { useState, useEffect } from "react";
import { getSupabase, isLocalFallback } from "../utils/supabase";

const AdminSettings = () => {
  const [keuanganUrl, setKeuanganUrl] = useState("");
  const [iuranUrl, setIuranUrl] = useState("");
  const [strukturPdfUrl, setStrukturPdfUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Muat data pengaturan aktif
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from("settings").select("*");
        if (data && data[0]) {
          setKeuanganUrl(data[0].keuangan_sheet_url || "");
          setIuranUrl(data[0].iuran_sheet_url || "");
          setStrukturPdfUrl(data[0].struktur_pengurus_pdf_url || "");
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan admin:", err);
      }
    };
    loadSettings();
  }, []);

  // Simpan data link spreadsheet
  const handleSaveLinks = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("settings")
        .update({
          keuangan_sheet_url: keuanganUrl,
          iuran_sheet_url: iuranUrl,
          struktur_pengurus_pdf_url: strukturPdfUrl
        })
        .eq("id", 1);

      if (error) throw error;
      alert("Pengaturan tautan berhasil disimpan!");
    } catch (err) {
      console.error("Gagal menyimpan tautan:", err);
      alert("Gagal menyimpan data ke database.");
    } finally {
      setSaving(false);
    }
  };

  // Unggah file PDF struktur pengurus
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Harap unggah file berformat PDF!");
      return;
    }

    setUploading(true);
    try {
      const supabase = getSupabase();
      const fileExt = file.name.split(".").pop();
      const fileName = `struktur_pengurus_${Date.now()}.${fileExt}`;

      if (isLocalFallback) {
        // Fallback: konversi file ke base64 DataURL dan simpan di localStorage
        const reader = new FileReader();
        reader.onloadend = () => {
          setStrukturPdfUrl(reader.result);
          setUploading(false);
          alert("File PDF berhasil diunggah secara lokal!");
        };
        reader.readAsDataURL(file);
      } else {
        // Live: unggah ke Supabase Storage bucket 'settings'
        const { error: uploadError } = await supabase.storage
          .from("settings")
          .upload(fileName, file, { cacheControl: "3600", upsert: true });

        if (uploadError) throw uploadError;

        // Ambil URL publik dari file yang diunggah
        const { data } = supabase.storage.from("settings").getPublicUrl(fileName);
        setStrukturPdfUrl(data.publicUrl);
        setUploading(false);
        alert("File PDF berhasil diunggah ke storage cloud!");
      }
    } catch (err) {
      console.error("Gagal mengunggah PDF:", err);
      alert("Gagal mengunggah file PDF.");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10 font-sans">
      {/* Header Panel */}
      <div>
        <h2 className="text-2xl font-headers font-bold text-primary-dark tracking-tight">Kelola Kas & Link Website</h2>
        <p className="text-slate-600 text-sm mt-1 font-medium">Atur link Google Sheets dan file PDF yang terpasang di website perumahan.</p>
      </div>

      {/* Info status database */}
      {isLocalFallback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-semibold leading-relaxed flex items-center gap-2.5">
          <span>⚠️</span>
          <span>
            <strong>Mode Fallback Lokal Aktif:</strong> Data disimpan di dalam memori browser (localStorage) Anda. Hubungkan Supabase di file `.env` untuk sinkronisasi cloud global.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Form Link Google Sheets */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-primary/5 shadow-sm space-y-6">
          <h3 className="font-headers font-bold text-primary-dark text-base border-b border-primary/5 pb-4 uppercase tracking-wide">
            Integrasi Spreadsheet
          </h3>

          <form onSubmit={handleSaveLinks} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Link Google Sheets Keuangan Warga
              </label>
              <input 
                type="url" 
                value={keuanganUrl}
                onChange={(e) => setKeuanganUrl(e.target.value)}
                className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-400 transition-all text-sm"
                placeholder="Contoh: https://docs.google.com/spreadsheets/d/..."
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Tautan sheet kas masuk & keluar yang dibagikan secara publik.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Link Google Sheets Cek Iuran Bulanan
              </label>
              <input 
                type="url" 
                value={iuranUrl}
                onChange={(e) => setIuranUrl(e.target.value)}
                className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-400 transition-all text-sm"
                placeholder="Contoh: https://docs.google.com/spreadsheets/d/..."
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Tautan untuk melihat status rekap pembayaran iuran warga bulanan.</span>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Tautan"}
              </button>
            </div>
          </form>
        </div>

        {/* Kolom Kanan: Pengelolaan PDF */}
        <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headers font-bold text-primary-dark text-base border-b border-primary/5 pb-4 uppercase tracking-wide mb-6">
              Struktur Organisasi (PDF)
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-warm border border-primary/5 rounded-2xl text-center flex flex-col items-center justify-center min-h-[140px]">
                <span className="text-3xl mb-3">📄</span>
                {strukturPdfUrl ? (
                  <div>
                    <p className="text-xs font-bold text-primary">PDF Struktur Terunggah</p>
                    <a 
                      href={strukturPdfUrl}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-secondary hover:text-secondary-dark font-bold underline block mt-1"
                    >
                      Lihat File PDF Aktif
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">Belum ada file PDF baru yang diunggah.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Unggah File PDF Baru
                </label>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  disabled={uploading}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-primary/5 mt-6 text-slate-400 text-[11px] leading-relaxed">
            Mengunggah file PDF baru akan otomatis memperbarui tautan tombol <strong>"Susunan Pengurus"</strong> di beranda.
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
