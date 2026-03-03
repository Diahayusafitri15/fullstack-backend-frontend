import axiosInstance from "./axios";

/* ============================= */
/* TYPES */
/* ============================= */

export type Category = {
  id: number;
  nama_kategori: string;
};

/* ============================= */
/* GET ALL CATEGORIES */
/* ============================= */
export const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get("/categories");
  return res.data.data; // langsung return array
};

/* ============================= */
/* CREATE CATEGORY */
/* ============================= */
export const createCategory = async (nama_kategori: string) => {
  const res = await axiosInstance.post("/categories", {
    nama_kategori,
  });
  return res.data;
};

/* ============================= */
/* DELETE CATEGORY */
/* ============================= */
export const deleteCategory = async (id: number) => {
  const res = await axiosInstance.delete(`/categories/${id}`);
  return res.data;
};