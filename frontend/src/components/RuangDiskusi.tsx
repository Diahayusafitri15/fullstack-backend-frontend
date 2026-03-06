import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RuangDiskusi({ postId }: { postId: string | undefined }) {
  const [isiKomentar, setIsiKomentar] = useState('');
  const [listKomentar, setListKomentar] = useState<any[]>([]);
  
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/posts/${postId}/comments`);
      setListKomentar(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil komentar", err);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleKirim = async () => {
    if (!token) return alert("Silakan login terlebih dahulu ya! 🌸");
    try {
      await axios.post('http://localhost:3000/api/posts/comments', 
        { postId: Number(postId), comment: isiKomentar, rating: 5 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsiKomentar('');
      fetchComments();
    } catch (err) {
      alert("Gagal mengirim komentar.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100">
        <h3 className="flex items-center gap-3 font-black text-gray-800 uppercase tracking-tighter text-xl mb-6 italic">
          <span className="text-orange-500">💬</span> Ruang Diskusi ({listKomentar.length})
        </h3>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Tinggalkan Jejakmu di Sini 👇</p>
          
          <input 
            type="text" 
            disabled 
            placeholder="Nama Lengkap Kamu..." 
            className="w-full p-4 mb-3 bg-gray-50 rounded-xl border border-gray-100 text-sm italic outline-none cursor-not-allowed"
          />

          <textarea 
            value={isiKomentar}
            onChange={(e) => setIsiKomentar(e.target.value)}
            placeholder="Tulis pendapat atau pertanyaanmu di sini..."
            className="w-full p-4 h-32 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-200 outline-none text-sm transition-all"
          />

          <div className="flex justify-end mt-4">
            <button 
              onClick={handleKirim}
              className="bg-[#d35400] text-white px-8 py-3 rounded-xl flex items-center gap-3 hover:bg-orange-700 transition-all font-bold uppercase text-xs tracking-widest shadow-lg shadow-orange-200"
            >
              Kirim Komentar <span className="text-lg">➤</span>
            </button>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          {listKomentar.length === 0 ? (
            <p className="text-center text-gray-300 text-sm italic font-medium py-10">Belum ada komentar. Jadilah yang pertama! 🌟</p>
          ) : (
            listKomentar.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{item.email}</span>
                  <span className="text-yellow-400 text-xs">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">"{item.comment}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}