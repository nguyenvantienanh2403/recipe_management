import React, { useState, useEffect } from 'react';
import { FormInput, FormSelect, FormTextarea } from '../../components/UIComponents';

const RecipeForm = ({ initialData, isEditing, onSubmit, onCancel }) => {
  const [recipe, setRecipe] = useState(initialData);

  useEffect(() => { setRecipe(initialData); }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedRecipe = {
      ...recipe,
      ingredients: typeof recipe.ingredients === 'string' ? recipe.ingredients.split('\n').filter(i => i.trim() !== '') : recipe.ingredients,
      instructions: typeof recipe.instructions === 'string' ? recipe.instructions.split('\n').filter(i => i.trim() !== '') : recipe.instructions
    };
    onSubmit(formattedRecipe);
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-card border border-slate-100 animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-4xl font-extrabold text-slate-900">{isEditing ? "Cập Nhật Công Thức" : "Thêm Món Ăn Mới"}</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-500 text-3xl font-bold p-2 rounded-full hover:bg-rose-50 transition">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput label="Tên món ăn" required value={recipe.name} onChange={e => setRecipe({ ...recipe, name: e.target.value })} />
        <FormInput label="Link ảnh món ăn" value={recipe.image} onChange={e => setRecipe({ ...recipe, image: e.target.value })} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-pastel p-6 rounded-2xl border border-slate-100">
          <FormInput type="number" label="Chuẩn bị (phút)" value={recipe.prepTimeMinutes} onChange={e => setRecipe({ ...recipe, prepTimeMinutes: parseInt(e.target.value) || 0 })} />
          <FormInput type="number" label="Nấu (phút)" value={recipe.cookTimeMinutes} onChange={e => setRecipe({ ...recipe, cookTimeMinutes: parseInt(e.target.value) || 0 })} />
          <FormInput type="number" label="Khẩu phần (người)" value={recipe.servings} onChange={e => setRecipe({ ...recipe, servings: parseInt(e.target.value) || 1 })} />
          <FormSelect label="Độ khó" value={recipe.difficulty} onChange={e => setRecipe({ ...recipe, difficulty: e.target.value })} options={['Dễ', 'Trung bình', 'Khó']} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormTextarea label="Nguyên liệu (Mỗi dòng 1 loại)" rows="8" value={recipe.ingredients} onChange={e => setRecipe({ ...recipe, ingredients: e.target.value })} />
          <FormTextarea label="Cách làm (Mỗi dòng 1 bước)" rows="8" value={recipe.instructions} onChange={e => setRecipe({ ...recipe, instructions: e.target.value })} />
        </div>
        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button type="submit" className={`px-10 py-4 rounded-full text-white font-bold text-lg transition shadow-md ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-coral hover:bg-orange-600'}`}>
            {isEditing ? "🔄 Cập nhật công thức" : "💾 Lưu món mới ngay"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default RecipeForm;