import axiosInstance from "./axios";
import { Category } from "../types/category";

// 1. Interface Dasar
export interface Post {
  id: number;
  judul: string;
  isi: string;
  harga: number;
  gambar: string;
  category_id: number;
  nama_kategori?: string;
  created_at: string;
}

export interface PaginatedPostResponse {
  status: string;
  message: string;
  data: Post[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface CreatePostPayload {
  judul: string;
  isi: string;
  harga: number;
  category_id: string | number;
  gambar: File | FileList | null;
}

// 2. Helper untuk konversi Object ke FormData (Menghindari pengulangan kode)
const buildFormData = (data: Partial<CreatePostPayload>): FormData => {
  const formData = new FormData();
  
  if (data.judul) formData.append("judul", data.judul);
  if (data.isi) formData.append("isi", data.isi);
  if (data.harga !== undefined) formData.append("harga", String(data.harga));
  if (data.category_id) formData.append("category_id", String(data.category_id));

  if (data.gambar) {
    if (data.gambar instanceof FileList && data.gambar.length > 0) {
      formData.append("gambar", data.gambar[0]);
    } else if (data.gambar instanceof File) {
      formData.append("gambar", data.gambar);
    }
  }
  
  return formData;
};

/**
 * ==========================================
 * SERVICE FUNCTIONS
 * ==========================================
 */

// Ambil Semua Kategori
export const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get<ApiResponse<Category[]>>("/categories");
  return res.data.data || [];
};

// Ambil Semua Postingan (Pagination & Search)
export const getPosts = async (page = 1, limit = 8, search = ""): Promise<PaginatedPostResponse> => {
  const res = await axiosInstance.get<PaginatedPostResponse>(`/posts`, {
    params: { page, limit, search } 
  });
  return res.data; 
};

// Ambil Satu Postingan Berdasarkan ID
export const getPostById = async (id: string | number): Promise<Post> => {
  const res = await axiosInstance.get<ApiResponse<Post>>(`/posts/${id}`);
  return res.data.data;
};

// Buat Postingan Baru
export const createPost = async (data: CreatePostPayload) => {
  const formData = buildFormData(data);

  return axiosInstance.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update Postingan
 * Mendukung pengiriman langsung dalam bentuk FormData (dari Page)
 * atau dalam bentuk Object (Payload)
 */
export const updatePost = async (id: string | number, data: FormData | Partial<CreatePostPayload>) => {
  // Jika data yang dikirim sudah FormData, langsung kirim
  const payload = data instanceof FormData ? data : buildFormData(data);

  return axiosInstance.put(`/posts/${id}`, payload, {
    headers: { 
      "Content-Type": "multipart/form-data" 
    },
  });
};

// Hapus Postingan
export const deletePost = async (id: number) => {
  return axiosInstance.delete(`/posts/${id}`);
}; 