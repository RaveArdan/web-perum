import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-[#113025] text-white flex flex-col">
        {/* Logo Admin */}
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <h2 className="text-lg font-bold">Admin Panel BTA</h2>
        </div>
        
        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/admin" className="block px-4 py-2.5 bg-teal-600 rounded-lg font-medium text-sm transition">
            📊 Kelola Kas & Iuran
          </Link>
          <a href="#" className="block px-4 py-2.5 hover:bg-gray-700 rounded-lg font-medium text-sm transition text-gray-300">
            📰 Kelola Berita
          </a>
          <a href="#" className="block px-4 py-2.5 hover:bg-gray-700 rounded-lg font-medium text-sm transition text-gray-300">
            👥 Data Warga
          </a>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <Link to="/" className="block w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition">
            Keluar (Logout)
          </Link>
        </div>
      </aside>

      {/* Area Konten Utama Kanan */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Atas */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <h1 className="text-xl font-bold text-gray-800">Dashboard Pengurus</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Halo, Bendahara RT</span>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
          </div>
        </header>

        {/* Tempat Konten Halaman Render (Scrollable) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <Outlet /> {/* Ini penting! Tempat halaman AdminKas.jsx akan dirender */}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;