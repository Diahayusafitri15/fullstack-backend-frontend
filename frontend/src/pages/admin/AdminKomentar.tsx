import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, MessageSquare, Loader2, Star, RefreshCw, Eye, CheckCircle2 } from 'lucide-react';

export default function AdminKomentar() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const [readComments, setReadComments] = useState<number[]>([]);

  // 1. Load data komentar yang sudah dibaca dari LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('mancegine_read_comments');
    if (saved) setReadComments(JSON.parse(saved));
  }, []);

  // 2. Ambil SEMUA komentar
  const { data: comments, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/posts/comments/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    },
    enabled: !!token,
  });

  // 3. Logika Menandai Pesan Terbaca (Validation Message)
  const markAsRead = (id: number) => {
    if (!readComments.includes(id)) {
      const updated = [...readComments, id];
      setReadComments(updated);
      localStorage.setItem('mancegine_read_comments', JSON.stringify(updated));
    }
  };

  // 4. Mutasi untuk Hapus Komentar
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`http://localhost:3000/posts/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      alert("Komentar Mancegine berhasil dimoderasi! ✨");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Gagal menghapus komentar");
    }
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-pink-500 w-12 h-12" />
        <p className="text-pink-600 font-black uppercase text-[10px] tracking-widest animate-pulse">Sinkronisasi Komentar...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center h-screen bg-white p-4">
      <div className="bg-red-50 p-10 rounded-[40px] text-center border border-red-100 max-w-md">
        <p className="text-red-500 font-black uppercase text-xs tracking-widest mb-6">Koneksi Server Terputus ❌</p>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-3 mx-auto px-8 py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase text-[10px]"
        >
          <RefreshCw size={16} /> Reconnect
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-800 flex items-center gap-4 uppercase italic tracking-tighter">
              <div className="bg-pink-500 p-3 rounded-2xl shadow-lg shadow-pink-100">
                <MessageSquare className="text-white" size={28} />
              </div> 
              Feedback Center
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3 ml-1">MANCEGINE MODERATION SYSTEM v.1.0 🌸</p>
          </div>
          <div className="bg-pink-50 border border-pink-100 px-6 py-3 rounded-2xl text-pink-600 font-black text-xs uppercase tracking-widest">
            Inbox: {comments?.length || 0} Komentar
          </div>
        </header>

        <div className="bg-white rounded-[45px] border border-gray-100 shadow-2xl shadow-pink-100/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Pengirim</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Validasi & Pesan</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Rating</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {comments?.map((item: any) => {
                  const isRead = readComments.includes(item.id);
                  
                  return (
                    <tr key={item.id} className="hover:bg-pink-50/20 transition-all group">
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                           {!isRead && <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-lg shadow-pink-300"></div>}
                           <div>
                              <span className="block text-sm font-black text-gray-800 group-hover:text-pink-600 transition-colors uppercase">
                                {item.email.split('@')[0]}
                              </span>
                              <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 block tracking-widest">
                                {item.email}
                              </span>
                           </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className={`relative p-6 rounded-3xl border transition-all duration-500 ${isRead ? 'bg-white border-gray-100' : 'bg-pink-50/40 border-pink-100'}`}>
                          {!isRead && (
                            <span className="absolute -top-3 -right-3 bg-pink-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white uppercase tracking-widest">
                              BARU
                            </span>
                          )}
                          <p className="text-sm text-gray-600 italic leading-relaxed font-medium">
                            "{item.comment}"
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">
                               📅 {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                            </span>
                            <button 
                              onClick={() => markAsRead(item.id)}
                              className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${isRead ? 'text-green-500' : 'text-pink-400 hover:text-pink-600'}`}
                            >
                              {isRead ? <CheckCircle2 size={12} /> : <Eye size={12} />}
                              {isRead ? 'Sudah Divalidasi' : 'Tandai Dibaca'}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-100 fill-gray-100'}`} 
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <button 
                          onClick={() => {
                            if(window.confirm("Hapus ulasan ini?")) {
                              deleteMutation.mutate(item.id);
                            }
                          }}
                          className="p-5 bg-white text-red-500 rounded-[20px] hover:bg-red-500 hover:text-white transition-all border border-red-50 shadow-sm hover:shadow-red-200 active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}