import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CustomAlert } from "../components/CustomDialog";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertConfig, setAlertConfig] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // LOGIN SIMULASI
    if (username === "adminRT" && password === "rahasiabt123") {
      // Simpan status login di localStorage browser
      localStorage.setItem("isAdminAuthenticated", "true");
      setAlertConfig({
        show: true,
        message: "Login berhasil! Selamat datang kembali, Admin.",
        type: "success"
      });
      
      // Arahkan ke halaman admin setelah 1.5 detik
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } else {
      setAlertConfig({
        show: true,
        message: "Username atau Password Salah! Harap periksa kembali kredensial Anda.",
        type: "error"
      });
    }
  };

  const handleCloseAlert = () => {
    setAlertConfig({ ...alertConfig, show: false });
    if (alertConfig.type === "success") {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark px-6 relative">
      {/* Back to Home Link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 text-sm font-sans font-bold text-slate-300 hover:text-secondary-light uppercase tracking-widest flex items-center gap-1.5 transition-colors"
      >
        <span>←</span>
        <span>Kembali ke Beranda</span>
      </Link>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-primary/5 max-w-md w-full relative font-sans">
        <div className="text-center mb-8">
          <span className="text-3xl block">🔐</span>
          <h2 className="text-2xl font-headers font-bold text-primary-dark mt-4 tracking-tight">Login Pengurus</h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">Masukkan akun khusus administrator RT</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-primary-dark/85 uppercase tracking-wider mb-2">Username</label>
            <input 
              type="text" 
              className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-400 transition-all text-sm"
              placeholder="Contoh: adminRT"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary-dark/85 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-5 py-3 bg-warm border border-slate-200 rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-semibold text-primary-dark placeholder-slate-500 transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-light text-white py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 mt-6"
          >
            Masuk ke Dashboard
          </button>
        </form>
      </div>

      <CustomAlert 
        show={alertConfig.show} 
        message={alertConfig.message} 
        type={alertConfig.type} 
        onClose={handleCloseAlert} 
      />
    </div>
  );
};

export default Login;