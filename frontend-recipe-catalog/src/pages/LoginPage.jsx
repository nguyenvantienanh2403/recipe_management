import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Trang Login/Register kết hợp
 * Toggle giữa 2 form bằng state isLogin
 */
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Đăng nhập thành công! 🎉');
        navigate('/');
      } else {
        await register(name, email, password);
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || (isLogin ? 'Sai email hoặc mật khẩu' : 'Lỗi khi đăng ký');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pastel flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-login w-full max-w-lg border border-slate-100 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-5xl sm:text-6xl mb-3 block">🍕</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mb-1">Recipe System</h2>
          <p className="text-slate-500 text-base sm:text-lg">Hệ thống quản lý công thức món ăn</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block font-bold mb-1.5 text-slate-800 text-sm">Tên hiển thị</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required={!isLogin}
                className="w-full border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-sky-100 focus:border-teal outline-none transition text-base bg-pastel placeholder:text-slate-400"
              />
            </div>
          )}

          <div>
            <label className="block font-bold mb-1.5 text-slate-800 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              className="w-full border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-sky-100 focus:border-teal outline-none transition text-base bg-pastel placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block font-bold mb-1.5 text-slate-800 text-sm">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="w-full border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-sky-100 focus:border-teal outline-none transition text-base bg-pastel placeholder:text-slate-400"
            />
          </div>

          {/* Demo accounts info */}
          {isLogin && (
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-sky-800">
              <p className="font-bold mb-1">🔑 Tài khoản demo:</p>
              <p>Admin: <code className="bg-sky-100 px-1 rounded">admin@gmail.com</code> / <code className="bg-sky-100 px-1 rounded">123456</code></p>
              <p>User: <code className="bg-sky-100 px-1 rounded">user@gmail.com</code> / <code className="bg-sky-100 px-1 rounded">123456</code></p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal text-white font-bold py-3.5 rounded-xl text-lg hover:bg-sky-700 transition shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? '⏳ Đang xử lý...' : isLogin ? '🚀 Đăng Nhập' : '✨ Tạo Tài Khoản'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setPassword(''); }}
            className="w-full text-azure font-bold mt-3 text-center hover:text-sky-800 transition cursor-pointer text-sm"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay →' : '← Đã có tài khoản? Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
