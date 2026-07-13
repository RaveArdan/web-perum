import { createPortal } from "react-dom";

const NewsDetailModal = ({ isOpen, onClose, newsItem }) => {
  if (!isOpen || !newsItem) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-primary/5 relative overflow-y-auto max-h-[90vh] z-10 animate-scaleUp">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg p-2 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Banner Image */}
        {newsItem.img && (
          <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6 bg-slate-100">
            <img 
              src={newsItem.img} 
              alt={newsItem.judul} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Category Badge & Date */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            {newsItem.kategori}
          </span>
          <span className="text-xs text-slate-500 font-semibold">{newsItem.tanggal}</span>
        </div>

        {/* Title */}
        <h2 className="font-headers font-bold text-xl md:text-2xl text-primary-dark tracking-tight leading-snug mb-4">
          {newsItem.judul}
        </h2>

        {/* Description / Content */}
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-6">
          {newsItem.desc}
        </p>

        {/* PDF Link action button */}
        {newsItem.pdfLink && (
          <div className="pt-4 border-t border-slate-100 flex">
            <a 
              href={newsItem.pdfLink}
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
            >
              <span>Lihat Dokumen PDF Pendukung</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default NewsDetailModal;
