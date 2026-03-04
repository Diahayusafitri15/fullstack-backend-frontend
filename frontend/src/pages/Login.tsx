import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginUser, LoginResponse } from "../api/auth.service";
import { setToken, setUserRole } from "../utils/storage";
import axios from "axios";
import { useState } from "react";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

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

  const onSubmit = async (data: LoginForm) => {
    setServerError(""); 
    console.log("1. Memulai proses login..."); // Cek di Console browser
    
    try {
      // Membersihkan storage sebelum mencoba login baru
      localStorage.clear();

      // Memanggil service yang menggunakan axiosInstance
      console.log("2. Mengirim request ke backend...");
      const response = await loginUser(data);

      // Jika password salah, backend (localhost:3000) harusnya kirim 401
      // Dan kode di bawah ini TIDAK AKAN pernah jalan jika statusnya bukan 2xx
      console.log("3. Respon sukses diterima:", response.data);

      if (response && response.data && response.data.token) {
        const { token, role }: LoginResponse = response.data;

        setToken(token);
        setUserRole(role);

        console.log("4. Berhasil simpan data, pindah halaman...");
        if (role === "ADMIN") {
          navigate("/admin/posts", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        setServerError("Token tidak valid dari server.");
      }

    } catch (error: unknown) {
      // BAGIAN PENTING: Menangkap error 401, 404, atau 500
      console.error("5. Login Gagal (Error ditangkap):", error);
      
      let message = "Email atau password salah!";
      
      if (axios.isAxiosError(error)) {
        console.log("Detail Error dari Server:", error.response?.data);
        message = error.response?.data?.message || message;
      }
      
      setServerError(message);
      // PENTING: Tidak ada perintah navigate di sini, jadi user tetap stay!
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[pink] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#ec4899 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}>
      </div>

      <div className="w-full max-w-sm relative z-10 px-4">
        <div className="bg-[#161B22]/95 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          
          {/* Header Pink Souvnela Style */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-center">
            <h1 className="text-white text-xl font-black uppercase tracking-[0.2em]">Customer Login</h1>
            <p className="text-pink-100 text-[9px] font-bold uppercase mt-1 tracking-widest opacity-70 italic">
              Souvnela Secure Access
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            
            {/* Alert Error jika Password Salah */}
            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-500 text-[10px] font-withe uppercase tracking-tighter leading-tight">
                  {serverError}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-500 transition-colors w-4 h-4" />
                  <input
                    {...register("email")}
                    placeholder="Email Address"
                    className="w-full bg-black/30 border-b border-gray-800 p-3 pl-10 text-gray-100 focus:border-pink-500 outline-none transition-all text-sm"
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
                    className="w-full bg-black/30 border-b border-gray-800 p-3 pl-10 text-gray-100 focus:border-pink-500 outline-none transition-all text-sm"
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
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}