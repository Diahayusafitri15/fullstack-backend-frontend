import axiosInstance from "./axios";
import { Category } from "../types/category";

export interface Post {
  id: number;
  judul: string;
  isi: string;
  gambar: string;
  category_id: number;
  nama_kategori?: string;
  created_at: string;
}

// Tambahkan interface khusus untuk Response Pagination agar tidak error di component
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
  category_id: string;
  gambar: File | null;
}

// 1. Ambil Semua Kategori
export const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get<ApiResponse<Category[]>>("/categories");
  return res.data.data || [];
};

// 2. Ambil Semua Postingan (Disesuaikan untuk Pagination)
// Kita beri nilai default page=1 dan limit=8
export const getPosts = async (page = 1, limit = 8): Promise<PaginatedPostResponse> => {
  const res = await axiosInstance.get<PaginatedPostResponse>(`/posts`, {
    params: { page, limit } // Axios akan otomatis mengubah ini jadi /posts?page=1&limit=8
  });
  return res.data; 
};

// 3. Ambil Satu Postingan Berdasarkan ID
export const getPostById = async (id: string | number): Promise<Post> => {
  const res = await axiosInstance.get<ApiResponse<Post>>(`/posts/${id}`);
  return res.data.data;
};

// 4. Buat Postingan Baru
export const createPost = async (data: CreatePostPayload) => {
  const formData = new FormData();
  formData.append("judul", data.judul);
  formData.append("isi", data.isi);
  formData.append("category_id", data.category_id);
  if (data.gambar) formData.append("gambar", data.gambar);

  return axiosInstance.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 5. Update Postingan
export const updatePost = async (id: string | number, data: Partial<CreatePostPayload>) => {
  const formData = new FormData();
  if (data.judul) formData.append("judul", data.judul);
  if (data.isi) formData.append("isi", data.isi);
  if (data.category_id) formData.append("category_id", String(data.category_id));
  
  if (data.gambar instanceof File) {
    formData.append("gambar", data.gambar);
  }

  return axiosInstance.put(`/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 6. Hapus Postingan
export const deletePost = async (id: number) => {
  return axiosInstance.delete(`/posts/${id}`);
};