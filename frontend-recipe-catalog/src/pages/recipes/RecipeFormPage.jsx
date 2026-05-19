import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recipeAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Form tạo/sửa recipe - dùng chung cho cả 2 mode
 * Detect mode qua URL: /recipes/create vs /recipes/edit/:id
 */
const RecipeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', image: '', description: '',
    prepTimeMinutes: 0, cookTimeMinutes: 0, servings: 1,
    difficulty: 'Dễ', cuisine: 'Việt Nam',
    ingredients: '', instructions: '', categoryId: '',
  });

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data)).catch(() => {});
    if (isEditing) loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const res = await recipeAPI.getById(id);
      const r = res.data;
      setForm({
        name: r.name || '', image: r.image || '', description: r.description || '',
        prepTimeMinutes: r.prepTimeMinutes || 0, cookTimeMinutes: r.cookTimeMinutes || 0,
        servings: r.servings || 1, difficulty: r.difficulty || 'Dễ', cuisine: r.cuisine || 'Việt Nam',
        ingredients: (r.ingredients || []).join('\n'),
        instructions: (r.instructions || []).join('\n'),
        categoryId: r.categoryId || '',
      });
    } catch { toast.error('Lỗi tải công thức'); navigate('/'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        ingredients: form.ingredients.split('\n').filter(i => i.trim()),
        instructions: form.instructions.split('\n').filter(i => i.trim()),
        categoryId: form.categoryId || null,
      };
      if (isEditing) {
        await recipeAPI.update(id, data);
        toast.success('Cập nhật thành công! ✅');
      } else {
        await recipeAPI.create(data);
        toast.success('Thêm món mới thành công! 🎉');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi lưu công thức');
    } finally { setLoading(false); }
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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block font-bold mb-1.5 text-slate-800 text-sm">Tên món ăn *</label>
          <input required value={form.name} onChange={e => updateField('name', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm" />
        </div>

        {/* Image + Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-bold mb-1.5 text-slate-800 text-sm">Link ảnh</label>
            <input value={form.image} onChange={e => updateField('image', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm" />
          </div>
          <div>
            <label className="block font-bold mb-1.5 text-slate-800 text-sm">Danh mục</label>
            <select value={form.categoryId} onChange={e => updateField('categoryId', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm">
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-1.5 text-slate-800 text-sm">Mô tả ngắn</label>
          <input value={form.description} onChange={e => updateField('description', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm" />
        </div>

        {/* Number fields */}
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
            <select value={form.difficulty} onChange={e => updateField('difficulty', e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 outline-none bg-white text-sm">
              {['Dễ','Trung bình','Khó'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Ingredients + Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-bold mb-1.5 text-slate-800 text-sm">Nguyên liệu (mỗi dòng 1 loại)</label>
            <textarea rows="8" value={form.ingredients} onChange={e => updateField('ingredients', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm" />
          </div>
          <div>
            <label className="block font-bold mb-1.5 text-slate-800 text-sm">Cách làm (mỗi dòng 1 bước)</label>
            <textarea rows="8" value={form.instructions} onChange={e => updateField('instructions', e.target.value)} className="w-full border border-slate-200 rounded-xl p-3.5 focus:border-teal outline-none transition bg-pastel text-sm" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" disabled={loading} className={`px-8 py-3 rounded-full text-white font-bold transition shadow-md cursor-pointer text-sm disabled:opacity-50 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-coral hover:bg-orange-600'}`}>
            {loading ? '⏳ Đang lưu...' : isEditing ? '🔄 Cập nhật' : '💾 Lưu món mới'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default RecipeFormPage;
