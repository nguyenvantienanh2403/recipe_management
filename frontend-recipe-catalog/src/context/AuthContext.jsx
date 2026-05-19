import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, favoriteAPI } from '../services/api';

// =====================================================
// Auth Context - Quản lý trạng thái đăng nhập toàn app
// Lưu: user info, token, favorites, login/logout handlers
// =====================================================
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Khởi tạo: load user info từ localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      loadFavorites();
    }
    setLoading(false);
  }, []);

  // Load danh sách yêu thích
  const loadFavorites = async () => {
    try {
      const res = await favoriteAPI.getMyFavorites();
      setFavorites(res.data.favoriteIds || []);
    } catch (err) {
      console.error('Lỗi tải yêu thích:', err);
    }
  };

  // Đăng nhập
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const data = res.data;

    const userInfo = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(userInfo));

    setToken(data.token);
    setUser(userInfo);

    // Load favorites sau khi đăng nhập
    setTimeout(loadFavorites, 100);

    return userInfo;
  };

  // Đăng ký
  const register = async (name, email, password) => {
    await authAPI.register({ name, email, password });
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setFavorites([]);
  };

  // Toggle yêu thích
  const toggleFavorite = async (recipeId) => {
    try {
      const res = await favoriteAPI.toggle(recipeId);
      if (res.data.isFavorite) {
        setFavorites((prev) => [...prev, recipeId]);
      } else {
        setFavorites((prev) => prev.filter((id) => id !== recipeId));
      }
      return res.data.isFavorite;
    } catch (err) {
      console.error('Lỗi toggle yêu thích:', err);
      throw err;
    }
  };

  // Kiểm tra role
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    favorites,
    loading,
    isAdmin,
    isAuthenticated,
    login,
    register,
    logout,
    toggleFavorite,
    loadFavorites,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
