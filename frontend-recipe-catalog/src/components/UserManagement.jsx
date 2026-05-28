import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Component quản lý người dùng - chỉ dành cho Admin
 * Hiển thị bảng danh sách user với thông tin: ID, Tên, Email, Vai trò, Ngày tạo
 * Gọi API GET /api/users (được bảo vệ bởi @RolesAllowed("ROLE_ADMIN"))
 */
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAll();
      setUsers(res.data || []);
    } catch (err) {
      toast.error('Lỗi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hiển thị badge màu sắc theo vai trò
   */
  const getRoleBadge = (role) => {
    if (role === 'ROLE_ADMIN') {
      return (
        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
          👑 Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-800 px-3 py-1 rounded-full text-xs font-bold border border-sky-200">
        👤 User
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">👥 Quản lý Người dùng</h3>
        <div className="text-center text-teal font-bold py-8 animate-pulse">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">👥 Quản lý Người dùng</h3>
        <span className="bg-teal text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {users.length} người dùng
        </span>
      </div>

      {/* Bảng danh sách người dùng */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th className="text-left py-3 px-4 font-bold text-slate-600 rounded-tl-xl">ID</th>
              <th className="text-left py-3 px-4 font-bold text-slate-600">Tên</th>
              <th className="text-left py-3 px-4 font-bold text-slate-600">Email</th>
              <th className="text-left py-3 px-4 font-bold text-slate-600">Vai trò</th>
              <th className="text-left py-3 px-4 font-bold text-slate-600 rounded-tr-xl">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b border-slate-50 hover:bg-sky-50/50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                <td className="py-3 px-4 text-slate-500 font-mono text-xs">#{user.id}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{user.name}</td>
                <td className="py-3 px-4 text-slate-600">{user.email}</td>
                <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                <td className="py-3 px-4 text-slate-400 text-xs">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-center text-slate-400 py-6">Chưa có người dùng nào.</p>
      )}
    </div>
  );
};

export default UserManagement;
