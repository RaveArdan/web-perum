import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-slate-300 py-16 px-6 md:px-12 border-t border-primary/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pb-12 border-b border-primary-light/10 font-sans">
        
        {/* Column 1: Brand block & Socials */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-5 text-white">
              <span className="text-xl">🏡</span>
              <h3 className="text-xl font-headers font-bold tracking-tight">
                Perumahan Banguntapan <span className="text-secondary-light">Asri</span>
              </h3>
            </div>
            <p className="text-sm text-slate-300/90 leading-relaxed max-w-xs mb-6">
              Portal resmi paguyuban warga khusus untuk pengelolaan transparansi kas keuangan, iuran bulanan, dan informasi lingkungan Perum Banguntapan Asri, Bantul, DIY.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-secondary-light hover:bg-secondary/15 hover:text-secondary-light flex items-center justify-center transition-all duration-300 text-slate-300"
              title="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-secondary-light hover:bg-secondary/15 hover:text-secondary-light flex items-center justify-center transition-all duration-300 text-slate-300"
              title="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.051 1.96.23 2.53.45a4.343 4.343 0 011.57 1.022 4.148 4.148 0 011.022 1.571c.22.569.4 1.39.45 2.53.044.927.054 1.286.054 3.71s-.01 2.784-.054 3.71c-.05 1.14-.23 1.96-.45 2.53a4.607 4.607 0 01-2.592 2.592c-.569.22-1.39.4-2.53.45-.927.044-1.286.054-3.71.054s-2.784-.01-3.71-.054c-1.14-.05-1.96-.23-2.53-.45a4.148 4.148 0 01-1.57-1.022 4.148 4.148 0 01-1.022-1.571c-.22-.569-.4-1.39-.45-2.53-.044-.927-.054-1.286-.054-3.71s.01-2.784.054-3.71c.05-1.14.23-1.96.45-2.53a4.148 4.148 0 011.022-1.57 4.148 4.148 0 011.571-1.022c.569-.22 1.39-.4 2.53-.45.928-.044 1.286-.054 3.71-.054zM12 7.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zM12 14.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm5.75-6.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-headers font-bold text-sm tracking-wider uppercase mb-5">Navigasi Halaman</h4>
          <ul className="space-y-3.5 text-sm">
            <li>
              <Link to="/" className="hover:text-secondary-light transition-colors duration-200">Beranda</Link>
            </li>
            <li>
              <a href="/#tentang" className="hover:text-secondary-light transition-colors duration-200">Tentang Kami</a>
            </li>
            <li>
              <Link to="/berita" className="hover:text-secondary-light transition-colors duration-200">Berita & Pengumuman</Link>
            </li>
            <li>
              <Link to="/keuangan" className="hover:text-secondary-light transition-colors duration-200">Laporan Kas RT</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Emergency Contacts */}
        <div>
          <h4 className="text-white font-headers font-bold text-sm tracking-wider uppercase mb-5">Kontak Darurat</h4>
          <ul className="space-y-3.5 text-sm text-slate-300/90">
            <li className="flex items-center gap-2.5">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.8} 
                stroke="currentColor" 
                className="w-4 h-4 text-secondary-light shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>Ketua RT: <strong className="text-white font-semibold">0898-7654-3210</strong></span>
            </li>
            <li className="flex items-center gap-2.5">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.8} 
                stroke="currentColor" 
                className="w-4 h-4 text-secondary-light shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
              <span>Layanan PLN: <strong className="text-white font-semibold">123</strong></span>
            </li>
          </ul>
        </div>

        {/* Column 4: Location Map */}
        <div>
          <h4 className="text-white font-headers font-bold text-sm tracking-wider uppercase mb-5">Lokasi Perumahan</h4>
          <div className="w-full h-[140px] rounded-xl overflow-hidden border border-white/10 shadow-md mb-3 bg-white/5 relative group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.5019808381156!2d110.41171827484461!3d-7.844482892176848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a57c3c078f359%3A0x6f26db621d6d8cd5!2sPerumahan%20Banguntapan%20Asri!5e0!3m2!1sid!2sid!4v1717200000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Perumahan Banguntapan Asri"
              className="w-full h-full grayscale-[10%] contrast-[105%] saturate-[105%] transition-all duration-300 group-hover:grayscale-0"
            ></iframe>
          </div>
          <a
            href="https://maps.app.goo.gl/9hYynK2jVFofbENP8"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white rounded-full font-headers font-semibold text-sm hover:bg-secondary-dark transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Buka di Google Maps
          </a>
        </div>

      </div>
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-sans tracking-wide uppercase font-medium">
        <p>&copy; 2026 Perumahan Banguntapan Asri. Hak Cipta Dilindungi.</p>
        <p className="flex items-center gap-1.5">
          Dikembangkan dengan <span className="text-secondary-light">💚</span> oleh Paguyuban Warga
        </p>
      </div>
    </footer>
  );
};

export default Footer;