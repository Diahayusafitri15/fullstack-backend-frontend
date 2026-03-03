import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
// Tambahkan import halaman Home/Landing Page User di bawah ini
import Home from "./pages/user/HomePage"; 
import DashboardLayout from "./pages/admin/DashboardLayout";
import Posts from "./pages/admin/Posts";
import Categories from "./pages/admin/Categories";
import CreatePostPage from "./pages/admin/CreatePostPage";
import EditPostPage from "./pages/admin/EditPostPage";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* USER / LANDING PAGE */}
      <Route path="/" element={<Home />} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default admin → redirect ke posts */}
        <Route index element={<Navigate to="posts" replace />} />

        {/* Nested routes (JANGAN pakai /admin lagi) */}
        <Route path="posts" element={<Posts />} />
        <Route path="posts/create" element={<CreatePostPage />} />
        <Route path="posts/:id" element={<EditPostPage />} />
        <Route path="categories" element={<Categories />} />
      </Route>

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}