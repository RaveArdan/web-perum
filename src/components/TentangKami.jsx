const TentangKami = () => {
  return (
    <section id="tentang" className="py-16 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80" 
            alt="Perumahan Banguntapan Asri" 
            className="w-full h-auto object-cover hover:scale-105 transition duration-500"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h4 className="text-teal-600 font-bold tracking-wider text-sm mb-2">TENTANG KAMI</h4>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Lingkungan Asri, <br/> Warga Bersinergi.
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Paguyuban Warga Perum Banguntapan Asri adalah wadah silaturahmi dan koordinasi antar warga. 
            Kami berkomitmen menciptakan lingkungan perumahan yang aman, nyaman, dan transparan dalam pengelolaan kas untuk kesejahteraan bersama.
          </p>
          <div className="flex gap-4">
            <button className="border-2 border-teal-600 text-teal-600 px-6 py-2.5 rounded font-bold text-sm hover:bg-teal-600 hover:text-white transition">
              Susunan Pengurus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TentangKami;