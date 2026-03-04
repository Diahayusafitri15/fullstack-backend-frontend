import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost, getCategories } from "../../api/post.service";

type FormValues = {
  judul: string;
  isi: string;
  category_id: number;
  gambar?: FileList;
};

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { data: post } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(String(id)),
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (post) {
      reset({
        judul: post.judul,
        isi: post.isi,
        category_id: post.category_id,
      });
    }
  }, [post, reset]);

  // --- PERBAIKAN: MENAMBAHKAN READ VALIDATION MESSAGE ---
  const mutation = useMutation({
    mutationFn: (data: any) => updatePost(String(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Kamu bisa tambahkan alert sukses jika perlu
      alert("Berhasil memperbarui souvenir!");
      navigate("/admin/posts");
    },
    onError: (error: any) => {
      // Mengambil pesan error spesifik dari backend (Validation Message)
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan saat mengupdate data.";
      
      // Menampilkan pesan validasi kepada user
      alert("Gagal Update: " + errorMsg);
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      judul: data.judul,
      isi: data.isi,
      category_id: String(data.category_id),
      gambar: data.gambar && data.gambar.length > 0 ? data.gambar[0] : null,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-50 mt-10 mb-20">
      <h1 className="text-2xl font-black text-gray-800 mb-8 border-l-4 border-pink-500 pl-4 uppercase italic tracking-tighter">
        Edit Souvenir
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Input Judul */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Judul Souvenir</label>
          <input 
            {...register("judul", { required: "Judul wajib diisi" })} 
            placeholder="Masukkan nama produk..."
            className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-pink-300 outline-none transition-all font-medium" 
          />
        </div>

        {/* Input Isi */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Deskripsi Produk</label>
          <textarea 
            {...register("isi", { required: "Isi wajib diisi" })} 
            rows={4} 
            placeholder="Jelaskan detail souvenir..."
            className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-pink-300 outline-none transition-all font-medium" 
          />
        </div>

        {/* Dropdown Kategori */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Pilih Kategori</label>
          <select 
            {...register("category_id")} 
            className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-pink-300 outline-none transition-all bg-white font-medium"
          >
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
            ))}
          </select>
        </div>

        {/* Input File Gambar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            Gambar Saat Ini: <span className="text-pink-400">{post?.gambar?.split('/').pop()}</span>
          </label>
          <div className="bg-pink-50/50 p-4 rounded-2xl border-2 border-dashed border-pink-100 group hover:border-pink-300 transition-all">
            <input 
              type="file" 
              {...register("gambar")} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-pink-500 file:text-white hover:file:bg-pink-600 transition-all cursor-pointer" 
            />
          </div>
          <p className="text-[10px] text-gray-400 italic px-1">*Kosongkan jika tidak ingin mengganti gambar</p>
        </div>

        {/* Tombol Submit */}
        <button 
          disabled={mutation.isPending} 
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-100 transition-all uppercase tracking-widest active:scale-95 disabled:bg-gray-200"
        >
          {mutation.isPending ? "Sedang Mengirim..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}