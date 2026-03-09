import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, deletePost } from "../../api/post.service";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Trash2, Edit3, Plus, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Posts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Fetching Data dengan Polling (Auto-update tiap 5 detik)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(1, 100),
    refetchInterval: 5000, 
  });

  const posts = data?.data || [];

  // --- LOGIKA NOTIFIKASI MERAH (+N) ---
  // Fungsi untuk cek apakah ada komentar baru yang belum dibaca
  const getNewBadgeCount = (postId: number, currentTotal: number) => {
    const savedCount = localStorage.getItem(`read_count_${postId}`);
    const lastRead = savedCount ? parseInt(savedCount) : currentTotal;

    if (currentTotal > lastRead) {
      return currentTotal - lastRead;
    }
    return 0;
  };

  // Fungsi untuk "membersihkan" notifikasi saat diklik
  const handleViewComments = (postId: number, currentTotal: number) => {
    localStorage.setItem(`read_count_${postId}`, currentTotal.toString());
    queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refresh tampilan
  };

  // 2. Mutation & Helper
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Postingan berhasil dihapus! 🗑️");
    },
  });

  const getImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
    return path.trim().replace(/"/g, "");
  };

  if (isLoading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-pink-500 w-12 h-12" /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 bg-white/50 p-6 rounded-[32px] backdrop-blur-sm border border-white/20">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Product List</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">SOUVNELA Admin Panel 🌸</p>
        </div>
        <button onClick={() => navigate("/admin/posts/create")} className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-3xl font-black transition-all shadow-xl shadow-pink-200">+ TAMBAH PRODUK</button>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => {
          const newComments = getNewBadgeCount(post.id, post.total_komentar || 0);

          return (
            <div key={post.id} className="bg-white rounded-[40px] shadow-sm border border-pink-50 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
              {/* IMAGE AREA */}
              <div className="relative h-64 w-full bg-gray-50">
                <img src={getImageUrl(post.gambar)} alt={post.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                
                {/* --- NOTIFIKASI BADGE --- */}
                <div className="absolute top-4 left-4">
                  <div 
                    className="relative cursor-pointer active:scale-90 transition-transform"
                    onClick={() => handleViewComments(post.id, post.total_komentar)}
                  >
                    {/* Badge Utama */}
                    <div className="bg-pink-500 text-white px-4 py-2 rounded-2xl shadow-lg border border-pink-400 flex items-center gap-2">
                      <MessageSquare size={14} className="fill-white" />
                      <span className="text-xs font-black">{post.total_komentar || 0}</span>
                    </div>

                    {/* --- BULATAN MERAH +1 --- */}
                    {newComments > 0 && (
                      <div className="absolute -top-2 -right-2 flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 border-2 border-white text-[10px] text-white font-black items-center justify-center">
                          +{newComments}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-pink-600 border border-white/50 uppercase">
                  {post.nama_kategori || "Souvenir"}
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="p-7 flex-1 flex flex-col">
                <h2 className="text-xl font-black text-gray-800 mb-2 italic uppercase tracking-tighter">{post.judul}</h2>
                <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">{post.isi}</p>

                {/* Indikator Bawah */}
                <div className="mb-6 flex items-center gap-2 text-pink-500 font-black text-[10px] uppercase bg-pink-50 w-fit px-3 py-1.5 rounded-xl border border-pink-100">
                   <MessageSquare size={12} className={newComments > 0 ? "animate-bounce" : ""} />
                   {post.total_komentar || 0} Diskusi Pengunjung
                </div>

                {/* BUTTONS */}
                <div className="flex gap-4 mt-auto pt-6 border-t border-pink-50">
                  <button 
                    onClick={() => {
                      handleViewComments(post.id, post.total_komentar);
                      navigate(`/admin/posts/${post.id}`);
                    }} 
                    className="flex-1 bg-gray-50 hover:bg-gray-800 text-gray-600 hover:text-white font-black py-4 rounded-[24px] transition-all text-xs border border-gray-100"
                  >
                    EDIT
                  </button>
                  <button onClick={() => deleteMutation.mutate(post.id)} className="flex-1 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white font-black py-4 rounded-[24px] transition-all text-xs border border-red-100">
                    HAPUS
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}