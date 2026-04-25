import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CarDetailPage from "./pages/CarDetailPage";
import DashboardPage from "./pages/DashboardPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCarsPage from "./pages/admin/AdminCarsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

// Navbar
import Navbar from "./components/Navbar";

// Route Guards
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontSize: "1.2rem"
  }}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin" />;
}

function AppRoutes() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(30,30,60,0.95)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><HomePage /></>} />
        <Route path="/car/:id" element={<><Navbar /><CarDetailPage /></>} />
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />

        {/* Private Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute><Navbar /><DashboardPage /></PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }>
          <Route path="dashboard" element={<AdminCarsPage />} />
          <Route path="cars" element={<AdminCarsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}