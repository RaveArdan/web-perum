import { useState } from "react";

const CekIuran = () => {
  const [noRumah, setNoRumah] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState(null);
  const [sudahCari, setSudahCari] = useState(false);

  // Data Dummy (Simulasi Database)
  const dataTagihanWarga = [
    {
      blok: "A-12",
      nama: "Bpk. Budi S***",
      statusBulanan: [
        { bulan: "Januari", status: "Lunas" },
        { bulan: "Februari", status: "Lunas" },
        { bulan: "Maret", status: "Lunas" },
        { bulan: "April", status: "Belum" },
        { bulan: "Mei", status: "Belum" },
      ]
    },
    {
      blok: "B-05",
      nama: "Ibu Siti A***",
      statusBulanan: [
        { bulan: "Januari", status: "Lunas" },
        { bulan: "Februari", status: "Lunas" },
        { bulan: "Maret", status: "Belum" },
        { bulan: "April", status: "Belum" },
        { bulan: "Mei", status: "Belum" },
      ]
    }
  ];

  const handleCari = (e) => {
    e.preventDefault();
    setSudahCari(true);
    
    // Cari data berdasarkan inputan (diubah ke huruf besar semua agar cocok)
    const dataDitemukan = dataTagihanWarga.find(
      (warga) => warga.blok === noRumah.toUpperCase()
    );
    
    setHasilPencarian(dataDitemukan || null);
  };

  return (
    <div className="min-h-screen py-16 px-6 md:px-12 bg-gray-50 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Cek Status Iuran</h1>
          <p className="text-gray-600">Masukkan nomor blok dan rumah Anda untuk melihat riwayat pembayaran kas/iuran bulanan.</p>
        </div>

        {/* Kotak Pencarian */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
          <form onSubmit={handleCari} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Contoh: A-12"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium uppercase"
              value={noRumah}
              onChange={(e) => setNoRumah(e.target.value)}
              required
            />
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold transition whitespace-nowrap">
              Cek Tagihan
            </button>
          </form>
        </div>

        {/* Hasil Pencarian */}
        {sudahCari && (
          <div className="mt-8">
            {hasilPencarian ? (
              <div className="bg-white rounded-xl shadow-md border-t-4 border-t-teal-500 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Hasil Pencarian untuk Blok:</p>
                    <h2 className="text-2xl font-bold text-gray-900">{hasilPencarian.blok}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Penanggung Jawab:</p>
                    <h3 className="font-semibold text-gray-800">{hasilPencarian.nama}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="font-bold text-gray-800 mb-4">Status Iuran Tahun 2026</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hasilPencarian.statusBulanan.map((item, index) => (
                      <div key={index} className={`p-3 rounded-lg border flex justify-between items-center ${item.status === 'Lunas' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <span className="font-medium text-gray-700 text-sm">{item.bulan}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${item.status === 'Lunas' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                  <p className="text-sm text-gray-600">Jika terdapat ketidaksesuaian data, harap hubungi Bendahara RT.</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-200">
                Data untuk blok <strong>{noRumah.toUpperCase()}</strong> tidak ditemukan. Pastikan format penulisan benar (Contoh: A-12).
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CekIuran;