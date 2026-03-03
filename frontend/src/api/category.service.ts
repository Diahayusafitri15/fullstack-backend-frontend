import axiosInstance from "./axios";

export interface Category {
  id: number;
  nama_kategori: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get("/categories");
  return response.data.data; // Sesuaikan dengan struktur respons backend kamu
};

export const createCategory = async (nama_kategori: string) => {
  const response = await axiosInstance.post("/categories", { nama_kategori });
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await axiosInstance.delete(`/categories/${id}`);
  return response.data;
};