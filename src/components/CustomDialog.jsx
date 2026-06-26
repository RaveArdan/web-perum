import React from "react";

export const CustomAlert = ({ show, message, type = "success", onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-primary/5 text-center space-y-6 transform scale-100 transition-all duration-300">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl font-bold ${
          type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
        }`}>
          {type === "success" ? "✓" : "✕"}
        </div>
        <div>
          <h4 className="text-lg font-headers font-bold text-primary-dark">
            {type === "success" ? "Berhasil!" : "Terjadi Kesalahan"}
          </h4>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed font-sans">
            {message}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="w-full text-center py-3.5 bg-primary hover:bg-primary-light text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export const CustomConfirm = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-primary/5 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 border border-amber-200/55 flex items-center justify-center mx-auto text-3xl">
          ⚠️
        </div>
        <div>
          <h4 className="text-lg font-headers font-bold text-primary-dark">Konfirmasi Tindakan</h4>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed font-sans">
            {message}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={() => {
              onConfirm();
              onCancel(); // close modal
            }}
            className="w-full text-center py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
          >
            Ya, Lanjutkan
          </button>
          <button 
            onClick={onCancel}
            className="w-full text-center py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
