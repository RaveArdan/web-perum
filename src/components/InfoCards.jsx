import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSupabase } from "../utils/supabase";

const getFetchUrlFromSheetUrl = (sheetUrl) => {
  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const id = match ? match[1] : "1LZGu7UjWrZCZg-q9aJAulWRmGpGSo_FB";
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json`;
};

const InfoCards = () => {
  const [totalSaldo, setTotalSaldo] = useState(3593551);
  const [loadingSaldo, setLoadingSaldo] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadDashboardAndNews = async () => {
      try {
        const supabase = getSupabase();
        
        // 1. Ambil URL kas dari settings
        const { data: settingsData } = await supabase.from("settings").select("*");
        const sheetUrl = settingsData?.[0]?.keuangan_sheet_url || "https://docs.google.com/spreadsheets/d/1LZGu7UjWrZCZg-q9aJAulWRmGpGSo_FB/edit?usp=sharing";
        
        // 2. Ambil total saldo kas dari Google Sheet
        try {
          const fetchUrl = getFetchUrlFromSheetUrl(sheetUrl);
          const response = await fetch(fetchUrl);
          if (response.ok) {
            const text = await response.text();
            const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+?)\);/);
            if (match) {
              const data = JSON.parse(match[1]);
              const rows = data.table.rows || [];
              const totalRow = rows.find(r => r.c && r.c[0]?.v?.toString().toLowerCase().trim() === 'total');
              if (totalRow && totalRow.c[3]?.v !== undefined) {
                setTotalSaldo(Number(totalRow.c[3].v));
              }
            }
          }
        } catch (err) {
          console.error("Gagal mengambil saldo untuk homepage:", err);
        } finally {
          setLoadingSaldo(false);
        }

        // 3. Ambil pengumuman dan kegiatan dari database berita
        try {
          setLoadingNews(true);
          const { data: newsData } = await supabase.from("berita").select("*").order("id", { ascending: false });
          if (newsData) {
            const ann = newsData.filter(item => item.kategori === "Pengumuman").slice(0, 3);
            const act = newsData.filter(item => ["Kegiatan", "Ronda", "Kerja Bakti"].includes(item.kategori)).slice(0, 3);
            setAnnouncements(ann);
            setActivities(act);
          }
        } catch (err) {
          console.error("Gagal mengambil berita:", err);
        } finally {
          setLoadingNews(false);
        }

      } catch (err) {
        console.error("Gagal memuat data info cards:", err);
      }
    };
    
    loadDashboardAndNews();
  }, []);

  return (
    <section className="relative z-20 px-6 md:px-12 -mt-20 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Card 1: Pengumuman Terbaru */}
        <div className="bg-white p-8 rounded-2xl border border-primary/5 shadow-md hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-secondary font-headers font-bold text-sm tracking-wider uppercase">PENGUMUMAN TERBARU</span>
            </div>
            {loadingNews ? (
              <div className="space-y-4 py-2">
                <div className="h-4 bg-slate-100 animate-pulse rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 animate-pulse rounded w-1/2"></div>
              </div>
            ) : announcements.length === 0 ? (
              <div className="font-sans text-sm text-slate-500 italic py-4">
                Belum ada pengumuman terbaru saat ini.
              </div>
            ) : (
              <ul className="space-y-4 font-sans text-[15px] text-primary-dark/85">
                {announcements.map((ann, idx) => (
                  <li key={ann.id} className={idx < announcements.length - 1 ? "border-b border-primary/5 pb-3" : ""}>
                    <h4 className="font-bold text-primary text-[15px]">{ann.judul}</h4>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{ann.tanggal}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Card 2: Kegiatan Warga */}
        <div className="bg-white p-8 rounded-2xl border border-primary/5 shadow-md hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-secondary font-headers font-bold text-sm tracking-wider uppercase">KEGIATAN WARGA</span>
            </div>
            {loadingNews ? (
              <div className="space-y-4 py-2">
                <div className="h-4 bg-slate-100 animate-pulse rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 animate-pulse rounded w-1/2"></div>
              </div>
            ) : activities.length === 0 ? (
              <div className="font-sans text-sm text-slate-500 italic py-4">
                Belum ada kegiatan warga saat ini.
              </div>
            ) : (
              <ul className="space-y-4 font-sans text-[15px] text-primary-dark/85">
                {activities.map((act, idx) => (
                  <li key={act.id} className={idx < activities.length - 1 ? "border-b border-primary/5 pb-3" : ""}>
                    <h4 className="font-bold text-primary text-[15px]">{act.judul}</h4>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{act.tanggal}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Card 3: Status Keuangan */}
        <div className="bg-white p-8 rounded-2xl border border-primary/5 shadow-md hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-secondary font-headers font-bold text-sm tracking-wider uppercase">STATUS KEUANGAN</span>
            </div>
            <div className="mb-6 font-sans">
              <p className="text-xs text-slate-600 uppercase tracking-wider font-bold mb-1">Total Saldo Kas RT</p>
              {loadingSaldo ? (
                <div className="h-9 w-40 bg-slate-100 animate-pulse rounded-lg mt-1"></div>
              ) : (
                <h2 className="text-3xl font-bold text-primary-dark tracking-tight">
                  Rp {totalSaldo.toLocaleString('id-ID')}
                </h2>
              )}
              <span className="inline-block mt-2 text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-bold">
                Update: Live
              </span>
            </div>
          </div>

          <Link
            to="/keuangan"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white px-5 py-3.5 rounded-full font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300"
          >
            <span>Lihat Laporan Lengkap</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default InfoCards;