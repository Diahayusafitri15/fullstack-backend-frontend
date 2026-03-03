import { useQuery } from '@tanstack/react-query';
import { getPosts, Post } from './api/postService';
import { Card, CardContent } from './components/ui/card';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return (
    <div className="min-h-screen bg-pink-50/30 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Sederhana */}
        <div className="flex justify-between items-center border-b border-pink-100 pb-6">
          <h1 className="text-3xl font-bold text-pink-600 italic tracking-tighter">SOUVNELA.</h1>
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-medium text-pink-400 hover:text-pink-600 transition-colors"
          >
            Admin Portal →
          </button>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-extrabold text-gray-800">Latest Feed</h2>
          <p className="text-gray-400 text-sm">Temukan koleksi souvenir terbaik dari Polinela</p>
        </div>

        {/* List Produk untuk User */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <p className="text-center col-span-full py-20 text-gray-400 animate-pulse">Memuat koleksi souvenir...</p>
          ) : (
            posts.map((post: Post) => (
              <Card key={post.id} className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white">
                <div className="relative">
                  <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md text-pink-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase">
                    {post.nama_kategori || 'Souvenir'}
                  </span>
                  {post.gambar && (
                    <img 
                      src={post.gambar} 
                      alt={post.judul} 
                      className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors">{post.judul}</h2>
                  <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">{post.isi}</p>
                  <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] text-gray-300 font-medium">PROJEK PKL 2026</span>
                    <button className="text-pink-500 text-xs font-bold hover:underline">Read more</button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;