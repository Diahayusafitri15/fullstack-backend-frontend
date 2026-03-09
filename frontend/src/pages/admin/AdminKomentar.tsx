import React from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, MessageSquare, Loader2, Star, RefreshCw } from 'lucide-react';

export default function AdminKomentar() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  // 1. Ambil SEMUA komentar
  const { data: comments, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: async () => {
      // Perbaikan: Hapus '/api' jika backend kamu langsung menggunakan http://localhost:3000/posts
      const res = await axios.get('http://localhost:3000/posts/comments/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Berdasarkan user_controller.js, data ada di dalam res.data.data
      return res.data.data;
    },
    enabled: !!token, // Hanya jalankan jika token ada
  });

  // 2. Mutasi untuk Hapus Komentar
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`http://localhost:3000/posts/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      alert("Komentar berhasil dimoderasi! ✨");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Gagal menghapus komentar");
    }
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-pink-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-pink-500 w-12 h-12" />
        <p className="text-pink-600 font-medium animate-pulse">Memuat data komentar...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center h-screen bg-pink-50 p-4">
      <div className="bg-white p-8 rounded-[32px] shadow-xl text-center border border-pink-100">
        <p className="text-red-500 font-bold mb-4">Gagal mengambil data dari server ❌</p>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 mx-auto px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all"
        >
          <RefreshCw size={18} /> Coba Lagi
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3 uppercase italic tracking-tighter">
              <MessageSquare className="text-pink-500" size={32} /> Manajemen Komentar
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">Moderasi jejak digital pengunjung SOUVNELA 🌸</p>
          </div>
          <div className="bg-pink-100 px-4 py-2 rounded-2xl text-pink-600 font-bold text-sm">
            Total: {comments?.length || 0} Komentar
          </div>
        </header>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 backdrop-blur-md">
                <tr>
                  <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Pengirim</th>
                  <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Isi Komentar</th>
                  <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Rating</th>
                  <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {comments?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-pink-50/30 transition-all group">
                    <td className="p-6">
                      <span className="block text-sm font-black text-gray-700 group-hover:text-pink-600 transition-colors">
                        {item.email}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 block">
                        📅 {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:bg-white transition-all">
                        <p className="text-sm text-gray-600 italic leading-relaxed font-medium">
                          "{item.comment}"
                        </p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => {
                          if(window.confirm("Hapus komentar ini secara permanen? Tindakan ini tidak bisa dibatalkan.")) {
                            deleteMutation.mutate(item.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-4 bg-red-50 text-red-500 rounded-3xl hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-200 hover:-translate-y-1 active:scale-90 disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {comments?.length === 0 && (
            <div className="text-center py-32 bg-gray-50/50">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                <MessageSquare className="text-gray-200" size={32} />
              </div>
              <p className="text-gray-400 font-bold italic">Belum ada komentar yang masuk 🍃</p>
              <p className="text-gray-300 text-xs mt-1 uppercase tracking-widest">Database SOUVNELA Kosong</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}