import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  // 1. Ambil data user dari localStorage
  const userString = localStorage.getItem("user");
  const userData = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    if (window.confirm("Yakin ingin keluar, Cantik? 🌸")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* LOGO SOUVNELA */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-pink-500 p-2 rounded-xl group-hover:rotate-12 transition-all">
            <ShoppingBag className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-gray-800 uppercase">
            SOUV<span className="text-pink-500">NELA</span>
          </span>
        </Link>

        {/* MENU TENGAH */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <Link to="/" className="hover:text-pink-500 transition-colors">Katalog</Link>
          <Link to="/about" className="hover:text-pink-500 transition-colors">Tentang Kami</Link>
        </div>

        {/* --- BAGIAN YANG KAMU MAKSUD (USER SECTION) --- */}
        <div className="flex items-center gap-4">
          {userData ? (
            // JIKA SUDAH LOGIN: Tampilkan Nama/Email dan Tombol Logout
            <div className="flex items-center gap-3 bg-pink-50 pl-4 pr-1.5 py-1.5 rounded-2xl border border-pink-100">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-pink-400 uppercase leading-none">Logged in as</span>
                {/* Menampilkan email user */}
                <span className="text-[11px] font-bold text-gray-700">{userData.email}</span>
              </div>
              
              {/* Avatar Inisial */}
              <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                {userData.email.charAt(0).toUpperCase()}
              </div>

              <button 
                onClick={handleLogout}
                className="bg-white hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-all shadow-sm group"
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            // JIKA BELUM LOGIN: Tampilkan tombol MASUK pink yang kamu punya
            <button 
              onClick={() => navigate("/login")}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all shadow-lg shadow-pink-100 uppercase"
            >
              Masuk 💖
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}