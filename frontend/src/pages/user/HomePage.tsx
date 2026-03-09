import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../api/post.service";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar"; 
import { Search, Heart, ArrowRight, ArrowLeft, Loader2, Sparkles, MessageSquare } from "lucide-react";

const getImageUrl = (path: string) => {
  if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
  return path.trim().replace(/"/g, "");
};

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState(""); 
  const [searchKeyword, setSearchKeyword] = useState(""); 
  const postsPerPage = 4; 

  // --- LOGIKA DEBOUNCE SEARCH ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(inputValue);
      setCurrentPage(1); 
    }, 500); 

    return () => clearTimeout(timer); 
  }, [inputValue]);

  // Fetching data dengan React Query
  const { data, isLoading } = useQuery({
    queryKey: ["posts", currentPage, searchKeyword], 
    queryFn: () => getPosts(currentPage, postsPerPage, searchKeyword), 
  });

  const posts = data?.data || [];
  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total_items || 0;

  // Fungsi Scroll ke Atas saat ganti halaman
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-pink-50">
      <Loader2 className="animate-spin text-pink-500 w-12 h-12 mb-4" />
      <p className="text-pink-400 font-black italic animate-pulse tracking-widest uppercase text-xs">Membuka Katalog YAHYU😍...</p>
    </div>
  );

  return (
    <div className="bg-[#fff5f7] min-h-screen font-sans selection:bg-pink-200">
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 text-pink-400 rotate-12 text-7xl italic font-black uppercase tracking-tighter">Handmade</div>
            <div className="absolute bottom-10 right-10 text-pink-400 -rotate-12 text-7xl italic font-black uppercase tracking-tighter">YAHYU</div>
        </div>

        <div className="relative z-10">
            <h1 className="text-3xl md:text-6xl font-black text-pink-600 tracking-tighter uppercase drop-shadow-sm italic mb-6">
              🎀 MY KATALOG YAHYU 🎀
            </h1>
            
            <p className="text-sm md:text-base font-bold text-pink-400 mb-10 tracking-[0.4em] uppercase italic flex items-center justify-center gap-2">
                <Sparkles size={16} /> Yok kepoin yang ada di sini <Sparkles size={16} />
            </p>

            {/* SEARCH BAR */}
            <div className="max-w-xl mx-auto px-4">
                <div className="relative group">
                    <input 
                        type="text"
                        placeholder="Cari katalog yang kamu mau... ✨"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} 
                        className="w-full px-10 py-5 rounded-[30px] border-2 border-pink-100 shadow-2xl shadow-pink-100/50 focus:ring-4 focus:ring-pink-100 focus:border-pink-400 text-gray-600 font-bold placeholder:italic transition-all outline-none bg-white/95 backdrop-blur-sm pr-16"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        {inputValue ? <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={20} /> : <Search className="text-pink-300" size={20} />}
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* KATALOG PRODUK */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="flex flex-col items-center md:items-start group">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 italic uppercase tracking-tighter group-hover:text-pink-500 transition-colors">
                {searchKeyword ? `Hasil Cari: "${searchKeyword}"` : "Koleksi Terbaru"} 
            </h2>
            <div className="h-2 w-24 bg-pink-500 rounded-full mt-2 shadow-lg shadow-pink-200"></div>
          </div>
          <span className="bg-white border-2 border-pink-50 text-pink-500 px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-100/50">
            Total {totalItems} Produk
          </span>
        </div>
        
        {/* POIN 1: KONDISI JIKA DATA TIDAK DITEMUKAN (NOT FOUND) */}
        {posts.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[60px] border-4 border-dashed border-pink-50 shadow-inner">
            <div className="text-7xl mb-6 animate-bounce">🔍</div>
            <p className="text-gray-400 italic font-black text-xl uppercase tracking-widest">Oops! Katalog Tidak Ditemukan.</p>
            <button 
              onClick={() => setInputValue("")}
              className="mt-6 text-pink-500 font-bold underline hover:text-pink-600"
            >
              Lihat Semua Produk
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {posts.map((post: any) => (
                <Link 
                  to={`/product/${post.id}`} 
                  key={post.id} 
                  className="group bg-white rounded-[45px] overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col border border-pink-50/50"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={getImageUrl(post.gambar)}
                      alt={post.judul}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    
                    {/* POIN 3: BADGE NOTIFIKASI KOMENTAR (POINT INI) */}
                    {(post.komentars_count || post.total_komentar) > 0 && (
                      <div className="absolute top-6 right-6 flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg border-2 border-white animate-in zoom-in duration-500">
                        <MessageSquare size={14} fill="white" />
                        <span className="text-xs font-black">{post.komentars_count || post.total_komentar}</span>
                        {/* Dot Notif Kecil */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-600 rounded-full border-2 border-white"></div>
                      </div>
                    )}

                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black text-pink-600 uppercase tracking-widest shadow-md border border-white/50">
                      {post.nama_kategori || "YAHYU"}
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col bg-white">
                    <h3 className="text-xl font-black text-gray-800 mb-4 group-hover:text-pink-500 transition-colors uppercase tracking-tight italic">
                      {post.judul}
                    </h3>
                    <p className="text-gray-400 text-[11px] line-clamp-2 mb-10 flex-1 font-bold leading-relaxed italic uppercase opacity-70">
                      {post.isi}
                    </p>
                    
                    {/* DISKUSI PENGUNJUNG BUTTON STYLE */}
                    <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-pink-50 rounded-2xl w-fit">
                       <MessageSquare size={12} className="text-pink-500" />
                       <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest">
                         {post.komentars_count || post.total_komentar || 0} Diskusi Pengunjung
                       </span>
                    </div>

                    <div className="w-full flex items-center justify-center gap-4 bg-gray-50 group-hover:bg-pink-500 text-gray-400 group-hover:text-white py-5 rounded-[30px] font-black text-[10px] tracking-[0.3em] transition-all duration-500 uppercase">
                      LIHAT DETAIL <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* POIN 2: PAGINATION DENGAN NOMOR HALAMAN */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-4 mt-24">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-[20px] text-pink-500 shadow-xl disabled:opacity-20 hover:bg-pink-500 hover:text-white transition-all border border-pink-50"
                >
                  <ArrowLeft size={20} />
                </button>
                
                <div className="flex gap-2 p-2 bg-white rounded-[25px] border border-pink-50 shadow-lg">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-12 h-12 rounded-[18px] text-[11px] font-black transition-all ${
                        currentPage === pageNum 
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' 
                        : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-[20px] text-pink-500 shadow-xl disabled:opacity-20 hover:bg-pink-500 hover:text-white transition-all border border-pink-50"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-pink-100 py-20 px-6 mt-32 text-center">
        <div className="max-w-md mx-auto pt-4">
            <div className="text-pink-600 font-black text-4xl italic tracking-tighter mb-4 uppercase">YAH<span className="text-gray-800">YU💅🎀</span></div>
            <p className="text-gray-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-10 italic">
              "Katalog Yahyu Digital Paling Estetik" 🎀
            </p>
            <p className="text-gray-400 text-[9px] font-black tracking-[0.3em] uppercase">
              &copy; 2026 YAHYU HANDMADE. PKL POLINELA.
            </p>
        </div>
      </footer>
    </div>
  );
}