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
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-light hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 text-white px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Simpan Tautan</span>
                  </>
                )}
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
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
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
                      className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-secondary to-secondary-light hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 text-white py-3.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all duration-200 text-center shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Lihat File
                    </a>
                    <button
                      type="button"
                      onClick={handleDeletePdf}
                      disabled={uploading}
                      className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 text-white py-3.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Hapus File
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50/50 border-2 border-dashed border-slate-200/80 rounded-2xl text-center flex flex-col items-center justify-center min-h-[140px] text-slate-400 font-sans">
                  <svg className="w-8 h-8 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-xs font-bold text-slate-600">Belum ada file PDF terunggah</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 max-w-[180px] leading-relaxed">Website beranda akan menggunakan dokumen bawaan (lokal).</p>
                </div>
              )}

              {/* Custom Premium File Upload Button */}
              <div className="pt-2">
                <label className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-light hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 text-white py-3.5 px-6 rounded-full font-bold text-xs tracking-wider uppercase shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer text-center select-none ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Sedang Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>{hasPdf ? "Ganti File PDF" : "Unggah File PDF Baru"}</span>
                    </>
                  )}
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
