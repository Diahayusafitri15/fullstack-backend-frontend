import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, deletePost } from "../../api/post.service";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Loader2, ChevronLeft, ChevronRight, Sparkles, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";

export default function Posts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // --- STATE PAGINATION ---
  const [page, setPage] = useState(1);
  const limit = 6; 

  // 1. Fetching Data dengan Polling & Cache yang lebih ketat
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts", page], 
    queryFn: () => getPosts(page, limit),
    refetchInterval: 3000, // Dipercepat ke 3 detik agar sinkronisasi lebih kilat
    staleTime: 0, // Memastikan data dianggap basi seketika
  });

  const posts = data?.data || [];
  const totalData = data?.total_items || 0; // Sesuaikan dengan key dari backend (total_items)
  const totalPages = Math.ceil(totalData / limit);

  // --- LOGIKA NOTIFIKASI KOMENTAR ---
  const getNewBadgeCount = (postId: number, currentTotal: number) => {
    const savedCount = localStorage.getItem(`read_count_${postId}`);
    const lastRead = savedCount ? parseInt(savedCount) : currentTotal;
    return currentTotal > lastRead ? currentTotal - lastRead : 0;
  };

  const handleViewComments = (postId: number, currentTotal: number) => {
    localStorage.setItem(`read_count_${postId}`, currentTotal.toString());
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  // 2. Mutation Delete dengan Invalidate Global
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // Hapus SEMUA cache posts agar tidak ada sisa data lama di halaman manapun
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.removeQueries({ queryKey: ["posts"] }); 
      alert("Produk percetakan berhasil dihapus! 🗑️");
    },
  });

  // --- PERBAIKAN LOGIKA GAMBAR SINKRON ---
  const getImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
    
    let finalUrl = "";
    if (path.startsWith('http')) {
      finalUrl = path.trim().replace(/"/g, "");
    } else {
      finalUrl = `http://localhost:3000/uploads/${path.trim().replace(/"/g, "")}`;
    }

    // TAMBAHKAN TIMESTAMP: Memaksa browser mengunduh ulang gambar jika ada perubahan (anti-cache browser)
    return `${finalUrl}?t=${new Date().getTime()}`;
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-pink-500 w-12 h-12" />
      <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Memuat Data Mancegine...</p>
    </div>
  );

  if (isError) return (
    <div className="text-center py-20">
      <p className="text-red-500 font-bold">Gagal memuat data. Pastikan Server Backend menyala! ⚡</p>
      <button onClick={() => refetch()} className="mt-4 text-xs font-bold text-pink-500 underline">COBA LAGI</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 gap-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800 flex items-center gap-3">
            <Sparkles className="text-pink-500" /> Daftar Produk
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
            MANCEGINE PRINTING MANAGEMENT v.1.0
          </p>
        </div>
        <button 
          onClick={() => navigate("/admin/posts/create")} 
          className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-5 rounded-[24px] font-black transition-all shadow-xl shadow-pink-100 uppercase text-xs tracking-widest active:scale-95 flex items-center gap-2"
        >
          <span>+ Tambah Layanan Cetak</span>
        </button>
      </div>

      {/* GRID LIST */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold italic">Belum ada produk. Klik tombol di atas untuk menambah! ✨</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => {
            const newComments = getNewBadgeCount(post.id, post.total_komentar || 0);

            return (
              <div key={post.id} className="bg-white rounded-[45px] shadow-sm border border-gray-50 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500">
                {/* IMAGE AREA */}
                <div className="relative h-72 w-full bg-gray-50 overflow-hidden">
                  <img 
                    src={getImageUrl(post.gambar)} 
                    alt={post.judul} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Error+Loading+Image" }}
                  />
                  
                  <div className="absolute top-6 left-6">
                    <div 
                      className="relative cursor-pointer active:scale-90 transition-transform"
                      onClick={() => {
                        handleViewComments(post.id, post.total_komentar);
                        navigate("/admin/comments");
                      }}
                    >
                      <div className="bg-white/90 backdrop-blur-md text-gray-800 px-4 py-2 rounded-2xl shadow-sm border border-white flex items-center gap-2">
                        <MessageSquare size={14} className="text-pink-500 fill-pink-50" />
                        <span className="text-xs font-black">{post.total_komentar || 0}</span>
                      </div>

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

                  <div className="absolute top-6 right-6 bg-pink-600 px-4 py-2 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                    {post.nama_kategori || "Umum"}
                  </div>
                </div>

                {/* CONTENT AREA */}
                <div className="p-8 flex-1 flex flex-col">
                  <h2 className="text-xl font-black text-gray-800 mb-3 italic uppercase tracking-tighter leading-tight">{post.judul}</h2>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-8 flex-1 font-medium leading-relaxed">{post.isi}</p>
                  
                  <div className="text-pink-500 font-black text-lg mb-4">
                    Rp {post.harga?.toLocaleString('id-ID')}
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-gray-50">
                    <button 
                      onClick={() => navigate(`/admin/posts/edit/${post.id}`)} 
                      className="flex-1 bg-gray-900 hover:bg-pink-600 text-white font-black py-4 rounded-[20px] transition-all text-[10px] tracking-widest uppercase shadow-md shadow-gray-200 flex items-center justify-center gap-2"
                    >
                      <Edit3 size={14} /> Edit Detail
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm("Hapus produk ini? 🥺")) deleteMutation.mutate(post.id)
                      }} 
                      className="px-6 bg-white hover:bg-red-50 text-red-500 font-black py-4 rounded-[20px] transition-all text-[10px] tracking-widest uppercase border border-red-50 flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-4">
          <button 
            disabled={page === 1}
            onClick={() => { setPage(p => p - 1); window.scrollTo(0,0); }}
            className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-pink-500 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i + 1); window.scrollTo(0,0); }}
                className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${
                  page === i + 1 
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' 
                  : 'bg-white text-gray-400 hover:bg-pink-50 hover:text-pink-500 border border-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={page === totalPages}
            onClick={() => { setPage(p => p + 1); window.scrollTo(0,0); }}
            className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-pink-500 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}