import { Routes, Route, Navigate } from "react-router-dom";
// --- USER PAGES ---
import HomePage from "./pages/user/HomePage"; 
import DetailPage from "./pages/user/DetailPage";
import AboutPage from "./pages/user/AboutPage"; // Menambahkan Halaman About agar tidak 404

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

export default function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      {/* Halaman utama katalog souvenir */}
      <Route path="/" element={<HomePage />} />
      
      {/* Halaman detail produk berdasarkan ID */}
      <Route path="/product/:id" element={<DetailPage />} />
      
      {/* Halaman Tentang Kami (SOUVNELA Story) */}
      <Route path="/about" element={<AboutPage />} />
      
      {/* Halaman Login & Register */}
      <Route path="/login" element={<Login />} />

      {/* --- PROTECTED ADMIN ROUTES --- */}
      {/* Menggunakan ProtectedRoute untuk memastikan hanya role ADMIN yang bisa masuk */}
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
        
        {/* Manajemen Postingan Souvenir */}
        <Route path="posts" element={<Posts />} />
        <Route path="posts/create" element={<CreatePostPage />} />
        <Route path="posts/:id" element={<EditPostPage />} />
        
        {/* Manajemen Kategori Produk */}
        <Route path="categories" element={<Categories />} />

        {/* Manajemen Komentar (Moderasi Diskusi Pengunjung) */}
        {/* Sesuai dengan permintaan tampilan diskusi di kartu produk */}
        <Route path="comments" element={<AdminKomentar />} /> 
      </Route>

      {/* --- CATCH ALL / NOT FOUND --- */}
      {/* Menampilkan pesan Oops! Tersesat Ya? jika rute tidak ditemukan */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}