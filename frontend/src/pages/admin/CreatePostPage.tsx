import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, CreatePostPayload } from "../../api/post.service";
import { getCategories } from "../../api/category.service";
import { useNavigate } from "react-router-dom";

type FormValues = {
  judul: string;
  isi: string;
  category_id: string;
  gambar: FileList;
};

export default function CreatePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset();
      alert("Post berhasil dibuat! ✨");
      navigate("/admin/posts");
    },
    onError: (error: any) => {
      alert("Gagal menyimpan: " + (error.response?.data?.message || error.message));
    }
  });

  const onSubmit = (data: FormValues) => {
    // Validasi manual untuk file jika diperlukan
    if (!data.gambar || data.gambar.length === 0) {
      return alert("Tolong pilih gambar terlebih dahulu!");
    }

    const payload: CreatePostPayload = {
      judul: data.judul,
      isi: data.isi,
      category_id: data.category_id, // Biarkan string dulu, atau sesuaikan dengan backend
      gambar: data.gambar[0],
    };

    mutation.mutate(payload);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-pink-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Post Baru</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Judul Produk</label>
          <input 
            {...register("judul", { required: "Judul wajib diisi" })} 
            placeholder="Masukkan judul souvenir..." 
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all" 
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Deskripsi</label>
          <textarea 
            {...register("isi", { required: "Isi wajib diisi" })} 
            placeholder="Detail produk..." 
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all min-h-[120px]" 
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Kategori</label>
          <select 
            {...register("category_id", { required: "Pilih kategori" })} 
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.nama_kategori}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Foto Souvenir</label>
          <input 
            type="file" 
            {...register("gambar", { required: "Foto wajib diunggah" })} 
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer" 
          />
        </div>

        <button 
          type="submit" 
          disabled={mutation.isPending}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
            mutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-100"
          }`}
        >
          {mutation.isPending ? "Menyimpan..." : "Simpan Postingan"}
        </button>
      </form>
    </div>
  );
}