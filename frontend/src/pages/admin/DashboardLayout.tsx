import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/storage";
import { useEffect } from "react";
import { getToken } from "../../utils/storage";
import { MessageSquare, LayoutGrid, FileText, LogOut } from "lucide-react"; // Tambahkan icon biar makin aesthetic

export default function DashboardLayout() {
  const navigate = useNavigate();

  // Jika token tidak ada → paksa ke login
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-pink-100"> {/* Ganti ke pink-100 agar lebih soft */}
      {/* SIDEBAR */}
      <aside className="w-64 bg-pink-300 border-r p-6 shadow-lg">
        <h1 className="text-xl font-black mb-10 text-pink-700 uppercase italic tracking-tighter">
          Admin Dashboard
        </h1>

        <nav className="space-y-4">
          {/* MENU POSTS */}
          <NavLink
            to="/admin/posts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-pink-500 text-white font-black text-xl shadow-md scale-105"
                  : "hover:bg-pink-200 text-pink-800 font-bold"
              }`
            }
          >
            <FileText size={20} />
            Posts
          </NavLink>

          {/* MENU CATEGORIES */}
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-pink-500 text-white font-black text-xl shadow-md scale-105"
                  : "hover:bg-pink-200 text-pink-800 font-bold"
              }`
            }
          >
            <LayoutGrid size={20} />
            Categories
          </NavLink>

          {/* --- MENU KOMENTAR (BARU) --- */}
          <NavLink
            to="/admin/comments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-pink-500 text-white font-black text-xl shadow-md scale-105"
                  : "hover:bg-pink-200 text-pink-800 font-bold"
              }`
            }
          >
            <MessageSquare size={20} />
            Comments
          </NavLink>

          {/* TOMBOL LOGOUT */}
          <div className="pt-8 mt-6 border-t border-pink-400/30">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl text-red-600 font-bold hover:bg-red-100 transition-all shadow-sm active:scale-95"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white/50 backdrop-blur-md rounded-[40px] p-8 min-h-full border border-white/40 shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}