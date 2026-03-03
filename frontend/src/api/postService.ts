import axiosInstance from './axiosInstance';

// --- INTERFACES (Digabung di sini agar tidak error import) ---
export interface Category {
  id: number;
  nama_kategori: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface Post {
  id: number;
  judul: string;
  isi: string;
  gambar: string | null;
  category_id: number;
  nama_kategori?: string; 
}

// --- SERVICES ---

// 1. Ambil Semua Kategori
export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<ApiResponse<Category[]>>('/categories');
  return response.data.data || [];
};

// 2. Ambil Semua Post
export const getPosts = async (): Promise<Post[]> => {
  const response = await axiosInstance.get<ApiResponse<Post[]>>('/posts');
  return response.data.data || [];
};

// 3. Buat Post Baru
export const createPost = async (formData: FormData): Promise<ApiResponse<Post>> => {
  const response = await axiosInstance.post<ApiResponse<Post>>('/posts', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data' 
    },
  });
  return response.data;
};