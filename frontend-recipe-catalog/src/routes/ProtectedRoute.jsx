import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protected Route - chặn truy cập nếu chưa đăng nhập
 * Dùng bọc quanh các route cần authentication
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center py-20 text-teal font-bold animate-pulse">Đang kiểm tra đăng nhập...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
