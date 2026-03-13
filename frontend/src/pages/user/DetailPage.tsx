import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../api/post.service";
import RuangDiskusi from "../../components/RuangDiskusi";
import Navbar from "../../components/Navbar";
import { ShoppingCart, ArrowLeft, ShieldCheck, Sparkles, Plus, Minus, Info } from "lucide-react";
import { useState } from "react";

// Helper untuk membersihkan URL gambar dari MinIO/Backend
const getImageUrl = (path: string) => {
  if (!path) return "https://via.placeholder.com/600x600?text=No+Image";
  return path.trim().replace(/"/g, "");
};

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jumlah, setJumlah] = useState(1);

  // Fetch data produk
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id!),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 mb-4"></div>
      <p className="text-pink-500 font-black animate-pulse uppercase tracking-widest text-xs">Menyiapkan Souvenir... ✨</p>
    </div>
  );

  if (isError || !post) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-20 text-center bg-white">
      <div className="bg-red-50 p-4 rounded-full mb-4 text-red-500">
          <Info size={40} />
      </div>
      <p className="text-red-500 font-black uppercase tracking-widest">
        Ups! Produk tidak ditemukan atau server sedang istirahat.
      </p>
      <button onClick={() => navigate('/')} className="mt-6 text-pink-500 font-bold underline">Kembali ke Beranda</button>
    </div>
  );

  // LOGIC HARGA: Konversi dari backend agar aman dikalikan
  const hargaSatuan = Number(post.harga || 0);
  const totalEstimasi = hargaSatuan * jumlah;

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />

      <nav className="pt-32 pb-6 max-w-6xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="group text-gray-400 hover:text-pink-500 flex items-center gap-2 font-black transition-all uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Kembali ke Katalog
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start pb-20">
        
        {/* AREA GAMBAR (Aesthetic Glow) */}
        <div className="relative rounded-[40px] overflow-hidden shadow-2xl shadow-pink-100/50 bg-gray-50 border border-pink-50 group">
          <img
            src={getImageUrl(post.gambar)}
            alt={post.judul}
            className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-[1.5s] ease-in-out"
            onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/600x600?text=Image+Not+Found";
            }}
          />
          <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/50">
             <p className="text-[10px] font-black text-pink-500 uppercase italic">Polinela Choice</p>
          </div>
        </div>

        {/* AREA INFORMASI DETAIL */}
        <div className="flex flex-col space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full font-black tracking-widest uppercase text-[9px] shadow-sm shadow-pink-100">
                {post.nama_kategori || "Mancegine Print"}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">
                <ShieldCheck size={14} className="text-green-400" /> Premium Quality Verified
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 leading-tight uppercase italic tracking-tighter">
              {post.judul}
            </h1>
            <div className="w-24 h-2.5 bg-pink-500 mt-5 rounded-full shadow-lg shadow-pink-200"></div>
          </div>

          {/* KOTAK HARGA & JUMLAH */}
          <div className="bg-white p-8 rounded-[40px] border-2 border-pink-50/50 shadow-xl shadow-pink-50/20 space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] ml-1">Official Price</span>
              <span className="text-5xl font-black text-gray-800 italic">
                Rp {hargaSatuan.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-pink-50">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pilih Jumlah Order</span>
              <div className="flex items-center gap-8 bg-pink-50/30 w-max p-2.5 rounded-3xl border border-pink-100 shadow-inner">
                <button 
                  onClick={() => setJumlah(prev => Math.max(1, prev - 1))}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl font-black text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <Minus size={20} />
                </button>
                <span className="text-xl font-black text-gray-800 w-8 text-center">{jumlah}</span>
                <button 
                  onClick={() => setJumlah(prev => prev + 1)}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl font-black text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center text-[11px] font-black uppercase tracking-widest border-t border-pink-50">
              <span className="text-gray-400 italic">Total Estimasi</span>
              <span className="text-pink-600 text-2xl font-black shadow-pink-50 drop-shadow-sm">
                Rp {totalEstimasi.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
          
          {/* DESKRIPSI LAYANAN */}
          <div className="bg-pink-50/20 p-8 rounded-[40px] border border-pink-100/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={60} className="text-pink-500" />
            </div>
            <h4 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Sparkles size={14} /> Description Product
            </h4>
            <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line italic font-medium relative z-10">
              {post.isi}
            </p>
          </div>

          {/* TOMBOL PESAN */}
          <Link 
            to={`/checkout/${post.id}?qty=${jumlah}`}
            className="w-full flex items-center justify-center gap-4 bg-pink-500 hover:bg-pink-600 text-white px-12 py-7 rounded-[30px] font-black text-sm tracking-[0.2em] uppercase transition-all shadow-2xl shadow-pink-200 hover:-translate-y-1.5 active:scale-95 group"
          >
            <ShoppingCart size={22} className="group-hover:rotate-12 transition-transform" /> 
            Checkout Now ✨
          </Link>

          <div className="pt-6 border-t border-gray-100 text-[10px] text-gray-300 font-bold tracking-widest uppercase flex flex-wrap justify-between gap-4">
            <span className="hover:text-pink-300 transition-colors">ID: {post.id} • SOUVNELA OFFICIAL</span>
            <span>MANCEGINE © 2026</span>
          </div>
        </div>
      </main>

      {/* RUANG DISKUSI */}
      <section className="bg-gray-50/50 py-24 border-t border-pink-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
             <h2 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter">Ruang <span className="text-pink-500">Diskusi</span></h2>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Tanya jawab seputar produk ini</p>
          </div>
          <RuangDiskusi postId={id!} />
        </div>
      </section>
    </div>
  );
}