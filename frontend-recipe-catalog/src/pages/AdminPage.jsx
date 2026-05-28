import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/UserManagement';
import IngredientManagement from '../components/IngredientManagement';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = () => {
    categoryAPI.getAll().then(r => setCategories(r.data)).catch(() => { });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoryAPI.update(editingId, newCat);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await categoryAPI.create(newCat);
        toast.success('Thêm danh mục thành công');
      }
      setNewCat({ name: '', description: '' }); setEditingId(null);
      loadCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setNewCat({ name: cat.name, description: cat.description || '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa danh mục này?')) return;
    try { await categoryAPI.delete(id); toast.success('Đã xóa'); loadCategories(); }
    catch { toast.error('Lỗi xóa danh mục'); }
  };

  if (!isAdmin) return <div className="text-center py-20 text-xl text-slate-500">⛔ Bạn không có quyền truy cập</div>;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6">⚙️ Quản trị hệ thống</h2>

      {/* User Management */}
      <div className="mb-6">
        <UserManagement />
      </div>

      {/* Category management */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">📂 Quản lý Danh mục</h3>
        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input required value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} placeholder="Tên danh mục" className="flex-1 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal bg-pastel text-sm" />
          <input value={newCat.description} onChange={e => setNewCat({ ...newCat, description: e.target.value })} placeholder="Mô tả" className="flex-1 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal bg-pastel text-sm" />
          <button type="submit" className="bg-teal hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-bold transition cursor-pointer text-sm whitespace-nowrap">
            {editingId ? '🔄 Cập nhật' : '➕ Thêm'}
          </button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setNewCat({ name: '', description: '' }); }} className="bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl font-bold transition cursor-pointer text-sm">Hủy</button>}
        </form>

        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="flex justify-between items-center bg-pastel p-4 rounded-xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">{cat.name}</p>
                {cat.description && <p className="text-slate-500 text-sm">{cat.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition cursor-pointer text-sm font-bold">✏️</button>
                <button onClick={() => handleDelete(cat.id)} className="text-rose-600 hover:bg-rose-50 px-3 py-1 rounded-lg transition cursor-pointer text-sm font-bold">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingredient Management */}
      <div className="mb-6">
        <IngredientManagement />
      </div>
    </div>
  );
};
export default AdminPage;
