import Navbar from "../../components/Navbar";
import { Heart, Star, Sparkles, ShoppingBag } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#fff5f7] min-h-screen font-sans selection:bg-pink-200">
      <Navbar />

      {/* HERO SECTION ABOUT */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        
        <h1 className="text-5xl md:text-7xl font-black text-pink-600 mb-6 italic tracking-tighter uppercase drop-shadow-sm">
          🎀 Cerita Kami 🎀
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 font-bold italic uppercase tracking-widest text-xs md:text-sm leading-relaxed">
          Lebih dari sekadar hadiah, kami mengemas kenangan manis dalam setiap sentuhan buatan tangan. ✨
        </p>
      </section>

      {/* ISI KONTEN AESTHETIC */}
      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Gambar/Visual Box */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-pink-400 to-rose-300 rounded-[50px] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white p-4 rounded-[40px] shadow-xl border border-pink-50 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop" 
                alt="Souvenela Craft" 
                className="w-full h-[400px] object-cover rounded-[30px]"
              />
              <div className="absolute bottom-10 left-10 right-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-lg">
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Handmade with Love</span>
                <p className="text-gray-800 font-bold text-lg italic tracking-tight">Setiap detail punya cerita sendiri. 🌸</p>
              </div>
            </div>
          </div>

          {/* Teks Deskripsi */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-pink-50 shadow-sm hover:shadow-pink-100/50 transition-shadow">
              <div className="bg-pink-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-200">
                <Sparkles className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic mb-4">Apa itu SOUVNELA?</h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed italic">
                SOUVNELA lahir dari semangat mahasiswa **Politeknik Negeri Lampung** untuk menghadirkan souvenir digital yang praktis namun tetap terasa personal. Kami percaya bahwa hadiah terbaik adalah yang mampu menyampaikan perasaan tanpa kata-kata.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-500 p-6 rounded-[30px] text-center text-white">
                <Heart className="mx-auto mb-2" fill="white" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Kualitas</h3>
                <p className="text-[8px] font-bold opacity-80 uppercase mt-1">Terjamin & Premium</p>
              </div>
              <div className="bg-white border border-pink-100 p-6 rounded-[30px] text-center">
                <Star className="mx-auto mb-2 text-pink-500" fill="#ec4899" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-pink-500">Unik</h3>
                <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Desain Eksklusif</p>
              </div>
            </div>
          </div>
        </div>

        {/* VISI MISI BANNER */}
        <div className="mt-20 bg-gradient-to-r from-pink-500 to-rose-400 rounded-[50px] p-12 text-center text-white shadow-2xl shadow-pink-200">
          <ShoppingBag size={40} className="mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Visi Kami</h2>
          <p className="max-w-2xl mx-auto text-pink-50 font-medium italic text-lg leading-relaxed">
            "Menjadi galeri souvenir nomor satu yang memberikan kebahagiaan melalui kreativitas dan kemudahan akses bagi semua orang."
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-pink-100 py-12 text-center">
        <p className="text-pink-500 font-black tracking-widest text-xs mb-2 uppercase italic">🎀 YAHYU HANDMADE 🎀</p>
        <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          &copy; 2026 SOUVNELA. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}