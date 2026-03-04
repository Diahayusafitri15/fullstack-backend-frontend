import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/user/HomePage"; 
import DetailPage from "./pages/user/DetailPage";
import Login from "./pages/Login";
import DashboardLayout from "./pages/admin/DashboardLayout";
import Posts from "./pages/admin/Posts";
import Categories from "./pages/admin/Categories";
import CreatePostPage from "./pages/admin/CreatePostPage";
import EditPostPage from "./pages/admin/EditPostPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound"; // Import file baru

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<DetailPage />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="posts" replace />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/create" element={<CreatePostPage />} />
        <Route path="posts/:id" element={<EditPostPage />} />
        <Route path="categories" element={<Categories />} />
      </Route>

      {/* --- CATCH ALL / NOT FOUND --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}