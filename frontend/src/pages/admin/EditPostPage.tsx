import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost, getCategories } from "../../api/post.service";
import { Package, DollarSign, Type, AlignLeft, Image as ImageIcon, Loader2, ArrowLeft, Save, Sparkles } from "lucide-react";

type FormValues = {
  judul: string;
  isi: string;
  harga: number;
  category_id: number;
  gambar?: FileList;
};

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  // Pantau perubahan input gambar untuk preview
  const selectedGambar = watch("gambar");
  useEffect(() => {
    if (selectedGambar && selectedGambar.length > 0) {
      const file = selectedGambar[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedGambar]);

  // 1. Ambil Data Postingan
  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(String(id)),
    enabled: !!id,
    staleTime: 0, 
  });

  // 2. Ambil Kategori
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // 3. Sinkronisasi Data Form
  useEffect(() => {
    if (post) {
      reset({
        judul: post.judul || "",
        isi: post.isi || "",
        harga: post.harga || 0,
        category_id: post.category_id || 1,
      });
    }
  }, [post, reset]);

  // 4. Fungsi Mutasi Update
  const mutation = useMutation({
    mutationFn: (formData: FormData) => updatePost(String(id), formData),
    onSuccess: () => {
      // Bersihkan cache agar data terbaru muncul di semua halaman
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      
      alert("Hore! Souvenir SOUVNELA berhasil diperbarui ✨");
      
      setTimeout(() => {
        navigate("/admin/posts");
      }, 100);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Gagal memperbarui data.";
      alert("Error: " + errorMsg);
    },
  });

  // 5. Handle Submit (DIPERBAIKI)
  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    
    // Append data teks
    formData.append("judul", data.judul);
    formData.append("isi", data.isi);
    formData.append("harga", String(data.harga));
    formData.append("category_id", String(data.category_id));

    // Append file gambar hanya jika user memilih file baru
    if (data.gambar && data.gambar.length > 0) {
      formData.append("gambar", data.gambar[0]);
      console.log("File gambar baru ditemukan:", data.gambar[0].name);
    } else {
      console.log("Tidak ada gambar baru, menggunakan gambar lama.");
    }

    // DEBUG: Cek isi FormData sebelum dikirim ke API
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    mutation.mutate(formData);
  };

  // Helper URL Gambar
  const getCleanImageUrl = (path: string) => {
    if (!path) return "";
    const cleanPath = path.trim().replace(/"/g, "");
    return `${cleanPath}${cleanPath.includes('?') ? '&' : '?'}t=${new Date().getTime()}`;
  };

  if (isLoadingPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-pink-500 bg-white">
        <Loader2 className="animate-spin mb-4" size={50} />
        <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Menghubungkan SOUVNELA...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 mb-20">
      <button 
        onClick={() => navigate("/admin/posts")}
        className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-all mb-8 font-black text-[10px] uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Kembali ke Dashboard
      </button>

      <div className="bg-white rounded-[50px] shadow-2xl shadow-pink-100/50 border border-pink-50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          
          {/* PREVIEW GAMBAR */}
          <div className="lg:col-span-2 bg-pink-50/30 p-8 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-pink-50">
            <div className="text-center mb-6">
              <Sparkles className="text-pink-400 mx-auto mb-2" size={20} />
              <h2 className="font-black text-gray-800 text-sm uppercase tracking-tighter">Tampilan Produk</h2>
            </div>
            
            <div className="w-full aspect-square bg-white rounded-[40px] shadow-inner flex items-center justify-center overflow-hidden border-4 border-white relative group">
              {preview ? (
                <img src={preview} alt="Preview Baru" className="w-full h-full object-cover" />
              ) : post?.gambar ? (
                <img 
                  src={getCleanImageUrl(post.gambar)} 
                  alt="Current" 
                  className="w-full h-full object-cover" 
                  onError={(e: any) => { e.target.src = "https://via.placeholder.com/400x300?text=Gagal+Memuat" }}
                />
              ) : (
                <ImageIcon size={48} className="text-gray-200" />
              )}
            </div>
            <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest italic text-center">
              {preview ? "Preview Gambar Baru ✨" : "Gambar Saat Ini 📸"}
            </p>
          </div>

          {/* FORM INPUT */}
          <div className="lg:col-span-3 p-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-pink-500 text-white rounded-2xl shadow-lg shadow-pink-200">
                <Package size={24} />
              </div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">Edit Detail Souvenir</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Judul */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Souvenir</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input
                    {...register("judul", { required: "Judul tidak boleh kosong" })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-500/20 focus:bg-white p-4 pl-12 rounded-2xl outline-none transition-all font-medium text-gray-700 shadow-sm"
                  />
                </div>
              </div>

              {/* Harga & Kategori */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Harga (Rp)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="number"
                      {...register("harga", { required: "Harga wajib diisi", valueAsNumber: true })}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-500/20 focus:bg-white p-4 pl-12 rounded-2xl outline-none transition-all font-medium text-gray-700 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kategori</label>
                  <select
                    {...register("category_id", { valueAsNumber: true })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-500/20 focus:bg-white p-4 rounded-2xl outline-none cursor-pointer font-medium text-gray-700 shadow-sm appearance-none"
                  >
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deskripsi Produk</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-5 text-gray-300" size={18} />
                  <textarea
                    {...register("isi", { required: "Deskripsi wajib diisi" })}
                    rows={4}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-500/20 focus:bg-white p-4 pl-12 rounded-2xl outline-none transition-all font-medium text-gray-700 shadow-sm resize-none"
                  />
                </div>
              </div>

              {/* Input File */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ganti File Gambar (Opsional)</label>
                <div className="border-2 border-dashed border-pink-100 p-6 rounded-[30px] bg-pink-50/20 flex flex-col items-center justify-center hover:border-pink-300 transition-all cursor-pointer relative group">
                  <ImageIcon className="text-pink-300 mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest text-center truncate px-4 w-full">
                    {selectedGambar && selectedGambar.length > 0 ? selectedGambar[0].name : "Klik untuk pilih file baru"}
                  </span>
                  <input
                    type="file"
                    {...register("gambar")}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 text-white py-6 rounded-[25px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-pink-100 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <><Save size={18} /> Simpan Perubahan ✨</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}