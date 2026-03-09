import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../api/post.service";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar"; // Import Navbar yang baru dibuat
import { Search, Heart, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const getImageUrl = (path: string) => {
  if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
  return path.trim().replace(/"/g, "");
};

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState(""); 
  const [searchKeyword, setSearchKeyword] = useState(""); 
  const postsPerPage = 8; // Ubah ke 8 agar grid lebih penuh

  // --- LOGIKA DEBOUNCE ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(inputValue);
      setCurrentPage(1); 
    }, 500); 

    return () => clearTimeout(timer); 
  }, [inputValue]);

  // Fetching data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", currentPage, searchKeyword], 
    queryFn: () => getPosts(currentPage, postsPerPage, searchKeyword), 
  });

  const posts = data?.data || [];
  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total_items || 0;

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-pink-50">
      <Loader2 className="animate-spin text-pink-500 w-12 h-12 mb-4" />
      <p className="text-pink-400 font-black italic animate-pulse">MEMBUKA KATALOG CANTIK...</p>
    </div>
  );

  return (
    <div className="bg-[#fff5f7] min-h-screen font-sans">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 text-pink-300 rotate-12 text-6xl italic font-black uppercase tracking-tighter">Souvenirs</div>
            <div className="absolute bottom-10 right-10 text-pink-300 -rotate-12 text-6xl italic font-black uppercase tracking-tighter">Handmade</div>
        </div>

        <div className="relative z-10">
            <marquee scrollamount="12" className="mb-4">
                <h1 className="text-6xl md:text-8xl font-black text-pink-600 times-new-roman tracking-tighter uppercase drop-shadow-sm">
                    🎀 MY KATALOG YAHYU 🎀
                </h1>
            </marquee>
            
            <p className="text-lg md:text-xl font-bold text-pink-400 mb-10 tracking-[0.3em] uppercase italic">
                💅 Yok kepoin yang ada di sini 💅
            </p>

            {/* SEARCH BAR AESTHETIC */}
            <div className="max-w-xl mx-auto px-4">
                <div className="relative group">
                    <input 
                        type="text"
                        placeholder="Cari souvenir impianmu... ✨"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} 
                        className="w-full px-10 py-5 rounded-[30px] border-2 border-pink-100 shadow-2xl shadow-pink-100/50 focus:ring-4 focus:ring-pink-200 focus:border-pink-400 text-gray-600 font-bold placeholder:italic transition-all outline-none bg-white/90 backdrop-blur-sm pr-16"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {inputValue ? <Heart className="text-pink-500 fill-pink-500 animate-bounce" size={20} /> : <Search className="text-pink-300" size={20} />}
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* KATALOG PRODUK */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter">
                {searchKeyword ? `Hasil Cari: "${searchKeyword}"` : "Koleksi Terbaru"} 
            </h2>
            <div className="h-1.5 w-24 bg-pink-500 rounded-full mt-1"></div>
          </div>
          <span className="bg-white border border-pink-100 text-pink-500 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            Total {totalItems} Produk
          </span>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[50px] border-4 border-dashed border-pink-50">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 italic font-bold text-lg uppercase tracking-widest">Oops! Souvenir yang kamu cari belum ada di rak.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {posts.map((post: any) => (
                <Link 
                  to={`/product/${post.id}`} 
                  key={post.id} 
                  className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col border border-pink-50"
                >
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={getImageUrl(post.gambar)}
                      alt={post.judul}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=Produk+Souvnela" }}
                    />
                    {/* Badge Kategori */}
                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[9px] font-black text-pink-600 uppercase tracking-widest shadow-sm border border-white/50">
                      {post.nama_kategori || "Gift"}
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-8 flex-1 flex flex-col bg-white">
                    <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-pink-500 transition-colors uppercase tracking-tight truncate italic">
                      {post.judul}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 mb-8 flex-1 font-medium leading-relaxed italic">
                      {post.isi}
                    </p>
                    
                    <div className="w-full flex items-center justify-center gap-3 bg-pink-50 group-hover:bg-pink-500 text-pink-500 group-hover:text-white py-4 rounded-[24px] font-black text-[10px] tracking-[0.2em] transition-all duration-300 uppercase shadow-sm">
                      LIHAT DETAIL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* KONTROL PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-20">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-3xl text-pink-500 shadow-xl disabled:opacity-20 hover:bg-pink-500 hover:text-white transition-all border border-pink-50"
                >
                  <ArrowLeft size={20} />
                </button>
                
                <div className="px-8 py-4 bg-white border border-pink-50 rounded-[24px] shadow-sm text-[10px] font-black text-gray-400 uppercase italic tracking-[0.2em]">
                  Halaman <span className="text-pink-500 text-sm">{currentPage}</span> / {totalPages}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-3xl text-pink-500 shadow-xl disabled:opacity-20 hover:bg-pink-500 hover:text-white transition-all border border-pink-50"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER AESTHETIC */}
      <footer className="bg-white border-t border-pink-100 py-16 px-6 mt-20 text-center">
        <div className="max-w-md mx-auto">
            <div className="text-pink-500 font-black text-3xl italic tracking-tighter mb-4">SOUV<span className="text-gray-800">NELA</span></div>
            <p className="text-gray-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
              Handmade Souvenir & Gift Shop 🌸
            </p>
            <div className="h-[1px] w-full bg-pink-50 mb-8"></div>
            <p className="text-gray-300 text-[9px] font-black tracking-widest uppercase">
              &copy; 2026 YAHYU HANDMADE. Dibuat dengan cinta untuk PKL Polinela.
            </p>
        </div>
      </footer>
    </div>
  );
}