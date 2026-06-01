import jadwalRondaPdf from "../assets/jadwal rondo.pdf";
import pakJunedImage from "../assets/pak juned jaya.JPG";
import rondaDay1Image from "../assets/ronda day 1.jpeg";
import motongDagingImage from "../assets/motong daging.png";

const Berita = () => {
  const daftarBerita = [
    {
      id: 4,
      kategori: "Ronda",
      tanggal: "01 Juni 2026",
      judul: "Jadwal Ronda Malam Warga Terbaru",
      img: rondaDay1Image,
      desc: "Jadwal pembagian tugas ronda malam warga Perumahan Banguntapan Asri untuk meningkatkan keamanan lingkungan. Silakan unduh/lihat file PDF jadwal lengkapnya.",
      pdfLink: jadwalRondaPdf
    },
    { id: 1, kategori: "Pengumuman", tanggal: "15 Mei 2026", judul: "Jadwal Fogging Rutin Bulan Mei", img: "https://images.unsplash.com/photo-1584483756208-4103a89e6eb5?auto=format&fit=crop&q=80", desc: "Pencegahan demam berdarah di lingkungan RW dengan melakukan pengasapan (fogging) terjadwal." },
    { id: 2, kategori: "Kegiatan", tanggal: "10 Mei 2026", judul: "Semarak Perayaan HUT BTA ke-10", img: pakJunedImage, desc: "Berbagai rangkaian perlombaan seni dan budaya untuk merayakan ulang tahun ke-10 Perum Banguntapan Asri." },
    { id: 3, kategori: "Kerja Bakti", tanggal: "01 Mei 2026", judul: "Kerja Bakti Warga", img: motongDagingImage, desc: "Kebersamaan warga Perumahan Banguntapan Asri saat bergotong-royong memotong dan membagikan daging secara tertib untuk mempererat silaturahmi antar warga." },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {daftarBerita.map((berita) => (
            <div
              key={berita.id}
              className="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52 bg-slate-100">
                <img
                  src={berita.img}
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
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{berita.desc}</p>
                </div>

                {/* Read More / PDF button */}
                {berita.pdfLink ? (
                  <a
                    href={berita.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 mt-auto w-fit shadow-sm hover:shadow-md"
                  >
                    <span>Lihat Jadwal PDF</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </a>
                ) : (
                  <button className="inline-flex items-center gap-1 text-secondary hover:text-secondary-dark font-bold text-xs uppercase tracking-wider transition-colors mt-auto w-fit">
                    <span>Baca Selengkapnya</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Berita;