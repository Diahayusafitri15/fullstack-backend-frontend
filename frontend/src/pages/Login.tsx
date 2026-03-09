import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.service"; 
import { setToken, setUserRole } from "../utils/storage";
import axios from "axios";
import { useState } from "react";
import { Mail, Lock, Loader2, AlertCircle, UserPlus, LogIn } from "lucide-react";

// Skema validasi
const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true); 
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError("");
    setSuccessMsg("");
    
    try {
      if (isLoginView) {
        // --- LOGIKA LOGIN ---
        localStorage.clear();
        const response = await loginUser(data);

        // Pastikan response membawa data user (email, id, dll)
        if (response && response.data && response.data.token) {
          const { token, role } = response.data;
          
          // 1. Simpan Token & Role
          setToken(token);
          setUserRole(role);
          
          // 2. SIMPAN OBJEK USER LENGKAP (Penting untuk Navbar)
          // Kita simpan sebagai string agar bisa dibaca JSON.parse di Navbar
          const userData = {
            email: data.email,
            role: role
          };
          localStorage.setItem("user", JSON.stringify(userData));

          // 3. Notifikasi & Redirect
          if (role === "ADMIN") {
            navigate("/admin/posts", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      } else {
        // --- LOGIKA REGISTER ---
        const response = await axios.post("http://localhost:3000/users/register", {
          email: data.email,
          password: data.password,
        });

        if (response.status === 201) {
          setSuccessMsg("Akun berhasil dibuat! Silakan Sign In ✨");
          reset(); 
          setIsLoginView(true); 
        }
      }
    } catch (error: unknown) {
      let message = "Terjadi kesalahan pada server.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      setServerError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-200 relative overflow-hidden font-sans">
      {/* Aesthetic Background Dots */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#ff69b4 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
      </div>

      <div className="w-full max-w-sm relative z-10 px-4">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[40px] border border-white shadow-2xl overflow-hidden shadow-pink-300/50">
          
          {/* Header Portal */}
          <div className="bg-pink-500 p-8 text-center">
            <h1 className="text-white text-2xl font-black uppercase tracking-[0.3em] italic">
              {isLoginView ? "Yahyu Handmade" : "JOIN US"}
            </h1>
            <p className="text-pink-100 text-[10px] font-bold uppercase mt-2 tracking-widest opacity-90">
              {isLoginView ? "Selamat Datang Kembali, Bestie! 🎀" : "Mulai Koleksi Souvenirmu 🌸"}
            </p>
          </div>

          {/* Switch Tab */}
          <div className="flex bg-pink-50/50">
            <button 
              onClick={() => { setIsLoginView(true); setServerError(""); setSuccessMsg(""); }}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${isLoginView ? 'text-pink-600 bg-white rounded-t-[30px]' : 'text-pink-300'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLoginView(false); setServerError(""); setSuccessMsg(""); }}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${!isLoginView ? 'text-pink-600 bg-white rounded-t-[30px]' : 'text-pink-300'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
            {/* Status Messages */}
            {serverError && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center gap-3 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-500 text-[10px] font-black uppercase tracking-tighter">{serverError}</p>
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 border border-green-100 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <p className="text-green-500 text-[10px] font-black uppercase tracking-tighter">{successMsg}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors w-4 h-4" />
                  <input
                    {...register("email")}
                    placeholder="Email Address"
                    className="w-full bg-pink-50/50 border-2 border-transparent rounded-2xl p-4 pl-12 text-gray-700 focus:border-pink-300 focus:bg-white outline-none transition-all text-sm font-bold placeholder:text-pink-200"
                  />
                </div>
                {errors.email && <p className="text-pink-500 text-[9px] font-black uppercase italic ml-2">{errors.email.message}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors w-4 h-4" />
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Password"
                    className="w-full bg-pink-50/50 border-2 border-transparent rounded-2xl p-4 pl-12 text-gray-700 focus:border-pink-300 focus:bg-white outline-none transition-all text-sm font-bold placeholder:text-pink-200"
                  />
                </div>
                {errors.password && <p className="text-pink-500 text-[9px] font-black uppercase italic ml-2">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-200 transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 active:scale-95 disabled:grayscale disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                isLoginView ? <><LogIn className="w-4 h-4" /> Masuk Sekarang</> : <><UserPlus className="w-4 h-4" /> Daftar Akun</>
              )}
            </button>
            
            <p className="text-center text-[9px] text-pink-300 font-bold uppercase tracking-widest pt-2">
              &copy; 2026 Yahyu Handmade
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}