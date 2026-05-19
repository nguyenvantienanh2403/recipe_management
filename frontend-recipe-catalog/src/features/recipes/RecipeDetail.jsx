import React from 'react';
import { Icon, InfoChip, SectionTitle } from '../../components/UIComponents';

const RecipeDetail = ({ recipe, onBack, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-card border border-slate-100 animate-fade-in">
      <div className="flex justify-between items-center mb-10 overflow-x-auto gap-4">
        <button onClick={onBack} className="flex items-center gap-2.5 text-azure hover:text-sky-700 font-bold transition p-2 hover:bg-sky-50 rounded-lg whitespace-nowrap">
          <Icon name="back" /> Quay lại danh sách
        </button>
        <div className="flex gap-4 items-center">
          <button onClick={onEdit} className="bg-blue-50 text-blue-700 hover:bg-blue-500 hover:text-white px-5 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-sm"><Icon name="edit" /> Sửa</button>
          <button onClick={() => onDelete(recipe.id)} className="bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white px-5 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-sm"><Icon name="delete" /> Xóa</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div><img src={recipe.image || 'https://via.placeholder.com/600x400'} alt={recipe.name} className="w-full h-[450px] object-cover rounded-3xl shadow-xl border border-white" /></div>
        <div>
          <h2 className="text-5xl font-extrabold text-slate-950 mb-6 leading-tight">{recipe.name}</h2>
          <div className="flex flex-wrap gap-4 mb-10 bg-pastel p-6 rounded-2xl border border-white">
            <InfoChip icon="⏱" label={`Tổng: ${recipe.prepTimeMinutes + (recipe.cookTimeMinutes || 0)} phút`} color="orange" />
            <InfoChip icon="🍽️" label={`Khẩu phần: ${recipe.servings} người`} color="green" />
            <InfoChip icon="🔥" label={`Độ khó: ${recipe.difficulty}`} color="ruby" />
            <InfoChip icon="🌏" label={recipe.cuisine || 'Việt Nam'} color="azure" />
          </div>
          <SectionTitle title="Nguyên liệu cần có" color="azure" />
          <ul className="space-y-3 mb-10 pl-2 text-lg text-slate-700 list-none">
            {recipe.ingredients?.map((ing, i) => <li key={i} className="flex items-center gap-3"><span className="text-teal font-bold">✔</span> {ing}</li>)}
          </ul>
          <SectionTitle title="Cách nấu chi tiết" color="azure" />
          <ol className="space-y-5 text-lg text-slate-700 list-none pl-2">
            {recipe.instructions?.map((step, i) => <li key={i} className="flex items-start gap-4"><span className="flex-shrink-0 w-8 h-8 bg-sky-100 text-azure rounded-full flex items-center justify-center font-bold mt-0.5">{i + 1}</span> {step}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
};
export default RecipeDetail;