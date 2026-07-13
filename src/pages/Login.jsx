import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CustomAlert } from "../components/CustomDialog";
import { getSupabase, isLocalFallback } from "../utils/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    if (isLocalFallback) {
      if (localStorage.getItem("isAdminAuthenticated") === "true") {
        navigate("/admin", { replace: true });
      }
      return;
    }

    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/admin", { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (isLocalFallback) {
      setIsSubmitting(false);
      setAlertConfig({
        show: true,
        message: "Database offline. Harap lengkapi konfigurasi Supabase di file .env untuk dapat masuk.",
        type: "error"
      });
      return;
    }

    // LOGIN SUPABASE ASLI
    try {
      const supabase = getSupabase();
      // Jika input tidak mengandung '@', otomatis tambahkan domain internal BTA
      const formattedEmail = email.includes("@") ? email : `${email}@perumbta.com`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password: password,
      });

      if (error) throw error;

      setAlertConfig({
        show: true,
        message: "Login berhasil! Selamat datang kembali, Admin.",
        type: "success"
      });
      
      // Arahkan ke halaman admin setelah 1.5 detik
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/admin");
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      setAlertConfig({
        show: true,
        message: error.message || "Gagal masuk. Periksa kembali email dan password Anda.",
        type: "error"
      });
    }
  };

  const handleGoogleLogin = async () => {
    if (isLocalFallback) {
      setAlertConfig({
        show: true,
        message: "Database offline. Harap lengkapi konfigurasi Supabase di file .env untuk menggunakan login Google.",
        type: "error"
      });
      return;
    }

    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/admin"
        }
      });
      if (error) throw error;
    } catch (error) {
      setAlertConfig({
        show: true,
        message: error.message || "Gagal masuk menggunakan Google.",
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
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4 md:px-6 relative overflow-hidden font-sans">
      {/* Background radial glow - extremely subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[140px] -z-10"></div>
      
      {/* Floating Light Back Button - Smaller font */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-primary-dark font-headers font-bold text-[10px] tracking-widest uppercase transition-all duration-300 hover:-translate-x-1 hover:shadow-md shadow-sm group z-20"
      >
        <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Main Split Container */}
      <div className="max-w-4xl w-full bg-white rounded-[2rem] overflow-hidden border border-slate-200/80 shadow-[0_24px_60px_rgba(17,48,37,0.12)] grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        
        {/* Left Side: Solid primary-dark green with centered Welcome Text */}
        <div className="md:col-span-5 bg-primary-dark flex flex-col justify-center p-8 md:p-12 text-white min-h-[250px] md:min-h-0 relative overflow-hidden">
          {/* Subtle gold decorative lines in background to maintain premium feel */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full border border-secondary/20 z-0"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full border border-secondary/15 z-0"></div>

          <div className="relative z-10 space-y-4">
            <span className="text-secondary font-headers font-extrabold text-xs uppercase tracking-widest block">Portal RT</span>
            <h1 className="text-3xl md:text-4xl font-headers font-black tracking-tight leading-tight text-white">
              Halo Admin,<br />
              <span className="text-secondary-light">Selamat Datang</span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed max-w-xs pt-1">
              Silakan masuk untuk mengelola kas, iuran warga, keuangan, serta mengunggah berita terbaru perumahan.
            </p>
          </div>
        </div>

        {/* Right Side: Simple form with bottom line inputs */}
        <div className="md:col-span-7 bg-white p-8 md:p-12 flex flex-col justify-center relative border-t border-slate-100 md:border-t-0 md:border-l">
          <div className="mb-8">
            <h2 className="text-2xl font-headers font-bold text-primary-dark tracking-tight">Masuk Akun</h2>
            <p className="text-slate-500 text-xs mt-1">Masukkan kredensial pengurus yang sah</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            {/* Username/Email Input */}
            <div className="relative group">
              <label className="block text-[10px] font-bold text-secondary-dark uppercase tracking-widest mb-1">Username</label>
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-slate-200 py-2.5 text-primary-dark font-semibold focus:outline-none focus:border-primary transition-all placeholder-slate-400 text-sm"
                placeholder="Masukkan username Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <label className="block text-[10px] font-bold text-secondary-dark uppercase tracking-widest mb-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-transparent border-b border-slate-200 py-2.5 text-primary-dark font-semibold focus:outline-none focus:border-primary transition-all placeholder-slate-400 text-sm"
                placeholder="Masukkan kata sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Actions: Sign In & Google */}
            <div className="space-y-4 pt-4">
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-light text-white py-3.5 rounded-full font-headers font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transform flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Masuk Sekarang</span>
                )}
              </button>

              {/* OR Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Atau</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all text-xs hover:shadow-sm active:scale-[0.98] transform disabled:opacity-75"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.92 3.04C6.26 7.46 8.94 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57v2.97h3.91c2.28-2.1 3.54-5.19 3.54-8.69z" />
                  <path fill="#FBBC05" d="M5.31 10.6c-.24-.72-.38-1.5-.38-2.3c0-.8.14-1.58.38-2.3L1.39 2.96C.5 4.77 0 6.82 0 9c0 2.18.5 4.23 1.39 6.04l3.92-3.04C5.17 11.22 5.17 10.98 5.31 10.6z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.91-2.97c-1.12.75-2.55 1.2-4.05 1.2-3.06 0-5.74-2.42-6.69-5.56L1.39 15.8C3.37 19.69 7.35 23 12 23z" />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-wider">Masuk dengan Google</span>
              </button>
            </div>
          </form>
        </div>

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