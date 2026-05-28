import React, { useState, useEffect } from 'react';
import { ingredientAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Component Quản lý nguyên liệu chuẩn - Chỉ dành cho Admin
 * Hỗ trợ CRUD: Thêm nhanh, Cập nhật tên, Xóa có cascade xử lý ràng buộc
 */
const IngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Thêm mới / Chỉnh sửa
  const [newIngredientName, setNewIngredientName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    setLoading(true);
    try {
      const res = await ingredientAPI.getAll();
      setIngredients(res.data || []);
    } catch {
      toast.error('Lỗi tải danh sách nguyên liệu');
    } finally {
      setLoading(false);
    }
  };

  // Thêm nhanh nguyên liệu
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newIngredientName.trim()) {
      toast.error('Tên nguyên liệu không được để trống');
      return;
    }

    try {
      const res = await ingredientAPI.create({ name: newIngredientName.trim() });
      toast.success('Thêm nguyên liệu thành công! 🥬');
      setNewIngredientName('');
      // Reload danh sách hoặc append thủ công
      setIngredients([...ingredients, res.data]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể thêm nguyên liệu');
    }
  };

  // Chuyển chế độ Edit
  const startEdit = (ing) => {
    setEditingId(ing.id);
    setEditingName(ing.name);
  };

  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Lưu chỉnh sửa tên nguyên liệu
  const handleUpdate = async (id) => {
    if (!editingName.trim()) {
      toast.error('Tên nguyên liệu không được để trống');
      return;
    }

    try {
      const res = await ingredientAPI.update(id, { name: editingName.trim() });
      toast.success('Cập nhật nguyên liệu thành công! ✏️');
      setIngredients(ingredients.map(ing => ing.id === id ? res.data : ing));
      cancelEdit();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật nguyên liệu');
    }
  };

  // Xóa nguyên liệu
  const handleDelete = async (id, name) => {
    const doubleCheck = confirm(
      `Cảnh báo: Bạn chắc chắn muốn xóa nguyên liệu "${name}"?\nHành động này sẽ XÓA TẤT CẢ các liên kết định lượng của nguyên liệu này trong các công thức nấu ăn liên quan (Cascade Delete)!`
    );
    if (!doubleCheck) return;

    try {
      await ingredientAPI.delete(id);
      toast.success('Đã xóa nguyên liệu khỏi hệ thống! 🗑️');
      setIngredients(ingredients.filter(ing => ing.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể xóa nguyên liệu');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">🥬 Quản lý Nguyên liệu chuẩn</h3>
        <div className="text-center text-teal font-bold py-8 animate-pulse">Đang tải nguyên liệu...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">🥬 Quản lý Nguyên liệu chuẩn</h3>
        <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {ingredients.length} nguyên liệu
        </span>
      </div>

      {/* Form thêm nhanh nguyên liệu */}
      <form onSubmit={handleAdd} className="flex gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <input
          required
          type="text"
          value={newIngredientName}
          onChange={(e) => setNewIngredientName(e.target.value)}
          placeholder="Thêm nhanh nguyên liệu (VD: Thịt ba chỉ, Bơ lạt...)"
          className="flex-1 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal bg-white text-sm"
        />
        <button
          type="submit"
          className="bg-teal hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-bold transition cursor-pointer text-sm whitespace-nowrap"
        >
          ➕ Thêm mới
        </button>
      </form>

      {/* Bảng danh sách nguyên liệu */}
      <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 sticky top-0 z-10">
              <th className="text-left py-3 px-4 font-bold text-slate-600 rounded-tl-xl w-24">ID</th>
              <th className="text-left py-3 px-4 font-bold text-slate-600">Tên nguyên liệu</th>
              <th className="text-right py-3 px-4 font-bold text-slate-600 rounded-tr-xl w-48">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing, index) => {
              const isEditing = editingId === ing.id;
              return (
                <tr
                  key={ing.id}
                  className={`border-b border-slate-50 hover:bg-sky-50/50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">#{ing.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:border-teal outline-none"
                      />
                    ) : (
                      ing.name
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdate(ing.id)}
                          className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-bold hover:bg-emerald-600"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-bold hover:bg-slate-200"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(ing)}
                          className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-bold"
                          title="Sửa tên nguyên liệu"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(ing.id, ing.name)}
                          className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-bold"
                          title="Xóa nguyên liệu"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {ingredients.length === 0 && (
        <p className="text-center text-slate-400 py-6">Chưa có nguyên liệu chuẩn nào trong hệ thống.</p>
      )}
    </div>
  );
};

export default IngredientManagement;
