import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, favorites, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-teal rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">{user?.name}</h2>
          <p className="text-slate-500">{user?.email}</p>
          <span className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-bold ${user?.role === 'ROLE_ADMIN' ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'}`}>
            {user?.role === 'ROLE_ADMIN' ? '👑 Admin' : '👤 User'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-pastel p-4 rounded-xl text-center border border-slate-100">
            <p className="text-3xl font-extrabold text-teal">{favorites.length}</p>
            <p className="text-slate-500 text-sm font-medium">Yêu thích</p>
          </div>
          <div className="bg-pastel p-4 rounded-xl text-center border border-slate-100">
            <p className="text-3xl font-extrabold text-coral">{user?.role === 'ROLE_ADMIN' ? '∞' : '✓'}</p>
            <p className="text-slate-500 text-sm font-medium">Quyền hạn</p>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold transition cursor-pointer">
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
};
export default ProfilePage;
