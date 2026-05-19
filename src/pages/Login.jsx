// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // LOGIN SIMULASI (Nanti bagian ini disambungkan ke Database)
    if (username === "adminRT" && password === "rahasiabt123") {
      // Simpan status login di localStorage browser
      localStorage.setItem("isAdminAuthenticated", "true");
      // Pindahkan admin ke halaman dashboard admin
      navigate("/admin");
    } else {
      alert("Username atau Password Salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-gray-200">
        <div className="text-center mb-6">
          <span className="text-4xl">🔐</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Login Pengurus Perumahan</h2>
          <p className="text-gray-500 text-sm mt-1">Masukkan akun admin khusus pengurus RT</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            {/* TAG PENUTUP DIPERBAIKI MENJADI </label> */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            {/* TAG PENUTUP DIPERBAIKI MENJADI </label> */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#113025] hover:bg-teal-800 text-white py-2.5 rounded-lg font-bold transition mt-2">
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;