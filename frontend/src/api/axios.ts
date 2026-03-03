import axios from "axios";
import { getToken } from "../utils/storage";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      // Pastikan headers ada
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;