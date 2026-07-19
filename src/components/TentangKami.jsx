import { useState, useEffect } from "react";
import { getSupabase } from "../utils/supabase";

const defaultStrukturPengurusPdf = "";

const TentangKami = () => {
  const [pdfUrl, setPdfUrl] = useState(defaultStrukturPengurusPdf);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from("settings").select("*");
        if (data && data[0]) {
          const dbUrl = data[0].struktur_pengurus_pdf_url;
          if (dbUrl === "none") {
            setPdfUrl(""); // Sembunyikan tombol jika admin menghapusnya
          } else if (dbUrl) {
            setPdfUrl(dbUrl); // Gunakan file PDF yang diunggah
          } else {
            setPdfUrl(defaultStrukturPengurusPdf); // Fallback ke file lokal bawaan
          }
        }
      } catch (err) {
        console.error("Gagal memuat setting PDF pengurus:", err);
      }
    };
    loadSettings();
  }, []);

  return (
    <section id="tentang" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Side: Elegant Simple Image Frame */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-md border border-primary/5">
            <img 
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80" 
              alt="Perumahan Banguntapan Asri" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        {/* Right Side: Copy and Features */}
        <div className="w-full md:w-1/2 font-sans">
          <span className="text-secondary font-headers font-bold tracking-widest text-sm uppercase block w-fit mb-4">TENTANG KAMI</span>
          <h2 className="text-3xl md:text-4xl font-headers font-bold text-primary-dark mb-6 leading-tight tracking-tight">
            Visi Misi
          </h2>
          <p className="text-primary-dark/90 text-[15px] leading-relaxed mb-8">
            Membangun komunikasi dan partisipasi aktif warga. Menjaga kebersihan, keamanan, dan ketertiban lingkungan. Mengembangkan kegiatan sosial kemasyarakatan yang humanis. Mendorong transparasi dan akuntabilitas dalam tata kelola RT.
          </p>

          {/* Quick value indicators */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="flex items-center gap-3 p-4 rounded-2xl bg-warm border border-primary/5">
              <div className="text-secondary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className="font-bold text-primary-dark text-sm">Keamanan 24 Jam</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-warm border border-primary/5">
              <div className="text-secondary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
              </div>
              <span className="font-bold text-primary-dark text-sm">Kebersihan Terpadu</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-warm border border-primary/5">
              <div className="text-secondary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span className="font-bold text-primary-dark text-sm font-sans">Rukun & Guyub</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-warm border border-primary/5">
              <div className="text-secondary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <span className="font-bold text-primary-dark text-sm">Kas Transparan</span>
            </div>
          </div>
          
          {pdfUrl && (
            <div className="flex gap-4">
              <a 
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 inline-block"
              >
                Susunan Pengurus
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TentangKami;