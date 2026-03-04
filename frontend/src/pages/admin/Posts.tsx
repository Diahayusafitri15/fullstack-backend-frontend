import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, deletePost, Post } from "../../api/post.service";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Fetching Data
  const { data: posts = [], isLoading, isError } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  // 2. Mutation untuk Hapus Post
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Postingan berhasil dihapus! 🗑️");
    },
    onError: (error: any) => {
      alert("Gagal menghapus: " + (error.response?.data?.message || error.message));
    }
  });

  // 3. Helper URL Gambar dengan Sanitasi Karakter
  const getImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
    
    /** * PERBAIKAN: Menghapus tanda kutip (") atau spasi di ujung URL 
     * agar MinIO tidak error "syntax is incorrect" di Windows.
     */
    return path.trim().replace(/"/g, "");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Yakin ingin hapus post ini?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500 animate-pulse font-medium">Memuat daftar souvenir...</p>
    </div>
  );

  if (isError) return (
    <div className="bg-red-50 text-red-500 p-6 rounded-2xl text-center">
      Gagal mengambil data. Pastikan Backend & MinIO sudah aktif.
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">PRODUCT LIST</h1>
        <button
          onClick={() => navigate("/admin/posts/create")}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-pink-100"
        >
          + Tambah Produk
        </button>
      </div>

      {/* GRID LIST SECTION */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400">Belum ada produk yang tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
            >
              {/* IMAGE AREA */}
              <div className="relative h-48 w-full bg-gray-100">
                <img
                  src={getImageUrl(post.gambar)}
                  alt={post.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback jika URL MinIO bermasalah
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Error";
                  }}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-pink-600 shadow-sm uppercase">
                  {post.nama_kategori || "Souvenir"}
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{post.judul}</h2>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                  {post.isi}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                  <button
                    onClick={() => navigate(`/admin/posts/${post.id}`)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded-xl transition-colors text-xs"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white font-bold py-2 rounded-xl transition-all text-xs"
                  >
                    {deleteMutation.isPending ? "..." : "HAPUS"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}