import { useState, useEffect } from "react";
import { getSupabase, isLocalFallback } from "../utils/supabase";
import { CustomAlert, CustomConfirm } from "../components/CustomDialog";

const AdminSettings = () => {
  const [keuanganUrl, setKeuanganUrl] = useState("");
  const [iuranUrl, setIuranUrl] = useState("");
  const [strukturPdfUrl, setStrukturPdfUrl] = useState("");
  const [aspirasiUrl, setAspirasiUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Custom alert & confirm states
  const [alertConfig, setAlertConfig] = useState({ show: false, message: "", type: "success" });
  const [confirmConfig, setConfirmConfig] = useState({ show: false, message: "", onConfirm: null });

  const showAlert = (message, type = "success") => {
    setAlertConfig({ show: true, message, type });
  };

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
          setAspirasiUrl(data[0].aspirasi_form_url || "");
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
          struktur_pengurus_pdf_url: strukturPdfUrl,
          aspirasi_form_url: aspirasiUrl
        })
        .eq("id", 1);

      if (error) throw error;
      showAlert("Pengaturan tautan berhasil disimpan!", "success");
    } catch (err) {
      console.error("Gagal menyimpan tautan:", err);
      showAlert("Gagal menyimpan data ke database.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Unggah file PDF struktur pengurus
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showAlert("Harap unggah file berformat PDF!", "error");
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
        reader.onloadend = async () => {
          const newUrl = reader.result;
          setStrukturPdfUrl(newUrl);
          try {
            const { error: dbError } = await supabase
              .from("settings")
              .update({ struktur_pengurus_pdf_url: newUrl })
              .eq("id", 1);
            if (dbError) throw dbError;
            showAlert("File PDF berhasil diunggah secara lokal!", "success");
          } catch (dbErr) {
            console.error("Gagal menyimpan PDF ke DB lokal:", dbErr);
            showAlert("Gagal menyimpan PDF ke database lokal.", "error");
          } finally {
            setUploading(false);
          }
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
        const newUrl = data.publicUrl;
        setStrukturPdfUrl(newUrl);

        // Simpan langsung ke database
        const { error: dbError } = await supabase
          .from("settings")
          .update({ struktur_pengurus_pdf_url: newUrl })
          .eq("id", 1);
        if (dbError) throw dbError;

        setUploading(false);
        showAlert("File PDF berhasil diunggah ke storage cloud!", "success");
      }
    } catch (err) {
      console.error("Gagal mengunggah PDF:", err);
      showAlert("Gagal mengunggah file PDF.", "error");
      setUploading(false);
    }
  };

  // Hapus file PDF struktur pengurus
  const handleDeletePdf = () => {
    setConfirmConfig({
      show: true,
      message: "Apakah Anda yakin ingin menghapus file PDF struktur organisasi ini? Tautan tombol di beranda akan secara otomatis dikembalikan untuk membuka file dokumen bawaan perumahan.",
      onConfirm: executeDeletePdf
    });
  };

  const executeDeletePdf = async () => {
    setUploading(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("settings")
        .update({ struktur_pengurus_pdf_url: "" }) // Kosongkan agar beranda menggunakan file default
        .eq("id", 1);

      if (error) throw error;
      setStrukturPdfUrl("");
      showAlert("File PDF berhasil dihapus!", "success");
    } catch (err) {
      console.error("Gagal menghapus PDF:", err);
      showAlert("Gagal menghapus file PDF dari database.", "error");
    } finally {
      setUploading(false);
    }
  };

  const hasPdf = strukturPdfUrl && strukturPdfUrl !== "none";

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
            Integrasi Spreadsheet & Layanan Warga
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
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Tautan untuk melihat status rekap pembayaran iuran warga bulanan.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Link Google Form Kotak Aspirasi Warga
              </label>
              <input 
                type="url" 
                value={aspirasiUrl}
                onChange={(e) => setAspirasiUrl(e.target.value)}
                className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-400 transition-all text-sm"
                placeholder="Contoh: https://docs.google.com/forms/d/e/..."
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Tautan untuk pengisian formulir aspirasi, kritik, atau saran warga.</span>
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
        <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-sm flex flex-col justify-between h-full">
          <div className="space-y-6">
            <h3 className="font-headers font-bold text-primary-dark text-base border-b border-primary/5 pb-4 uppercase tracking-wide">
              Struktur Organisasi (PDF)
            </h3>

            <div className="space-y-5">
              {hasPdf ? (
                <div className="space-y-4">
                  {/* Premium PDF Info Card */}
                  <div className="flex items-center gap-3.5 p-4 bg-emerald-50/40 border border-emerald-100/70 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0">
                      📄
                    </div>
                    <div className="text-left flex-1 min-w-0 font-sans">
                      <p className="text-xs font-bold text-slate-700 truncate">struktur_pengurus.pdf</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">Dokumen Terpasang Aktif</p>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={strukturPdfUrl}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center bg-secondary hover:bg-secondary-dark text-white py-3 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all duration-200 text-center shadow-sm"
                    >
                      Lihat File
                    </a>
                    <button
                      type="button"
                      onClick={handleDeletePdf}
                      disabled={uploading}
                      className="inline-flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      Hapus File
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50/50 border-2 border-dashed border-slate-200/80 rounded-2xl text-center flex flex-col items-center justify-center min-h-[140px] text-slate-400 font-sans">
                  <span className="text-3xl mb-3">📤</span>
                  <p className="text-xs font-bold text-slate-600">Belum ada file PDF terunggah</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 max-w-[180px] leading-relaxed">Website beranda akan menggunakan dokumen bawaan (lokal).</p>
                </div>
              )}

              {/* Custom Premium File Upload Button */}
              <div className="pt-2">
                <label className={`w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white py-3.5 px-6 rounded-full font-bold text-xs tracking-wider uppercase shadow-sm transition-all duration-300 cursor-pointer text-center select-none ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                  <span>{uploading ? "Sedang Mengunggah..." : (hasPdf ? "Ganti File PDF" : "Unggah File PDF Baru")}</span>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-primary/5 mt-8 text-slate-400 text-[11px] leading-relaxed font-sans">
            Mengunggah file PDF baru akan memperbarui tombol <strong>"Susunan Pengurus"</strong> di beranda secara instan.
          </div>
        </div>

      </div>

      {/* Reusable premium alert and confirm modal popups */}
      <CustomAlert 
        show={alertConfig.show} 
        message={alertConfig.message} 
        type={alertConfig.type} 
        onClose={() => setAlertConfig({ ...alertConfig, show: false })} 
      />
      
      <CustomConfirm 
        show={confirmConfig.show} 
        message={confirmConfig.message} 
        onConfirm={confirmConfig.onConfirm} 
        onCancel={() => setConfirmConfig({ ...confirmConfig, show: false })} 
      />
    </div>
  );
};

export default AdminSettings;
