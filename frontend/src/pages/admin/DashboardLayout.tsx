import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { removeToken, getToken } from "../../utils/storage";
import { useEffect } from "react";
import { 
  MessageSquare, 
  LayoutGrid, 
  FileText, 
  LogOut, 
  ShoppingBag, 
  UserCircle
} from "lucide-react"; 

// Pastikan ada kata 'default' di sini
export default function DashboardLayout() {
  const navigate = useNavigate();

  // Proteksi Halaman: Jika token tidak ada → kembali ke login
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#fff5f8]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-pink-100 p-8 flex flex-col shadow-2xl shadow-pink-100/30 sticky top-0 h-screen">
        
        {/* BRANDING */}
        <div className="mb-12 group cursor-pointer" onClick={() => navigate('/admin')}>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-1 bg-pink-600 rounded-full"></div>
             <div className="w-4 h-1 bg-gray-800 rounded-full"></div>
          </div>
          <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter leading-none">
            ADMIN<br/>
            <span className="text-pink-600">DASHBOARD</span>
          </h1>
          <p className="text-[9px] font-bold text-gray-300 mt-2 uppercase tracking-widest">SOUVNELA Management v.1.0</p>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2 flex-1">
          
          {/* DAFTAR PRODUK */}
          <NavLink
            to="/admin/posts"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 group ${
                isActive
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-200 font-bold scale-[1.02]"
                  : "text-gray-500 hover:bg-pink-50 hover:text-pink-600 font-semibold"
              }`
            }
          >
            <FileText size={18} className="group-hover:rotate-6 transition-transform" />
            <span className="text-sm">Daftar Produk</span>
          </NavLink>

          {/* KATEGORI */}
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 group ${
                isActive
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-200 font-bold scale-[1.02]"
                  : "text-gray-500 hover:bg-pink-50 hover:text-pink-600 font-semibold"
              }`
            }
          >
            <LayoutGrid size={18} className="group-hover:rotate-6 transition-transform" />
            <span className="text-sm">Kategori</span>
          </NavLink>

          {/* PESANAN */}
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 group ${
                isActive
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-200 font-bold scale-[1.02]"
                  : "text-gray-500 hover:bg-pink-50 hover:text-pink-600 font-semibold"
              }`
            }
          >
            <ShoppingBag size={18} className="group-hover:rotate-6 transition-transform" />
            <span className="text-sm">Kelola Pesanan</span>
          </NavLink>

          {/* KOMENTAR */}
          <NavLink
            to="/admin/comments"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 group ${
                isActive
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-200 font-bold scale-[1.02]"
                  : "text-gray-500 hover:bg-pink-50 hover:text-pink-600 font-semibold"
              }`
            }
          >
            <MessageSquare size={18} className="group-hover:rotate-6 transition-transform" />
            <span className="text-sm">Komentar</span>
          </NavLink>

        </nav>

        {/* PROFILE & LOGOUT SECTION */}
        <div className="pt-6 mt-6 border-t border-pink-50">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner">
                <UserCircle size={24} />
            </div>
            <div className="flex flex-col">
                <span className="text-[11px] font-black text-gray-800 uppercase tracking-tighter">Diah Ayu Safitri</span>
                <span className="text-[8px] font-bold text-pink-400 uppercase tracking-widest">Full Control Mode</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-4 rounded-[24px] text-red-500 font-bold hover:bg-red-50 transition-all active:scale-95 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Logout System</span>
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">
            {/* White Container for Sub-pages */}
            <div className="bg-white rounded-[48px] p-10 min-h-full shadow-sm border border-pink-50/50">
                <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
}