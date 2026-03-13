import { useNavigate, Link } from "react-router-dom";
// Menambahkan ShoppingCart dan ClipboardList untuk navigasi pesanan
import { 
  LogOut, 
  ShoppingBag, 
  LayoutDashboard, 
  Info, 
  FileText, 
  ShoppingCart, 
  ClipboardList 
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const userData = userString ? JSON.parse(userString) : null;
  
  const isAdmin = userData?.role === "admin";

  const handleLogout = () => {
    if (window.confirm("Yakin ingin keluar dari sistem MANCEGINE? 🌸")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* LOGO MANCEGINE */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-pink-600 p-2 rounded-xl group-hover:rotate-12 transition-all shadow-lg shadow-pink-100">
            <FileText className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-gray-800 uppercase">
            MANCE<span className="text-pink-600">GINE</span>
          </span>
        </Link>

        {/* MENU TENGAH - Navigasi Pintar */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          {isAdmin ? (
            <>
              <Link to="/admin/posts" className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                <LayoutDashboard size={14} /> Produk
              </Link>
              {/* LINK BARU: Langsung ke Kelola Pesanan Admin */}
              <Link to="/admin/orders" className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                <ShoppingCart size={14} /> Kelola Pesanan
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-pink-600 transition-colors">Katalog Produk</Link>
              {userData && (
                <Link to="/my-orders" className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                  <ClipboardList size={14} /> Riwayat Pesanan
                </Link>
              )}
              <Link to="/about" className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                <Info size={14} /> Tentang Percetakan
              </Link>
            </>
          )}
        </div>

        {/* USER SECTION */}
        <div className="flex items-center gap-4">
          {userData ? (
            <div className="flex items-center gap-3 bg-pink-50 pl-4 pr-1.5 py-1.5 rounded-2xl border border-pink-100">
              <div className="flex flex-col items-end">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase mb-1 ${
                  isAdmin ? 'bg-pink-600 text-white' : 'bg-pink-400 text-white'
                }`}>
                  {isAdmin ? "ADMIN MANCEGINE" : "PELANGGAN"}
                </span>
                <span className="text-[11px] font-bold text-gray-700">{userData.email}</span>
              </div>
              
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-sm ${
                isAdmin ? 'bg-gray-800' : 'bg-pink-600'
              }`}>
                {userData.email.charAt(0).toUpperCase()}
              </div>

              <button 
                onClick={handleLogout}
                className="bg-white hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-all shadow-sm border border-red-50"
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate("/login")}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-2xl font-black text-[10px] tracking-widest transition-all shadow-lg shadow-pink-100 uppercase"
            >
              Masuk Sistem 💖
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}