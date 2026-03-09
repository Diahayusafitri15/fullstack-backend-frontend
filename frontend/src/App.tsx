import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/user/HomePage"; 
import DetailPage from "./pages/user/DetailPage";
import Login from "./pages/Login";
import DashboardLayout from "./pages/admin/DashboardLayout";
import Posts from "./pages/admin/Posts";
import Categories from "./pages/admin/Categories";
import AdminKomentar from "./pages/admin/AdminKomentar"; // Import halaman baru
import CreatePostPage from "./pages/admin/CreatePostPage";
import EditPostPage from "./pages/admin/EditPostPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<DetailPage />} />
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
        {/* Redirect otomatis dari /admin ke /admin/posts */}
        <Route index element={<Navigate to="posts" replace />} />
        
        {/* Manajemen Postingan */}
        <Route path="posts" element={<Posts />} />
        <Route path="posts/create" element={<CreatePostPage />} />
        <Route path="posts/:id" element={<EditPostPage />} />
        
        {/* Manajemen Kategori */}
        <Route path="categories" element={<Categories />} />

        {/* --- ROUTE MANAJEMEN KOMENTAR (BARU) --- */}
        {/* Endpoint ini akan menampilkan tabel moderasi komentar dari semua produk */}
        <Route path="comments" element={<AdminKomentar />} /> 
      </Route>

      {/* --- CATCH ALL / NOT FOUND --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}