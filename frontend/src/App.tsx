import { Routes, Route, Navigate } from "react-router-dom";
// --- USER PAGES ---
import HomePage from "./pages/user/HomePage"; 
import DetailPage from "./pages/user/DetailPage";
import AboutPage from "./pages/user/AboutPage"; 

// --- AUTH & COMMON ---
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

// --- ADMIN PAGES ---
import DashboardLayout from "./pages/admin/DashboardLayout";
import Posts from "./pages/admin/Posts";
import Categories from "./pages/admin/Categories";
import AdminKomentar from "./pages/admin/AdminKomentar"; 
import CreatePostPage from "./pages/admin/CreatePostPage";
import EditPostPage from "./pages/admin/EditPostPage";

// --- LOGIKA PROTEKSI ROLE (Mencegah Admin masuk ke User Page) ---
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  // Jika dia Admin, jangan kasih lihat halaman user biasa, arahkan ke dashboard
  if (user && user.role === "admin") {
    return <Navigate to="/admin/posts" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES (Dibungkus PublicRoute agar Admin tidak masuk) --- */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/product/:id" 
        element={
          <PublicRoute>
            <DetailPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/about" 
        element={
          <PublicRoute>
            <AboutPage />
          </PublicRoute>
        } 
      />
      
      <Route path="/login" element={<Login />} />

      {/* --- PROTECTED ADMIN ROUTES --- */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="posts" replace />} />
        
        {/* Manajemen Postingan Souvenir */}
        <Route path="posts" element={<Posts />} />
        <Route path="posts/create" element={<CreatePostPage />} />
        <Route path="posts/:id" element={<EditPostPage />} />
        
        {/* Manajemen Kategori Produk */}
        <Route path="categories" element={<Categories />} />

        {/* Manajemen Komentar (Moderasi Diskusi Pengunjung) */}
        <Route path="comments" element={<AdminKomentar />} /> 
      </Route>

      {/* --- CATCH ALL / NOT FOUND --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}