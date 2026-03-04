import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginUser, LoginResponse } from "../api/auth.service";
import { setToken, setUserRole } from "../utils/storage";
import axios from "axios";
import { useState } from "react";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

// 1. Skema Validasi Zod
const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Logika Submit yang Ketat
  const onSubmit = async (data: LoginForm) => {
    setServerError(""); // Bersihkan error sebelumnya
    
    try {
      // Membersihkan sisa login lama sebelum mencoba login baru
      localStorage.clear(); 

      const response = await loginUser(data);

      // Pastikan response data dan token benar-benar ada
      if (response && response.data && response.data.token) {
        const { token, role }: LoginResponse = response.data;

        // Simpan data autentikasi
        setToken(token);
        setUserRole(role);

        // Redirect BERDASARKAN ROLE hanya jika login sukses
        if (role === "ADMIN") {
          navigate("/admin/posts", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        // Jika response sukses (200) tapi data kosong
        setServerError("Data akun tidak ditemukan.");
      }

    } catch (error: unknown) {
      // Jika password salah (Error 401/400), Axios akan melempar ke sini
      let message = "Email atau password salah!";
      
      if (axios.isAxiosError(error)) {
        // Ambil pesan asli dari backend (Read Validation Message)
        message = error.response?.data?.message || message;
      }
      
      setServerError(message);
      // PENTING: navigate TIDAK dijalankan di sini, jadi user tetap di halaman Login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] relative overflow-hidden font-sans">
      {/* Efek Background Mesh & Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#ec4899 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10 px-4">
        <div className="bg-[#161B22]/90 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          
          {/* Header Pink Gradient */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-center shadow-lg">
            <h1 className="text-white text-xl font-black uppercase tracking-[0.2em]">Customer Login</h1>
            <p className="text-pink-100 text-[9px] font-bold uppercase mt-1 tracking-widest opacity-70">Souvnela Secure Access</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            
            {/* Tampilan Error dari Server (Read Validation Message) */}
            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-500 text-[10px] font-black uppercase tracking-tighter leading-tight">
                  {serverError}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Field Email */}
              <div className="space-y-1">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-500 transition-colors w-4 h-4" />
                  <input
                    {...register("email")}
                    placeholder="Email Address"
                    className="w-full bg-black/20 border-b border-gray-800 p-3 pl-10 text-gray-200 placeholder:text-gray-700 focus:border-pink-500 outline-none transition-all text-sm"
                  />
                </div>
                {errors.email && <p className="text-pink-500 text-[9px] font-bold uppercase italic ml-1">{errors.email.message}</p>}
              </div>

              {/* Field Password */}
              <div className="space-y-1">
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-500 transition-colors w-4 h-4" />
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Password"
                    className="w-full bg-black/20 border-b border-gray-800 p-3 pl-10 text-gray-200 placeholder:text-gray-700 focus:border-pink-500 outline-none transition-all text-sm"
                  />
                </div>
                {errors.password && <p className="text-pink-500 text-[9px] font-bold uppercase italic ml-1">{errors.password.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-black shadow-[0_10px_20px_rgba(236,72,153,0.2)] transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-[9px] text-gray-700 font-bold uppercase mt-8 tracking-[0.4em]">
          © 2026 Yahyu Handmade
        </p>
      </div>
    </div>
  );
}