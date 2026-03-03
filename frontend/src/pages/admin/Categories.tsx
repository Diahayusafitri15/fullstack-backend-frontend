import { useQuery } from "@tanstack/react-query";
import { getCategories, Category } from "../../api/category.service";

export default function Categories() {
  const { data: categories = [], isLoading, isError } =
    useQuery<Category[]>({
      queryKey: ["categories"],
      queryFn: getCategories,
    });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Terjadi kesalahan</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Daftar Kategori
      </h1>

      <div className="grid gap-4">
        {categories.length === 0 && (
          <p className="text-gray-500">
            Belum ada kategori
          </p>
        )}

        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-4 rounded-xl shadow"
          >
            {cat.nama_kategori}
          </div>
        ))}
      </div>
    </div>
  );
}