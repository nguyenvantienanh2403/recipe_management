import React, { useState } from 'react';
import { FormInput } from '../../components/UIComponents';

const LoginRegisterForm = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(name, email, password);
      setIsLogin(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-pastel flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-12 rounded-3xl shadow-login w-full max-w-lg border border-slate-100 animate-fade-in-up">
        <div className="text-center mb-10">
          <span className="text-6xl mb-3 block">🍕</span>
          <h2 className="text-4xl font-extrabold text-slate-950 mb-1">Recipe System</h2>
          <p className="text-slate-600 text-lg">Hệ thống quản lý công thức món ăn</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (<FormInput label="Tên hiển thị" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" required={!isLogin} />)}
          <FormInput type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gmail.com" required />
          <FormInput type="password" label="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
          <div className="pt-4">
            <button type="submit" className="w-full bg-teal text-white font-bold py-4 rounded-xl text-lg hover:bg-sky-700 transition shadow-lg cursor-pointer">
              {isLogin ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản'}
            </button>
          </div>
          <button type="button" onClick={() => { setIsLogin(!isLogin); setPassword(''); }} className="w-full text-azure font-bold mt-5 text-center hover:text-sky-800 transition cursor-pointer">
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegisterForm;