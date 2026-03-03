import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginUser, LoginResponse } from "../api/auth.service";
import { setToken, setUserRole } from "../utils/storage";
import axios from "axios";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginUser(data);

      // Karena sudah typed LoginResponse, ini aman
      const { token, role }: LoginResponse = response.data;

      // Simpan ke localStorage
      setToken(token);
      setUserRole(role);

      // Redirect berdasarkan role
      if (role === "ADMIN") {
        navigate("/admin/posts", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }

      alert("Login gagal. Email atau password salah.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {/* Email */}
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}