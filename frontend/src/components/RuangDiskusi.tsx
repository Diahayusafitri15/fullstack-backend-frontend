import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Star, MessageSquare, Loader2, Trash2 } from 'lucide-react';

export default function RuangDiskusi({ postId }: { postId: string | undefined }) {
  const [isiKomentar, setIsiKomentar] = useState('');
  const [listKomentar, setListKomentar] = useState<any[]>([]);
  const [rating, setRating] = useState(5); 
  const [isSending, setIsSending] = useState(false);
  
  const token = localStorage.getItem('token');
  
  // --- PERBAIKAN: Ambil email dari object 'user' agar sinkron dengan Navbar ---
  const userString = localStorage.getItem('user');
  const userData = userString ? JSON.parse(userString) : null;
  const userEmail = userData?.email || "Tamu"; 

  // Ambil data komentar
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/posts/${postId}/comments`);
      // Sesuaikan dengan format response backend: response.data.data
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
      fetchComments(); // Refresh list agar angka notifikasi di dashboard admin nanti update
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Cek koneksi server ya!";
      alert("Gagal mengirim komentar: " + errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  // Fungsi Hapus Komentar
  const handleHapus = async (commentId: number) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini? 🥺")) return;

    try {
      await axios.delete(`http://localhost:3000/posts/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Komentar berhasil dihapus! ✨");
      fetchComments(); 
    } catch (err: any) {
      const pesanError = err.response?.data?.message || "Gagal menghapus komentar";
      alert(pesanError);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20 mt-10">
      <div className="bg-gray-50/50 p-8 rounded-[40px] border border-gray-100 shadow-inner">
        <h3 className="flex items-center gap-3 font-black text-gray-800 uppercase tracking-tighter text-2xl mb-8 italic">
          <MessageSquare className="text-pink-500 w-7 h-7" /> 
          Ruang Diskusi ({listKomentar.length})
        </h3>

        {/* INPUT AREA */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-pink-50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-gray-200"></span> Tinggalkan Jejakmu di Sini ✨
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
               <label className="text-[9px] font-black text-pink-400 uppercase ml-1">Email Pengguna</label>
               <input 
                type="text" 
                disabled 
                value={userEmail} 
                className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 italic outline-none cursor-not-allowed"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-pink-400 uppercase ml-1">Berikan Rating</label>
              <div className="flex items-center h-[54px] gap-2 bg-gray-50 px-6 rounded-2xl border border-gray-100">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-6 h-6 cursor-pointer transition-all active:scale-90 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <textarea 
            value={isiKomentar}
            onChange={(e) => setIsiKomentar(e.target.value)}
            placeholder="Apa pendapatmu tentang souvenir ini?..."
            className="w-full p-6 h-32 bg-gray-50 rounded-[24px] border border-gray-100 focus:ring-4 focus:ring-pink-50 focus:border-pink-200 outline-none text-sm transition-all resize-none"
          />

          <div className="flex justify-end mt-6">
            <button 
              onClick={handleKirim}
              disabled={isSending || !token}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-pink-100 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>MENGIRIM... <Loader2 className="w-4 h-4 animate-spin" /></>
              ) : (
                <>KIRIM KOMENTAR <Send className="w-4 h-4" /></>
              )}
            </button>
          </div>
          {!token && <p className="text-center text-[10px] font-bold text-red-400 mt-4 italic uppercase">Login untuk ikut berdiskusi 🌸</p>}
        </div>

        {/* LIST KOMENTAR */}
        <div className="mt-12 space-y-6">
          {listKomentar.length === 0 ? (
            <div className="text-center py-24 bg-white/50 rounded-[40px] border-2 border-dashed border-gray-200">
               <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <MessageSquare className="text-gray-300" />
               </div>
               <p className="text-gray-400 text-sm italic font-bold">Belum ada diskusi di sini. Mulai yuk! 🌟</p>
            </div>
          ) : (
            listKomentar.map((item) => (
              <div key={item.id} className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm flex flex-col space-y-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-black text-xs uppercase">
                      {item.email.substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-gray-800 uppercase tracking-wider leading-none">
                        {item.email}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* HAPUS KOMENTAR (Hanya jika email cocok) */}
                    {userEmail === item.email && (
                      <button 
                        onClick={() => handleHapus(item.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Hapus Komentar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50/50 p-5 rounded-2xl border-l-4 border-pink-400">
                  <p className="text-gray-600 text-sm italic leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}