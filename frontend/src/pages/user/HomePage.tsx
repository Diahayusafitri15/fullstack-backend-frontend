import { useQuery } from "@tanstack/react-query";
import { getPosts, Post } from "../../api/post.service";

// Sanitasi URL agar gambar muncul tanpa error syntax
const getImageUrl = (path: string) => {
  if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
  return path.trim().replace(/"/g, "");
};

export default function HomePage() {
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
    </div>
  );

  return (
    <div className="bg-[#FFF5F7] min-h-screen">
      {/* HERO SECTION */}
      <header className="bg-white py-16 px-6 text-center shadow-sm">
        <h1 className="text-4xl font-black text-pink-600 mb-2 italic tracking-tighter">SOUVNELA</h1>
        <p className="text-gray-500 max-w-md mx-auto">Abadikan momen spesialmu dengan koleksi souvenir handmade terbaik kami.</p>
      </header>

      {/* KATALOG PRODUK */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-pink-500 pl-4">Katalog Souvenir</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getImageUrl(post.gambar)}
                  alt={post.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=Produk+Souvnela" }}
                />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-pink-600 uppercase">
                  {post.nama_kategori}
                </div>
              </div>

              {/* Info Produk */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{post.judul}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">{post.isi}</p>
                
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-pink-100 transition-colors">
                  Pesan Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t py-10 text-center text-gray-400 text-sm">
        &copy; 2026 SOUVNELA. All Rights Reserved.
      </footer>
    </div>
  );
}