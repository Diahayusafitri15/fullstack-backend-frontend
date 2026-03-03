import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, deleteCategory, Category } from "../../api/category.service";
import { useForm } from "react-hook-form";

type CategoryForm = {
  nama_kategori: string;
};

export default function Categories() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<CategoryForm>();

  // 1. Ambil data kategori
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // 2. Mutation Tambah Kategori
  const addMutation = useMutation({
    mutationFn: (data: CategoryForm) => createCategory(data.nama_kategori),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      reset();
      alert("Kategori berhasil ditambah! ✨");
    },
  });

  // 3. Mutation Hapus Kategori
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const onSubmit = (data: CategoryForm) => {
    addMutation.mutate(data);
  };

  if (isLoading) return <p className="p-10 text-center">Loading kategori...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Kelola Kategori</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* FORM TAMBAH */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="font-bold mb-4">Tambah Kategori Baru</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("nama_kategori", { required: true })}
              placeholder="Nama Kategori (ex: Makanan)"
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-all"
            >
              {addMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </div>

        {/* TABEL DAFTAR KATEGORI */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-600">ID</th>
                <th className="p-4 font-bold text-gray-600">Nama Kategori</th>
                <th className="p-4 font-bold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400">#{cat.id}</td>
                  <td className="p-4 font-medium text-gray-800">{cat.nama_kategori}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm("Hapus kategori ini? Semua post dengan kategori ini mungkin akan terpengaruh.")) {
                          deleteMutation.mutate(cat.id);
                        }
                      }}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}