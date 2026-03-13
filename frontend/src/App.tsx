import { Routes, Route, Navigate } from "react-router-dom";
import { JSX } from "react";

// --- USER PAGES ---
import HomePage from "./pages/user/HomePage"; 
import DetailPage from "./pages/user/DetailPage";
import AboutPage from "./pages/user/AboutPage"; 
import CheckoutPage from "./pages/user/CheckoutPage";
import MyOrdersPage from "./pages/user/MyOrdersPage"; 

// --- AUTH & COMMON ---
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

// --- ADMIN PAGES (PASTIKAN EXPORT-NYA DEFAULT) ---
import DashboardLayout from "./pages/admin/DashboardLayout"; 
import Posts from "./pages/admin/Posts";
import Categories from "./pages/admin/Categories";
import AdminKomentar from "./pages/admin/AdminKomentar"; 
import AdminOrders from "./pages/admin/AdminOrders"; 
import CreatePostPage from "./pages/admin/CreatePostPage";
import EditPostPage from "./pages/admin/EditPostPage";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  if (user && user.role === "admin") {
    return <Navigate to="/admin/posts" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
      <Route path="/product/:id" element={<PublicRoute><DetailPage /></PublicRoute>} />
      <Route path="/about" element={<PublicRoute><AboutPage /></PublicRoute>} />
      <Route path="/checkout/:id" element={<PublicRoute><CheckoutPage /></PublicRoute>} />
      <Route path="/my-orders" element={<PublicRoute><MyOrdersPage /></PublicRoute>} />
      <Route path="/login" element={<Login />} />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="posts" replace />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/create" element={<CreatePostPage />} />
        
        {/* GUNAKAN PATH INI AGAR TIDAK 404 */}
        <Route path="posts/edit/:id" element={<EditPostPage />} />
        
        <Route path="categories" element={<Categories />} />
        <Route path="comments" element={<AdminKomentar />} /> 
        <Route path="orders" element={<AdminOrders />} /> 
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}