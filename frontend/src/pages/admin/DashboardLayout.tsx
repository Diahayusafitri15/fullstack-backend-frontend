import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/storage";
import { useEffect } from "react";
import { getToken } from "../../utils/storage";

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
    <div className="min-h-screen flex bg-pink-200">
      {/* SIDEBAR */}
      <aside className="w-64 bg-pink-300 border-r p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-8 text-pink-600">
          Admin Dashboard
        </h1>

        <nav className="space-y-3">
          <NavLink
            to="/admin/posts"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-pink-500 text-white font-bold text-2xl"
                  : "hover:bg-pink-100 text-gray-700"
              }`
            }
          >
            Posts
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-pink-500 text-white font-bold text-2xl"
                  : "hover:bg-pink-100 text-gray-700"
              }`
            }
          >
            Categories
          </NavLink>

          <div className="pt-6 border-t">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}