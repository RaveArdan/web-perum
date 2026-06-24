import { useState, useEffect } from "react";
import { getSupabase } from "../utils/supabase";

const Berita = () => {
  const [daftarBerita, setDaftarBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBerita = async () => {
      try {
        setLoading(true);
        const supabase = getSupabase();
        const { data, error } = await supabase.from("berita").select("*").order("id", { ascending: false });
        if (error) throw error;
        setDaftarBerita(data || []);
      } catch (err) {
        console.error("Gagal memuat berita:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBerita();
  }, []);

  return (
    <div className="bg-[#faf9f6] min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto font-sans">
        {/* Page Header */}
        <div className="relative mb-16 pb-8 border-b border-primary/5">
          <span className="text-secondary font-headers font-bold tracking-widest text-sm uppercase block mb-3">INFORMASI TERKINI</span>
          <h1 className="text-3xl md:text-5xl font-headers font-bold text-primary-dark tracking-tight">Kabar Banguntapan Asri</h1>
          <p className="text-primary-light/90 mt-2 text-sm md:text-[15px]">Berita terbaru, agenda kegiatan, pengumuman penting seputar lingkungan perumahan.</p>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            <svg className="animate-spin h-8 w-8 text-secondary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Memuat berita...</span>
          </div>
        ) : daftarBerita.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            Belum ada berita atau pengumuman saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {daftarBerita.map((berita) => (
              <div
                key={berita.id}
                className="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-52 bg-slate-100">
                  <img
                    src={berita.img || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80"}
                    alt={berita.judul}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-secondary text-white text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full">
                        {berita.kategori}
                      </span>
                      <span className="text-sm text-slate-600 font-semibold">{berita.tanggal}</span>
                    </div>
                    <h2 className="font-headers font-bold text-primary-dark text-lg md:text-xl mb-3 leading-snug hover:text-primary transition-colors">
                      {berita.judul}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">{berita.desc}</p>
                  </div>

                  {/* Read More / PDF button */}
                  {berita.pdfLink && (
                    <a
                      href={berita.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 mt-auto w-fit shadow-sm hover:shadow-md"
                    >
                      <span>Lihat Dokumen PDF</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Berita;