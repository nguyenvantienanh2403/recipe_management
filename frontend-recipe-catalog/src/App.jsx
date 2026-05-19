import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/recipes/HomePage';
import RecipeDetailPage from './pages/recipes/RecipeDetailPage';
import RecipeFormPage from './pages/recipes/RecipeFormPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

/**
 * App chính với React Router + AuthContext
 * Routes được bảo vệ bởi ProtectedRoute
 */
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />

      {/* Protected routes - cần đăng nhập */}
      <Route path="/" element={<ProtectedRoute><MainLayout><HomePage /></MainLayout></ProtectedRoute>} />
      <Route path="/recipes/:id" element={<ProtectedRoute><MainLayout><RecipeDetailPage /></MainLayout></ProtectedRoute>} />
      <Route path="/recipes/create" element={<ProtectedRoute><MainLayout><RecipeFormPage /></MainLayout></ProtectedRoute>} />
      <Route path="/recipes/edit/:id" element={<ProtectedRoute><MainLayout><RecipeFormPage /></MainLayout></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><MainLayout><FavoritesPage /></MainLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><MainLayout><AdminPage /></MainLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' },
        }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;