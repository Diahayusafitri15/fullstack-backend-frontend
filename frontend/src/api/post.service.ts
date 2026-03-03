import axiosInstance from "./axios";
import { Category } from "../types/category"; // Import tipe Category dari rumahnya

/* ========================= */
/* TYPES (Pindahkan ke src/types/post.ts jika ingin lebih rapi) */
/* ========================= */

export interface Post {
  id: number;
  judul: string;
  isi: string;
  gambar: string; // Akan berisi "my-bucket/nama-file.webp"
  category_id: number;
  nama_kategori?: string; // Tambahkan opsional (?) agar tidak error jika join gagal
  created_at: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

// Interface ini penting untuk memastikan AdminDashboard mengirim data yang benar
export interface CreatePostPayload {
  judul: string;
  isi: string;
  category_id: string; // Gunakan string karena value dari <Select> biasanya string
  gambar: File | null;
}

/* ========================= */
/* API SERVICES */
/* ========================= */

// 1. Ambil Semua Kategori (Penting untuk dropdown di Admin Panel)
export const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get<ApiResponse<Category[]>>("/categories");
  return res.data.data || []; // Tambahkan fallback array kosong agar .map() tidak crash
};

// 2. Ambil Semua Postingan
export const getPosts = async (): Promise<Post[]> => {
  const res = await axiosInstance.get<ApiResponse<Post[]>>("/posts");
  return res.data.data || [];
};

// 3. Ambil Satu Postingan
export const getPostById = async (id: number): Promise<Post> => {
  const res = await axiosInstance.get<ApiResponse<Post>>(`/posts/${id}`);
  return res.data.data;
};

// 4. Buat Postingan Baru (Upload ke MinIO)
export const createPost = async (data: CreatePostPayload) => {
  const formData = new FormData();
  formData.append("judul", data.judul);
  formData.append("isi", data.isi);
  formData.append("category_id", data.category_id);
  
  if (data.gambar) {
    formData.append("gambar", data.gambar);
  }

  // Axios secara otomatis akan mengatur boundary jika menggunakan FormData
  return axiosInstance.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 5. Update Postingan
export const updatePost = async (id: number, data: Partial<CreatePostPayload>) => {
  const formData = new FormData();
  if (data.judul) formData.append("judul", data.judul);
  if (data.isi) formData.append("isi", data.isi);
  if (data.category_id) formData.append("category_id", data.category_id);
  if (data.gambar) formData.append("gambar", data.gambar);

  return axiosInstance.put(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 6. Hapus Postingan
export const deletePost = async (id: number) => {
  return axiosInstance.delete(`/posts/${id}`);
};