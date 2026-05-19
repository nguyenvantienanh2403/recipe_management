import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

/**
 * Layout chính của app - bao gồm Navbar + Footer
 * Responsive: có hamburger menu cho mobile
 */
const MainLayout = ({ children }) => {
  const { user, isAdmin, logout, favorites } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: '🏠 Trang chủ' },
    { path: '/favorites', label: `❤️ Yêu thích (${favorites.length})` },
    { path: '/dashboard', label: '📊 Thống kê' },
  ];

  if (isAdmin) {
    navLinks.push({ path: '/admin', label: '⚙️ Quản trị' });
  }

  return (
    <div className="min-h-screen bg-pastel text-slate-950 font-sans flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-teal sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 hover:opacity-90 transition">
              <span className="text-3xl sm:text-4xl">🍕</span>
              Recipe<span className="font-light text-yellow-100">DB</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full font-semibold transition text-sm ${
                    isActive(link.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side: Add + User + Logout */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/recipes/create"
                className="bg-coral hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold transition flex items-center gap-2 shadow-md text-sm"
              >
                ➕ Thêm món
              </Link>
              <Link
                to="/profile"
                className="text-white/90 hover:text-white font-semibold flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition text-sm"
              >
                👤 {user?.name || 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-full font-bold transition cursor-pointer text-sm"
              >
                Đăng xuất
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white p-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <HiX size={24} /> : <HiOutlineMenu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pb-3 border-t border-white/20 pt-3 space-y-2 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl font-semibold transition ${
                    isActive(link.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/recipes/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-bold bg-coral text-white text-center"
              >
                ➕ Thêm món mới
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-white/80 hover:bg-white/10 font-semibold"
              >
                👤 {user?.name || 'Profile'}
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-white/80 hover:bg-white/10 font-semibold cursor-pointer"
              >
                🚪 Đăng xuất
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto py-8 border-t border-slate-100 bg-teal text-center text-white">
        <p className="text-sm opacity-90">© 2026 - BTL Lập trình Java nâng cao nhóm 24-HaUI</p>
        <p className="text-xs opacity-60 mt-1">Recipe Management System v2.0</p>
      </footer>
    </div>
  );
};

export default MainLayout;
