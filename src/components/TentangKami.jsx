const TentangKami = () => {
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
            Lingkungan Asri, <br/>
            Warga Bersinergi
          </h2>
          <p className="text-primary-dark/90 text-[15px] leading-relaxed mb-8">
            Paguyuban Warga Perum Banguntapan Asri adalah wadah silaturahmi, gotong royong, dan transparansi koordinasi antar warga. 
            Kami berdedikasi membangun lingkungan hunian yang aman, inklusif, dan harmonis demi kenyamanan hidup bersama.
          </p>

          {/* Quick value indicators */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-warm border border-primary/5">
              <span className="text-secondary text-lg">🛡️</span>
              <span className="font-bold text-primary-dark text-sm">Keamanan 24 Jam</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-warm border border-primary/5">
              <span className="text-secondary text-lg">✨</span>
              <span className="font-bold text-primary-dark text-sm">Kebersihan Terpadu</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-warm border border-primary/5">
              <span className="text-secondary text-lg">🤝</span>
              <span className="font-bold text-primary-dark text-sm font-sans">Rukun & Guyub</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-warm border border-primary/5">
              <span className="text-secondary text-lg">📈</span>
              <span className="font-bold text-primary-dark text-sm">Kas Transparan</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300">
              Susunan Pengurus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TentangKami;