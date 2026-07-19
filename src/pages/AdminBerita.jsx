import { useState, useEffect } from "react";
import { getSupabase, isLocalFallback } from "../utils/supabase";
import { CustomAlert, CustomConfirm } from "../components/CustomDialog";

const AdminBerita = () => {
  const [daftarBerita, setDaftarBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [kategori, setKategori] = useState("Kegiatan");
  const [tanggal, setTanggal] = useState("");
  const [judul, setJudul] = useState("");
  const [desc, setDesc] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfSource, setPdfSource] = useState("file"); // "file" atau "link"
  const [showForm, setShowForm] = useState(false);

  // Custom alert & confirm states
  const [alertConfig, setAlertConfig] = useState({ show: false, message: "", type: "success" });
  const [confirmConfig, setConfirmConfig] = useState({ show: false, message: "", onConfirm: null });

  const showAlert = (message, type = "success") => {
    setAlertConfig({ show: true, message, type });
  };

  // Muat daftar berita
  const loadBerita = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("berita")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw error;
      setDaftarBerita(data || []);
    } catch (err) {
      console.error("Gagal memuat berita:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBerita();
  }, []);

  // Tangani pemilihan gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showAlert("Harap pilih file gambar!", "error");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Simpan tambah / ubah berita
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = getSupabase();
      let imageUrl = imagePreview;
      let pdfUrl = pdfLink;

      const oldItem = editingId ? daftarBerita.find(item => item.id === editingId) : null;
      const oldImgUrl = oldItem ? oldItem.img : null;
      const oldPdfUrl = oldItem ? oldItem.pdfLink : null;

      // Jika ada file gambar baru yang dipilih
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `berita_${Date.now()}.${fileExt}`;

        if (isLocalFallback) {
          // Gunakan base64 untuk fallback lokal
          imageUrl = imagePreview;
        } else {
          // Unggah ke Supabase Storage bucket 'berita'
          const { error: uploadError } = await supabase.storage
            .from("berita")
            .upload(fileName, imageFile, { cacheControl: "3600", upsert: true });

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from("berita").getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }
      }

      // Jika ada file PDF baru yang dipilih (dan mode file aktif)
      if (pdfSource === "file") {
        if (pdfFile) {
          const fileExt = pdfFile.name.split(".").pop();
          const fileName = `berita_pdf_${Date.now()}.${fileExt}`;

          if (isLocalFallback) {
            // Fallback lokal (gunakan base64)
            const reader = new FileReader();
            const readPdf = () => new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(pdfFile);
            });
            pdfUrl = await readPdf();
          } else {
            // Unggah ke Supabase Storage bucket 'berita'
            const { error: uploadError } = await supabase.storage
              .from("berita")
              .upload(fileName, pdfFile, { cacheControl: "3600", upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("berita").getPublicUrl(fileName);
            pdfUrl = data.publicUrl;
          }
        } else if (pdfLink === "") {
          pdfUrl = null;
        }
      } else {
        pdfUrl = pdfLink || null;
      }

      const newsData = {
        kategori,
        tanggal,
        judul,
        desc,
        img: imageUrl || "",
        pdfLink: pdfUrl
      };

      if (editingId) {
        // Update berita
        const { error } = await supabase
          .from("berita")
          .update(newsData)
          .eq("id", editingId);
        if (error) throw error;

        // Hapus gambar lama dari storage jika berhasil diupdate dengan gambar baru
        if (imageFile && oldImgUrl && !isLocalFallback) {
          const bucketPath = `storage/v1/object/public/berita/`;
          if (oldImgUrl.includes(bucketPath)) {
            const oldFileName = oldImgUrl.split(bucketPath)[1];
            if (oldFileName) {
              await supabase.storage.from("berita").remove([oldFileName]);
            }
          }
        }

        // Hapus PDF lama dari storage jika berhasil diupdate dengan PDF baru atau dikosongkan
        const isPdfUpdatedOrCleared = (pdfSource === "file" && pdfFile) || (pdfSource === "file" && !pdfFile && pdfLink === "") || (pdfSource === "link" && pdfLink !== oldPdfUrl);
        if (isPdfUpdatedOrCleared && oldPdfUrl && !isLocalFallback) {
          const bucketPath = `storage/v1/object/public/berita/`;
          if (oldPdfUrl.includes(bucketPath)) {
            const oldPdfName = oldPdfUrl.split(bucketPath)[1];
            if (oldPdfName) {
              await supabase.storage.from("berita").remove([oldPdfName]);
            }
          }
        }

        showAlert("Berita berhasil diperbarui!", "success");
      } else {
        // Insert berita baru
        const { error } = await supabase
          .from("berita")
          .insert([newsData]);
        if (error) throw error;
        showAlert("Berita baru berhasil ditambahkan!", "success");
      }

      resetForm();
      loadBerita();
    } catch (err) {
      console.error("Gagal menyimpan berita:", err);
      showAlert("Gagal menyimpan berita.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Hapus berita
  const handleDelete = (id) => {
    setConfirmConfig({
      show: true,
      message: "Apakah Anda yakin ingin menghapus berita/pengumuman ini secara permanen?",
      onConfirm: () => executeDelete(id)
    });
  };

  const executeDelete = async (id) => {
    try {
      const supabase = getSupabase();
      
      // Cari data berita terlebih dahulu untuk mendapatkan URL gambar dan PDF-nya
      const { data: itemData } = await supabase
        .from("berita")
        .select("img, pdfLink")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("berita").delete().eq("id", id);
      if (error) throw error;

      // Hapus file gambar dari Storage jika ada dan bukan fallback lokal
      if (itemData && itemData.img && !isLocalFallback) {
        const bucketPath = `storage/v1/object/public/berita/`;
        if (itemData.img.includes(bucketPath)) {
          const fileName = itemData.img.split(bucketPath)[1];
          if (fileName) {
            await supabase.storage.from("berita").remove([fileName]);
          }
        }
      }

      // Hapus file PDF dari Storage jika ada dan bukan fallback lokal
      if (itemData && itemData.pdfLink && !isLocalFallback) {
        const bucketPath = `storage/v1/object/public/berita/`;
        if (itemData.pdfLink.includes(bucketPath)) {
          const pdfFileName = itemData.pdfLink.split(bucketPath)[1];
          if (pdfFileName) {
            await supabase.storage.from("berita").remove([pdfFileName]);
          }
        }
      }

      showAlert("Berita berhasil dihapus!", "success");
      loadBerita();
    } catch (err) {
      console.error("Gagal menghapus berita:", err);
      showAlert("Gagal menghapus berita.", "error");
    }
  };

  // Mulai mode ubah (edit)
  const startEdit = (item) => {
    setEditingId(item.id);
    setKategori(item.kategori);
    setTanggal(item.tanggal);
    setJudul(item.judul);
    setDesc(item.desc);
    setPdfLink(item.pdfLink || "");

    // Tentukan sumber PDF berdasarkan linknya
    if (item.pdfLink && item.pdfLink.includes("storage/v1/object/public/")) {
      setPdfSource("file");
    } else if (item.pdfLink) {
      setPdfSource("link");
    } else {
      setPdfSource("file");
    }

    setImagePreview(item.img || "");
    setImageFile(null);
    setPdfFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setKategori("Kegiatan");
    setTanggal("");
    setJudul("");
    setDesc("");
    setPdfLink("");
    setImageFile(null);
    setImagePreview("");
    setPdfFile(null);
    setPdfSource("file");
    setShowForm(false);
  };

  return (
    <div className="space-y-10 font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-headers font-bold text-primary-dark tracking-tight">Kelola Berita & Pengumuman</h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">Buat, ubah, atau hapus kabar serta pengumuman warga di beranda.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 text-white px-6 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Berita Baru</span>
          </button>
        )}
      </div>

      {isLocalFallback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-semibold leading-relaxed">
          <strong>Mode Fallback Lokal Aktif:</strong> Berita baru yang Anda posting disimpan di memori browser ini (localStorage).
        </div>
      )}

      {/* Form Input / Edit Berita */}
      {showForm && (
        <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-primary/5 pb-4">
            <h3 className="font-headers font-bold text-primary-dark text-base uppercase tracking-wide">
              {editingId ? "Ubah Berita" : "Buat Berita Baru"}
            </h3>
            <button 
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sisi Kiri Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark cursor-pointer text-sm"
                >
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Pengumuman">Pengumuman</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal / Periode</label>
                <input 
                  type="text" 
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-400 transition-all text-sm"
                  placeholder="Contoh: 17 Agustus atau Setiap Hari Minggu"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Judul Kabar/Berita</label>
                <input 
                  type="text" 
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-400 transition-all text-sm"
                  placeholder="Ketik judul berita utama di sini"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Dokumen PDF Lampiran (Opsional)
                </label>
                
                {/* Tab Selector */}
                <div className="flex gap-2 mb-3 bg-slate-100 p-1 rounded-full w-fit">
                  <button
                    type="button"
                    onClick={() => setPdfSource("file")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      pdfSource === "file" 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfSource("link")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      pdfSource === "link" 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Tautan / Link
                  </button>
                </div>

                {pdfSource === "file" ? (
                  <div className="space-y-2">
                    {/* Jika ada file PDF yang sedang terpilih atau sudah ada link storage */}
                    {(pdfFile || (pdfLink && pdfLink.includes("storage/v1/object/public/"))) ? (
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50/40 border border-emerald-100/70 rounded-2xl">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-bold text-slate-700 truncate">
                            {pdfFile ? pdfFile.name : pdfLink.split("/").pop()}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPdfFile(null);
                            setPdfLink(""); // Kosongkan URL agar dihapus dari db/storage saat simpan
                          }}
                          className="text-rose-500 hover:text-rose-600 text-xs font-bold uppercase shrink-0 transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.type !== "application/pdf") {
                                showAlert("Harap pilih file dokumen PDF!", "error");
                                return;
                              }
                              setPdfFile(file);
                            }
                          }}
                          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <input 
                    type="text" 
                    value={pdfLink.includes("storage/v1/object/public/") ? "" : pdfLink}
                    onChange={(e) => setPdfLink(e.target.value)}
                    className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-400 transition-all text-sm"
                    placeholder="Masukkan link PDF luar (misal: Google Drive)"
                  />
                )}
              </div>
            </div>

            {/* Sisi Kanan Form */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Isi Deskripsi / Detail Berita</label>
                <textarea 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows="5"
                  className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-400 transition-all text-sm resize-none"
                  placeholder="Ketik deskripsi lengkap mengenai kegiatan atau pengumuman ini..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Gambar / Banner</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:cursor-pointer"
                  />
                </div>
                
                {imagePreview && (
                  <div className="relative w-full h-24 bg-warm border border-primary/5 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center group">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-1.5 right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md cursor-pointer transition-colors"
                      title="Hapus Gambar"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-primary/5 mt-4">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1.5 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Batal</span>
                </button>
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>{editingId ? "Simpan Perubahan" : "Terbitkan Berita"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Tabel Rincian Berita Aktif */}
      <div className="bg-white rounded-3xl shadow-sm border border-primary/5 overflow-hidden">
        <div className="p-6 border-b border-primary/5">
          <h3 className="font-headers font-bold text-primary-dark text-sm tracking-wider uppercase">Daftar Berita Aktif</h3>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            Memuat berita...
          </div>
        ) : daftarBerita.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            Belum ada berita yang diposting.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf9f6] text-primary-dark/80 text-sm font-bold uppercase tracking-wider">
                  <th className="p-5">Gambar</th>
                  <th className="p-5">Tanggal</th>
                  <th className="p-5">Judul</th>
                  <th className="p-5">Kategori</th>
                  <th className="p-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-sm text-slate-700 font-medium">
                {daftarBerita.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                     <td className="p-5 whitespace-nowrap">
                      {item.img ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-primary/5">
                          <img 
                            src={item.img} 
                            alt="Post Thumbnail" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400" title="Tidak ada gambar">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="p-5 whitespace-nowrap text-slate-500">{item.tanggal}</td>
                    <td className="p-5 font-bold text-primary-dark max-w-xs truncate">{item.judul}</td>
                    <td className="p-5 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-primary/5 text-primary">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="p-5 whitespace-nowrap text-center">
                      <button 
                        onClick={() => startEdit(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary-dark rounded-full font-bold text-[10px] uppercase tracking-wider mr-2.5 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Ubah
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all"
                      >
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
        )}
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

export default AdminBerita;
