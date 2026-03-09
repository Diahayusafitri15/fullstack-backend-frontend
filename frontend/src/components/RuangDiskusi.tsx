import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Star, MessageSquare, Loader2, Trash2 } from 'lucide-react'; // Tambah Trash2

export default function RuangDiskusi({ postId }: { postId: string | undefined }) {
  const [isiKomentar, setIsiKomentar] = useState('');
  const [listKomentar, setListKomentar] = useState<any[]>([]);
  const [rating, setRating] = useState(5); 
  const [isSending, setIsSending] = useState(false);
  
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail') || "Tamu"; 

  // Ambil data komentar
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/posts/${postId}/comments`);
      setListKomentar(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil komentar", err);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  // Fungsi Kirim Komentar
  const handleKirim = async () => {
    if (!token) return alert("Silakan login terlebih dahulu ya! 🌸");
    if (!isiKomentar.trim()) return alert("Tulis komentar dulu yuk! ✨");

    setIsSending(true);
    try {
      await axios.post('http://localhost:3000/posts/comments', 
        { 
          postId: Number(postId), 
          comment: isiKomentar, 
          rating: rating 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsiKomentar('');
      setRating(5);
      fetchComments(); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Cek koneksi server ya!";
      alert("Gagal mengirim komentar: " + errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  // --- FUNGSI HAPUS KOMENTAR (BARU) ---
  const handleHapus = async (commentId: number) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini? 🥺")) return;

    try {
      await axios.delete(`http://localhost:3000/posts/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Komentar berhasil dihapus! ✨");
      fetchComments(); // Refresh daftar setelah hapus
    } catch (err: any) {
      const pesanError = err.response?.data?.message || "Gagal menghapus komentar";
      alert(pesanError);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100">
        <h3 className="flex items-center gap-3 font-black text-gray-800 uppercase tracking-tighter text-xl mb-6 italic">
          <MessageSquare className="text-orange-500 w-6 h-6" /> 
          Ruang Diskusi ({listKomentar.length})
        </h3>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
            Tinggalkan Jejakmu di Sini 👇
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              type="text" 
              disabled 
              value={userEmail} 
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-bold text-pink-500 italic outline-none cursor-not-allowed"
            />
            
            <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <span className="text-[10px] font-black text-gray-400 uppercase mr-2">Rating:</span>
               {[1, 2, 3, 4, 5].map((star) => (
                 <Star 
                   key={star}
                   onClick={() => setRating(star)}
                   className={`w-5 h-5 cursor-pointer transition-all ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                 />
               ))}
            </div>
          </div>

          <textarea 
            value={isiKomentar}
            onChange={(e) => setIsiKomentar(e.target.value)}
            placeholder="Tulis pendapat atau pertanyaanmu di sini..."
            className="w-full p-4 h-32 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-200 outline-none text-sm transition-all"
          />

          <div className="flex justify-end mt-4">
            <button 
              onClick={handleKirim}
              disabled={isSending}
              className="bg-[#d35400] text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-orange-700 transition-all font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>Sedang Mengirim <Loader2 className="w-4 h-4 animate-spin" /></>
              ) : (
                <>Kirim Komentar <Send className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* List Komentar */}
        <div className="mt-10 space-y-4">
          {listKomentar.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
               <p className="text-gray-300 text-sm italic font-medium">Belum ada komentar. Jadilah yang pertama! 🌟</p>
            </div>
          ) : (
            listKomentar.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm flex flex-col space-y-3 transition-hover hover:border-pink-100">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-none">
                      {item.email}
                    </span>
                    <span className="text-[8px] text-gray-300 font-bold mt-1">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* TOMBOL HAPUS: Muncul jika email user login sama dengan email di komentar */}
                    {userEmail === item.email && (
                      <button 
                        onClick={() => handleHapus(item.id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        title="Hapus Komentar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed border-l-4 border-pink-50 pl-4 py-1">
                  "{item.comment}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}