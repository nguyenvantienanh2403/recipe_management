import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recipeAPI, categoryAPI, ingredientAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Biểu mẫu tạo/sửa công thức món ăn chuẩn hóa
 * - Sử dụng chọn nguyên liệu chuẩn từ danh sách có sẵn (Dynamic Rows)
 * - Tự động ngăn chặn chọn trùng lặp nguyên liệu giữa các dòng
 */
const RecipeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [categories, setCategories] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]); // Danh sách nguyên liệu chuẩn từ API
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', image: '', description: '',
    prepTimeMinutes: 0, cookTimeMinutes: 0, servings: 1,
    difficulty: 'Dễ', cuisine: 'Việt Nam',
    instructions: '', categoryId: '',
  });

  // State quản lý danh sách nguyên liệu động
  const [recipeIngredients, setRecipeIngredients] = useState([
    { ingredientId: '', quantity: '' }
  ]);

  useEffect(() => {
    // Tải danh mục + nguyên liệu chuẩn
    categoryAPI.getAll().then(r => setCategories(r.data)).catch(() => {});
    ingredientAPI.getAll().then(r => setIngredientsList(r.data || [])).catch(() => {});
    
    if (isEditing) loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const res = await recipeAPI.getById(id);
      const r = res.data;
      setForm({
        name: r.name || '',
        image: r.image || '',
        description: r.description || '',
        prepTimeMinutes: r.prepTimeMinutes || 0,
        cookTimeMinutes: r.cookTimeMinutes || 0,
        servings: r.servings || 1,
        difficulty: r.difficulty || 'Dễ',
        cuisine: r.cuisine || 'Việt Nam',
        instructions: (r.instructions || []).join('\n'),
        categoryId: r.categoryId || '',
      });

      // Tải nguyên liệu quan hệ từ backend
      if (r.recipeIngredients && r.recipeIngredients.length > 0) {
        setRecipeIngredients(
          r.recipeIngredients.map(ri => ({
            ingredientId: ri.ingredientId ? String(ri.ingredientId) : '',
            quantity: ri.quantity || '',
          }))
        );
      } else {
        setRecipeIngredients([{ ingredientId: '', quantity: '' }]);
      }
    } catch {
      toast.error('Lỗi tải công thức');
      navigate('/');
    }
  };

  // Quản lý thêm/sửa/xóa dòng nguyên liệu
  const addIngredientRow = () => {
    setRecipeIngredients([...recipeIngredients, { ingredientId: '', quantity: '' }]);
  };

  const removeIngredientRow = (index) => {
    if (recipeIngredients.length === 1) return;
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...recipeIngredients];
    updated[index][field] = value;
    setRecipeIngredients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra dòng trống
    if (recipeIngredients.some(item => !item.ingredientId)) {
      toast.error('Vui lòng chọn đầy đủ nguyên liệu cho tất cả các dòng!');
      return;
    }

    // 2. Logic kiểm tra chống chọn trùng lặp nguyên liệu trên nhiều dòng
    const ingredientIds = recipeIngredients.map(item => item.ingredientId);
    const uniqueIds = new Set(ingredientIds);
    if (uniqueIds.size !== ingredientIds.length) {
      toast.error('Lỗi: Bạn đã chọn trùng nguyên liệu giữa các dòng khác nhau!');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...form,
        instructions: form.instructions.split('\n').filter(i => i.trim()),
        categoryId: form.categoryId || null,
        recipeIngredients: recipeIngredients.map(ri => ({
          ingredientId: parseInt(ri.ingredientId),
          quantity: ri.quantity || ''
        }))
      };

      if (isEditing) {
        await recipeAPI.update(id, data);
        toast.success('Cập nhật công thức thành công! ✅');
      } else {
        await recipeAPI.create(data);
        toast.success('Thêm món mới thành công! 🎉');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi lưu công thức');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-card border border-slate-100 animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isEditing ? '✏️ Cập Nhật Công Thức' : '🍳 Thêm Món Ăn Mới'}
        </h2>
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-rose-500 text-2xl font-bold p-2 rounded-full hover:bg-rose-50 transition cursor-pointer">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên món ăn */}
        <div>
          <label className="block font-bold mb-1.5 text-slate-800 text-sm">Tên món ăn *</label>
          <input required value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="VD: Phở Bò Hà Nội..." className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm" />
        </div>

        {/* Link ảnh + Danh mục */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-bold mb-1.5 text-slate-800 text-sm">Link ảnh</label>
            <input value={form.image} onChange={e => updateField('image', e.target.value)} placeholder="https://..." className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm" />
          </div>
          <div>
            <label className="block font-bold mb-1.5 text-slate-800 text-sm">Danh mục</label>
            <select value={form.categoryId} onChange={e => updateField('categoryId', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm cursor-pointer">
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Mô tả ngắn */}
        <div>
          <label className="block font-bold mb-1.5 text-slate-800 text-sm">Mô tả ngắn</label>
          <input value={form.description} onChange={e => updateField('description', e.target.value)} placeholder="Mô tả tóm tắt hương vị..." className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm" />
        </div>

        {/* Các trường số liệu */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-pastel p-5 rounded-xl border border-slate-100">
          <div>
            <label className="block font-bold mb-1 text-slate-800 text-xs">Chuẩn bị (phút)</label>
            <input type="number" value={form.prepTimeMinutes} onChange={e => updateField('prepTimeMinutes', parseInt(e.target.value)||0)} className="w-full border border-slate-200 rounded-lg p-3 outline-none bg-white text-sm" />
          </div>
          <div>
            <label className="block font-bold mb-1 text-slate-800 text-xs">Nấu (phút)</label>
            <input type="number" value={form.cookTimeMinutes} onChange={e => updateField('cookTimeMinutes', parseInt(e.target.value)||0)} className="w-full border border-slate-200 rounded-lg p-3 outline-none bg-white text-sm" />
          </div>
          <div>
            <label className="block font-bold mb-1 text-slate-800 text-xs">Khẩu phần</label>
            <input type="number" value={form.servings} onChange={e => updateField('servings', parseInt(e.target.value)||1)} className="w-full border border-slate-200 rounded-lg p-3 outline-none bg-white text-sm" />
          </div>
          <div>
            <label className="block font-bold mb-1 text-slate-800 text-xs">Độ khó</label>
            <select value={form.difficulty} onChange={e => updateField('difficulty', e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 outline-none bg-white text-sm cursor-pointer">
              {['Dễ','Trung bình','Khó'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Khu vực Chọn Nguyên Liệu Chuẩn Hóa (Dynamic Rows) */}
        <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
          <div className="flex justify-between items-center mb-4">
            <label className="block font-extrabold text-slate-800 text-sm">🥬 Danh sách nguyên liệu chuẩn *</label>
            <button
              type="button"
              onClick={addIngredientRow}
              className="inline-flex items-center gap-1 text-teal hover:text-sky-700 text-xs font-bold transition cursor-pointer border border-teal/30 hover:border-sky-700 bg-white px-3 py-1.5 rounded-lg shadow-sm"
            >
              ➕ Thêm nguyên liệu
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {recipeIngredients.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white p-3 rounded-xl border border-slate-200 animate-fade-in-up">
                {/* dropdown nguyên liệu */}
                <div className="flex-1">
                  <select
                    required
                    value={item.ingredientId}
                    onChange={e => handleIngredientChange(index, 'ingredientId', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none text-sm cursor-pointer focus:border-teal bg-white"
                  >
                    <option value="">-- Chọn nguyên liệu --</option>
                    {ingredientsList.map(ing => {
                      // Kiểm tra xem nguyên liệu này đã bị chọn ở dòng khác chưa
                      const isChosenElsewhere = recipeIngredients.some((ri, riIndex) => riIndex !== index && ri.ingredientId === String(ing.id));
                      return (
                        <option 
                          key={ing.id} 
                          value={ing.id}
                          disabled={isChosenElsewhere}
                        >
                          {ing.name} {isChosenElsewhere ? ' (Đã chọn)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Ô nhập số lượng / định lượng */}
                <div className="w-full sm:w-60">
                  <input
                    type="text"
                    required
                    value={item.quantity}
                    onChange={e => handleIngredientChange(index, 'quantity', e.target.value)}
                    placeholder="VD: 500g, 2 muỗng canh..."
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none text-sm focus:border-teal"
                  />
                </div>

                {/* Nút xóa dòng */}
                <button
                  type="button"
                  onClick={() => removeIngredientRow(index)}
                  disabled={recipeIngredients.length === 1}
                  className="px-3 py-2.5 rounded-lg text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent font-bold transition flex justify-center items-center cursor-pointer text-sm"
                  title="Xóa nguyên liệu này"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cách làm */}
        <div>
          <label className="block font-bold mb-1.5 text-slate-800 text-sm">Cách làm (mỗi dòng 1 bước)</label>
          <textarea rows="6" required value={form.instructions} onChange={e => updateField('instructions', e.target.value)} placeholder="Bước 1: Sơ chế...&#10;Bước 2: Nấu nước dùng..." className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm" />
        </div>

        {/* Nút lưu */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" disabled={loading} className="px-8 py-3 rounded-full text-white font-bold transition shadow-md cursor-pointer text-sm bg-teal hover:bg-sky-700 disabled:opacity-50">
            {loading ? '⏳ Đang lưu...' : isEditing ? '🔄 Cập nhật công thức' : '💾 Lưu món mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeFormPage;
