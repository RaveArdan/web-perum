import { useState, useEffect } from "react";
import { getSupabase, isLocalFallback } from "../utils/supabase";

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
  const [showForm, setShowForm] = useState(false);

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
      alert("Harap pilih file gambar!");
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

      const newsData = {
        kategori,
        tanggal,
        judul,
        desc,
        img: imageUrl,
        pdfLink: pdfLink || null
      };

      if (editingId) {
        // Update berita
        const { error } = await supabase
          .from("berita")
          .update(newsData)
          .eq("id", editingId);
        if (error) throw error;
        alert("Berita berhasil diperbarui!");
      } else {
        // Insert berita baru
        const { error } = await supabase
          .from("berita")
          .insert([newsData]);
        if (error) throw error;
        alert("Berita baru berhasil ditambahkan!");
      }

      resetForm();
      loadBerita();
    } catch (err) {
      console.error("Gagal menyimpan berita:", err);
      alert("Gagal menyimpan berita.");
    } finally {
      setSaving(false);
    }
  };

  // Hapus berita
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;

    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("berita").delete().eq("id", id);
      if (error) throw error;
      alert("Berita berhasil dihapus!");
      loadBerita();
    } catch (err) {
      console.error("Gagal menghapus berita:", err);
      alert("Gagal menghapus berita.");
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
    setImagePreview(item.img || "");
    setImageFile(null);
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
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm"
          >
            + Tambah Berita Baru
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
                  <option value="Ronda">Ronda</option>
                  <option value="Kerja Bakti">Kerja Bakti</option>
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link Dokumen PDF (Opsional)</label>
                <input 
                  type="text" 
                  value={pdfLink}
                  onChange={(e) => setPdfLink(e.target.value)}
                  className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-400 transition-all text-sm"
                  placeholder="Masukkan link PDF pendukung (misal jadwal pdf)"
                />
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
                  <div className="relative w-full h-24 bg-warm border border-primary/5 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-primary/5 mt-4">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : (editingId ? "Simpan Perubahan" : "Terbitkan Berita")}
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
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-primary/5">
                        <img 
                          src={item.img || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80"} 
                          alt="Post Thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>
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
                        className="text-secondary hover:text-secondary-dark font-bold text-xs uppercase tracking-wider mr-4 transition-colors"
                      >
                        Ubah
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-rose-500 hover:text-rose-700 font-bold text-xs uppercase tracking-wider transition-colors"
                      >
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
    </div>
  );
};

export default AdminBerita;
