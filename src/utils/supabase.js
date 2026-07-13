import { createClient } from "@supabase/supabase-js";

// Periksa apakah konfigurasi Supabase tersedia di environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

let supabaseClient = null;
if (isSupabaseConfigured) {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
}

// Data awal (seed) untuk fallback localStorage jika database kosong
const DEFAULT_SETTINGS = {
  id: 1,
  keuangan_sheet_url: "https://docs.google.com/spreadsheets/d/1LZGu7UjWrZCZg-q9aJAulWRmGpGSo_FB/edit?usp=sharing",
  iuran_sheet_url: "https://docs.google.com/spreadsheets/d/1_YOUR_SPREADSHEET_ID_HERE/edit?usp=sharing",
  struktur_pengurus_pdf_url: "", // Jika kosong, komponen TentangKami akan menggunakan file bawaan src/assets
  aspirasi_form_url: "" // Tautan Google Form untuk kotak aspirasi warga
};

const DEFAULT_BERITA = [
  {
    id: 4,
    kategori: "Ronda",
    tanggal: "Setiap Malam",
    judul: "Jadwal Ronda Malam Warga Terbaru",
    img: "/src/assets/ronda day 1.jpeg",
    desc: "Jadwal pembagian tugas ronda malam warga Perumahan Banguntapan Asri untuk meningkatkan keamanan lingkungan. Silakan unduh/lihat file PDF jadwal lengkapnya.",
    pdfLink: "/src/assets/jadwal rondo.pdf"
  },
  {
    id: 2,
    kategori: "Kegiatan",
    tanggal: "17 Agustus",
    judul: "Perayaan Hari Kemerdekaan RI",
    img: "/src/assets/pak juned jaya.JPG",
    desc: "Antusias Warga Perumahan Banguntapan Asri untuk menyelenggarakan berbagai Rangkaian Perlombaan, Jalan Sehat, dan Malam Tirakatan untuk merayakan hari kemerdekaan Indonesia"
  },
  {
    id: 3,
    kategori: "Kerja Bakti",
    tanggal: "Setiap Hari Minggu",
    judul: "Kerja Bakti Warga",
    img: "/src/assets/motong daging.png",
    desc: "Kebersamaan warga Perumahan Banguntapan Asri saat bergotong-royong memotong dan membagikan daging secara tertib untuk mempererat silaturahmi antar warga."
  }
];

// Helper inisialisasi penyimpanan lokal
const initLocalDB = () => {
  if (!localStorage.getItem("local_settings")) {
    localStorage.setItem("local_settings", JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem("local_berita")) {
    localStorage.setItem("local_berita", JSON.stringify(DEFAULT_BERITA));
  }
};

// Builder Kelas Simulasi untuk meniru sintaks query Supabase
class MockBuilder {
  constructor(table) {
    this.table = table;
    initLocalDB();
  }

  getData() {
    return JSON.parse(localStorage.getItem(`local_${this.table}`));
  }

  saveData(data) {
    localStorage.setItem(`local_${this.table}`, JSON.stringify(data));
  }

  select(columns = "*") {
    const data = this.getData();
    
    const execute = async () => {
      if (this.table === "settings") {
        return { data: [data], error: null };
      }
      if (this.table === "berita") {
        // Urutkan berita berdasarkan id descending
        const sorted = [...data].sort((a, b) => b.id - a.id);
        return { data: sorted, error: null };
      }
      return { data, error: null };
    };

    const promise = execute();
    
    // Simulasikan chain .order()
    promise.order = (col, { ascending } = { ascending: true }) => {
      const orderExecute = async () => {
        const { data: list } = await promise;
        const sorted = [...list].sort((a, b) => {
          if (a[col] < b[col]) return ascending ? -1 : 1;
          if (a[col] > b[col]) return ascending ? 1 : -1;
          return 0;
        });
        return { data: sorted, error: null };
      };
      return orderExecute();
    };
    
    return promise;
  }

  insert(rows) {
    const data = this.getData();
    const execute = async () => {
      const newRows = Array.isArray(rows) ? rows : [rows];
      const inserted = newRows.map((row, idx) => {
        const maxId = data.reduce((max, item) => (item.id > max ? item.id : max), 0);
        return { id: maxId + idx + 1, ...row };
      });
      const updatedData = [...data, ...inserted];
      this.saveData(updatedData);
      return { data: inserted, error: null };
    };
    return execute();
  }

  update(values) {
    const data = this.getData();
    
    const eq = (field, val) => {
      const execute = async () => {
        if (this.table === "settings") {
          const updated = { ...data, ...values };
          this.saveData(updated);
          return { data: [updated], error: null };
        }
        
        const updatedList = data.map(item => {
          if (item[field] === val) {
            return { ...item, ...values };
          }
          return item;
        });
        this.saveData(updatedList);
        return { data: updatedList.filter(item => item[field] === val), error: null };
      };
      return execute();
    };

    return { eq };
  }

  delete() {
    const data = this.getData();
    
    const eq = (field, val) => {
      const execute = async () => {
        const remaining = data.filter(item => item[field] !== val);
        this.saveData(remaining);
        return { data: data.filter(item => item[field] === val), error: null };
      };
      return execute();
    };

    return { eq };
  }
}

// Ekspor fungsi utama pengambil klien
export const getSupabase = () => {
  if (isSupabaseConfigured) {
    return supabaseClient;
  }
  
  // Kembalikan Mock Client jika Supabase belum dikonfigurasi
  return {
    from: (table) => new MockBuilder(table),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: { user: null }, error: new Error("Mock auth mode") }),
      signInWithOAuth: async () => ({ data: {}, error: new Error("Mock auth mode") }),
      signOut: async () => ({ error: null })
    },
    storage: {
      from: (bucket) => ({
        upload: async (path, file) => {
          // File diunggah ke storage
          return { data: { path }, error: null };
        },
        getPublicUrl: (path) => {
          // Untuk fallback, file langsung mengembalikan base64 string/jalur file lokal
          return { data: { publicUrl: path } };
        }
      })
    }
  };
};

export const isLocalFallback = !isSupabaseConfigured;
