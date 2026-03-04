import { Routes, Route, Navigate } from "react-router-dom";

// PAGES USER
import HomePage from "./pages/user/HomePage"; 
import DetailPage from "./pages/user/DetailPage";

// PAGES ADMIN
import Login from "./pages/Login";
import DashboardLayout from "./pages/admin/DashboardLayout";
import Posts from "./pages/admin/Posts";
import Categories from "./pages/admin/Categories";
import CreatePostPage from "./pages/admin/CreatePostPage";
import EditPostPage from "./pages/admin/EditPostPage";

// UTILS
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES (USER) --- */}
      {/* Halaman Utama Katalog */}
      <Route path="/" element={<HomePage />} />
      
      {/* Halaman Detail Produk */}
      <Route path="/product/:id" element={<DetailPage />} />

      {/* Halaman Login */}
      <Route path="/login" element={<Login />} />

      {/* --- PROTECTED ROUTES (ADMIN) --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default admin (saat buka /admin langsung ke /admin/posts) */}
        <Route index element={<Navigate to="posts" replace />} />

        {/* Daftar Postingan */}
        <Route path="posts" element={<Posts />} />
        
        {/* Tambah Postingan Baru */}
        <Route path="posts/create" element={<CreatePostPage />} />
        
        {/* Edit Postingan Berdasarkan ID */}
        <Route path="posts/:id" element={<EditPostPage />} />
        
        {/* Kelola Kategori */}
        <Route path="categories" element={<Categories />} />
      </Route>

      {/* --- CATCH ALL --- */}
      {/* Jika user nyasar ke URL yang tidak ada, balikkan ke Home */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}