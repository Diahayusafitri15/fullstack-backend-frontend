import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.service";
import { setToken, setUserRole } from "../utils/storage";
import axios from "axios";
import { useState } from "react";
import { Mail, Lock, Loader2, AlertCircle, UserPlus, LogIn } from "lucide-react";

// ============================
// VALIDATION SCHEMA
// ============================
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

  // ============================
  // SUBMIT FORM
  // ============================
  const onSubmit = async (data: LoginForm) => {
    setServerError("");
    setSuccessMsg("");

    try {
      if (isLoginView) {
        // ============================
        // LOGIN
        // ============================

        const response = await loginUser(data);

        if (!response || !response.data) {
          throw new Error("Response server tidak valid");
        }

        const { token, role } = response.data;

        if (!token) {
          throw new Error("Token tidak ditemukan dari server");
        }

        // simpan token & role
        setToken(token);
        setUserRole(role);

        // simpan data user untuk navbar
        const userData = {
          email: data.email,
          role: role,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        // redirect berdasarkan role
        if (role === "ADMIN") {
          navigate("/admin/posts", { replace: true });
        } else {
          navigate("/", { replace: true });
        }

      } else {
        // ============================
        // REGISTER
        // ============================

        const response = await axios.post(
          "http://localhost:3000/users/register",
          {
            email: data.email,
            password: data.password,
          }
        );

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
      } else if (error instanceof Error) {
        message = error.message;
      }

      setServerError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-200 relative overflow-hidden font-sans">
      
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ff69b4 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="w-full max-w-sm relative z-10 px-4">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[40px] border border-white shadow-2xl overflow-hidden shadow-pink-300/50">

          {/* HEADER */}
          <div className="bg-pink-500 p-8 text-center">
            <h1 className="text-white text-2xl font-black uppercase tracking-[0.3em] italic">
              {isLoginView ? "Yahyu Handmade" : "JOIN US"}
            </h1>

            <p className="text-pink-100 text-[10px] font-bold uppercase mt-2 tracking-widest opacity-90">
              {isLoginView
                ? "Selamat Datang Kembali, Bestie! 🎀"
                : "Mulai Koleksi Souvenirmu 🌸"}
            </p>
          </div>

          {/* TAB SWITCH */}
          <div className="flex bg-pink-50/50">
            <button
              onClick={() => {
                setIsLoginView(true);
                setServerError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                isLoginView
                  ? "text-pink-600 bg-white rounded-t-[30px]"
                  : "text-pink-300"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setIsLoginView(false);
                setServerError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                !isLoginView
                  ? "text-pink-600 bg-white rounded-t-[30px]"
                  : "text-pink-300"
              }`}
            >
              Register
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">

            {/* ERROR MESSAGE */}
            {serverError && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-500 text-[10px] font-black uppercase tracking-tighter">
                  {serverError}
                </p>
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {successMsg && (
              <div className="bg-green-50 border border-green-100 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <p className="text-green-500 text-[10px] font-black uppercase tracking-tighter">
                  {successMsg}
                </p>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-4 h-4" />

                <input
                  {...register("email")}
                  placeholder="Email Address"
                  className="w-full bg-pink-50 border rounded-2xl p-4 pl-12 text-gray-700 focus:border-pink-400 outline-none text-sm font-bold"
                />
              </div>

              {errors.email && (
                <p className="text-pink-500 text-[9px] font-bold ml-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 w-4 h-4" />

                <input
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className="w-full bg-pink-50 border rounded-2xl p-4 pl-12 text-gray-700 focus:border-pink-400 outline-none text-sm font-bold"
                />
              </div>

              {errors.password && (
                <p className="text-pink-500 text-[9px] font-bold ml-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLoginView ? (
                <>
                  <LogIn className="w-4 h-4" /> Masuk
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Daftar
                </>
              )}
            </button>

            <p className="text-center text-[9px] text-pink-300 font-bold uppercase tracking-widest pt-2">
              © 2026 Yahyu Handmade
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}