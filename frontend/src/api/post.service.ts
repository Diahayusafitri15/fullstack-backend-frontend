import axiosInstance from "./axios";

/* ========================= */
/* TYPES */
/* ========================= */

export interface Post {
  id: number;
  judul: string;
  isi: string;
  gambar: string;
  category_id: number;
  nama_kategori: string;
  created_at: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface CreatePostPayload {
  judul: string;
  isi: string;
  category_id: number;
  gambar: File;
}

/* ========================= */
/* GET ALL POSTS */
/* ========================= */

export const getPosts = async (): Promise<Post[]> => {
  const res = await axiosInstance.get<ApiResponse<Post[]>>("/posts");
  return res.data.data;
};

/* ========================= */
/* GET POST BY ID */
/* ========================= */

export const getPostById = async (id: number): Promise<Post> => {
  const res = await axiosInstance.get<ApiResponse<Post>>(`/posts/${id}`);
  return res.data.data;
};

/* ========================= */
/* CREATE POST */
/* ========================= */

export const createPost = async (data: CreatePostPayload) => {
  const formData = new FormData();
  formData.append("judul", data.judul);
  formData.append("isi", data.isi);
  formData.append("category_id", String(data.category_id));
  formData.append("gambar", data.gambar);

  return axiosInstance.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ========================= */
/* UPDATE POST */
/* ========================= */

export const updatePost = async (id: number, formData: FormData) => {
  return axiosInstance.put(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ========================= */
/* DELETE POST */
/* ========================= */

export const deletePost = async (id: number) => {
  return axiosInstance.delete(`/posts/${id}`);
};