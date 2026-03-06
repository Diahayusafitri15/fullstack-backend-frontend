import { useState, useEffect } from "react"; // Tambah useEffect untuk debounce
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../api/post.service";
import { Link } from "react-router-dom";

const getImageUrl = (path: string) => {
  if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
  return path.trim().replace(/"/g, "");
};

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState(""); // State untuk ngetik (LANCAR)
  const [searchKeyword, setSearchKeyword] = useState(""); // State untuk kirim ke API (JEDA)
  const postsPerPage = 4; 

  // --- LOGIKA DEBOUNCE: Menunggu user selesai mengetik ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(inputValue);
      setCurrentPage(1); // Reset ke halaman 1 setiap pencarian berubah
    }, 500); // Tunggu 500ms

    return () => clearTimeout(timer); // Bersihkan timer jika user ngetik lagi sebelum 500ms
  }, [inputValue]);

  // Fetching data menggunakan searchKeyword (bukan inputValue)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", currentPage, searchKeyword], 
    queryFn: () => getPosts(currentPage, postsPerPage, searchKeyword), 
  });

  const posts = data?.data || [];
  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total_items || 0;

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen p-6 text-center">
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
        <p className="text-red-500 font-bold uppercase tracking-tight">Gagal memuat data katalog</p>
        <p className="text-red-400 text-sm mt-2 italic">{(error as any)?.response?.data?.message || "Pastikan server API anda sudah aktif"}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-pink-200 min-h-screen">
      {/* HERO SECTION */}
      <header className="bg-pink-300 py-16 px-6 text-center shadow-sm">
        <marquee scrollamount="15"><h1 className="text-7xl font-black text-pink-600 mb-2 times-new-roman tracking-tighter uppercase">🎀MY KATALOG YAHYU🎀</h1></marquee>
        <marquee scrollamount="10"><p className="text-3xl font-black text-pink-500 mb-2 times-new-roman tracking-tighter uppercase">
          💅YOK KEPOIN YANG ADA DISINI💅
        </p></marquee>

        {/* SEARCH BAR */}
        <div className="max-w-md mx-auto mt-10 px-1">
          <div className="relative group">
            <input 
              type="text"
              placeholder="Cari aja yang perlu dicari ✨"
              value={inputValue} // Menggunakan inputValue agar input terasa instan
              onChange={(e) => setInputValue(e.target.value)} 
              className="w-full px-8 py-4 rounded-3xl border-none shadow-lg focus:ring-4 focus:ring-pink-400 text-gray-600 font-medium placeholder:italic transition-all outline-none bg-white/90 backdrop-blur-sm"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-400 font-bold">
              {inputValue ? "💖" : "🔍"}
            </div>
          </div>
        </div>
      </header>

      {/* KATALOG PRODUK */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-pink-500 pl-4 uppercase">
            {searchKeyword ? `Hasil Cari: "${searchKeyword}"` : "Katalog"} 
          </h2>
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {totalItems} Koleksi
          </span>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-pink-100">
            <p className="text-gray-400 italic">Oops! yang kamu cari tidak ditemukan.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {posts.map((post: any) => (
                <Link 
                  to={`/product/${post.id}`} 
                  key={post.id} 
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={getImageUrl(post.gambar)}
                      alt={post.judul}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=Produk+Souvnela" }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-pink-600 uppercase shadow-sm">
                      {post.nama_kategori || "Gift"}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors uppercase tracking-tight truncate">
                      {post.judul}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1 italic">
                      {post.isi}
                    </p>
                    
                    <div className="w-full bg-gray-50 group-hover:bg-pink-500 text-gray-400 group-hover:text-white py-3 rounded-2xl font-black text-center text-[10px] tracking-widest transition-all duration-300 uppercase">
                      LIHAT DETAIL
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* KONTROL PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo(0, 0);
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-pink-500 shadow-sm disabled:opacity-20 hover:bg-pink-500 hover:text-white transition-all font-bold"
                >
                  ←
                </button>
                
                <div className="px-6 py-3 bg-white rounded-2xl shadow-sm text-xs font-black text-gray-400 uppercase italic tracking-tighter">
                  Page <span className="text-pink-500">{currentPage}</span> of {totalPages}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo(0, 0);
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-pink-500 shadow-sm disabled:opacity-20 hover:bg-pink-500 hover:text-white transition-all font-bold"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-pink-300 border-t py-12 text-center">
        <p className="text-pink-600 font-black tracking-widest mb-2 uppercase italic">🎀YAHYU🎀</p>
        <p className="text-black-400 text-[10px] font-bold tracking-widest uppercase">
          &copy; 2026 YAHYU HANDMADE. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}