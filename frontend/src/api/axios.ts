import axios, { InternalAxiosRequestConfig } from "axios";
import { getToken } from "../utils/storage";

const axiosInstance = axios.create({
  // PERBAIKAN: Tambahkan /api agar sinkron dengan route backend kamu
  baseURL: "http://localhost:3000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// REQUEST INTERCEPTOR
// ============================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      // Pastikan format header 'Authorization' sudah benar
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================
// RESPONSE INTERCEPTOR (TAMBAHAN)
// ============================
// Sangat disarankan menambah ini untuk memudahkan debug jika ada error 400/401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Log detail error dari backend (sangat membantu cek kenapa Error 400)
      console.error("Backend Error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;