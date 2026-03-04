import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../api/post.service";

// Fungsi pembersih URL agar gambar muncul dari MinIO
const getImageUrl = (path: string) => {
  if (!path) return "https://via.placeholder.com/600x600?text=No+Image";
  // Menghapus tanda kutip yang mungkin terselip dari database
  return path.trim().replace(/"/g, "");
};

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mengambil satu data post berdasarkan ID dari URL
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id!),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
    </div>
  );

  if (isError || !post) return (
    <div className="p-20 text-center text-red-500 font-bold">
      Souvenir tidak ditemukan atau server error.
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Navigasi Kembali */}
      <nav className="p-6 max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-400 hover:text-pink-500 flex items-center gap-2 font-bold transition-all uppercase text-sm tracking-widest"
        >
          ← Kembali
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start py-10">
        {/* Area Gambar Produk */}
        <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-50 border border-gray-100">
          <img
            src={getImageUrl(post.gambar)}
            alt={post.judul}
            className="w-full h-full object-cover aspect-square"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/600x600?text=Image+Error";
            }}
          />
        </div>

        {/* Area Informasi Detail */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="text-pink-500 font-black tracking-[0.2em] uppercase text-xs">
              {post.nama_kategori || "Souvnela Collection"}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight uppercase italic tracking-tighter mt-2">
              {post.judul}
            </h1>
            <div className="w-16 h-1.5 bg-pink-500 mt-4 rounded-full"></div>
          </div>
          
          <div className="bg-pink-50/50 p-8 rounded-3xl border border-pink-100/50">
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line italic font-medium">
              {post.isi}
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100 text-[10px] text-gray-300 font-bold tracking-widest uppercase">
            Product ID: #{post.id} • Yahyu Handmade
          </div>
        </div>
      </main>
    </div>
  );
}