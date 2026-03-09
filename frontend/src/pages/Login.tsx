import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.service"; // Pastikan service ini sudah ada
import { setToken, setUserRole } from "../utils/storage";
import axios from "axios";
import { useState } from "react";
import { Mail, Lock, Loader2, AlertCircle, UserPlus, LogIn } from "lucide-react";

// Gabungkan skema validasi agar fleksibel
const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true); // State untuk switch form
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

        if (response && response.data && response.data.token) {
          const { token, role } = response.data;
          setToken(token);
          setUserRole(role);
          localStorage.setItem("userEmail", data.email); 

          if (role === "ADMIN") {
            navigate("/admin/posts", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      } else {
        // --- LOGIKA REGISTER ---
        // Memanggil endpoint register di backend kamu
        const response = await axios.post("http://localhost:3000/users/register", {
          email: data.email,
          password: data.password,
        });

        if (response.status === 201) {
          setSuccessMsg("Akun berhasil dibuat! Silakan Login.");
          reset(); // Kosongkan form
          setIsLoginView(true); // Balik ke tampilan login
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
    <div className="min-h-screen flex items-center justify-center bg-[pink] relative overflow-hidden">
      {/* Aesthetic Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#ec4899 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}>
      </div>

      <div className="w-full max-w-sm relative z-10 px-4">
        <div className="bg-[#161B22]/95 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          
          {/* Header Portal */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-center">
            <h1 className="text-white text-xl font-black uppercase tracking-[0.2em]">
              {isLoginView ? "Souvnela Login" : "Souvnela Join"}
            </h1>
            <p className="text-pink-100 text-[9px] font-bold uppercase mt-1 tracking-widest opacity-70 italic">
              {isLoginView ? "Portal Admin & Pelanggan" : "Buat Akun Pelanggan Baru"}
            </p>
          </div>

          {/* Switch Tab (Login / Register) */}
          <div className="flex border-b border-gray-800">
            <button 
              onClick={() => { setIsLoginView(true); setServerError(""); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${isLoginView ? 'text-pink-500 bg-pink-500/5' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLoginView(false); setServerError(""); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${!isLoginView ? 'text-pink-500 bg-pink-500/5' : 'text-gray-500'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Error & Success Messages */}
            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter leading-tight">{serverError}</p>
              </div>
            )}
            {successMsg && (
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-green-500 text-[10px] font-bold uppercase tracking-tighter leading-tight">{successMsg}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-500 transition-colors w-4 h-4" />
                  <input
                    {...register("email")}
                    placeholder="Email Address"
                    className="w-full bg-black/30 border-b border-gray-800 p-3 pl-10 text-gray-100 focus:border-pink-500 outline-none transition-all text-sm placeholder:text-gray-600"
                  />
                </div>
                {errors.email && <p className="text-pink-500 text-[9px] font-bold uppercase italic ml-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-500 transition-colors w-4 h-4" />
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Password"
                    className="w-full bg-black/30 border-b border-gray-800 p-3 pl-10 text-gray-100 focus:border-pink-500 outline-none transition-all text-sm placeholder:text-gray-600"
                  />
                </div>
                {errors.password && <p className="text-pink-500 text-[9px] font-bold uppercase italic ml-1">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-black shadow-[0_10px_20px_rgba(236,72,153,0.2)] transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 active:scale-95 disabled:grayscale"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                isLoginView ? <><LogIn className="w-4 h-4" /> Sign In</> : <><UserPlus className="w-4 h-4" /> Register Now</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}