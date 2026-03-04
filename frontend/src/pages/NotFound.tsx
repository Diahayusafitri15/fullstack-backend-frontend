import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col justify-center items-center text-center p-6 select-none">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10">
        {/* Animated 404 Text */}
        <h1 className="text-[12rem] md:text-[15rem] font-black text-pink-200 uppercase italic tracking-tighter leading-none animate-pulse">
          404
        </h1>

        {/* Content Section */}
        <div className="flex flex-col items-center -mt-10 md:-mt-16">
          <h2 className="text-2xl md:text-4xl font-black text-gray-800 uppercase italic tracking-tight">
            Oops! Tersesat Ya?
          </h2>
          
          <div className="w-16 h-1.5 bg-pink-500 my-6 rounded-full"></div>
          
          <p className="text-gray-500 max-w-sm italic font-medium leading-relaxed">
            Koleksi souvenir yang kamu cari sepertinya tidak ada di galeri kami atau telah berpindah tempat.
          </p>

          <Link 
            to="/" 
            className="mt-10 bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-pink-200 transition-all duration-300 uppercase tracking-[0.2em] text-sm active:scale-95"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 text-[10px] font-black text-pink-300 uppercase tracking-[0.5em] italic">
        Souvnela Digital Gallery
      </div>
    </div>
  );
}