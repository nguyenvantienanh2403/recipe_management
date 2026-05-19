import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadFavoriteRecipes(); }, [favorites]);

  const loadFavoriteRecipes = async () => {
    setLoading(true);
    try {
      const res = await recipeAPI.getAllNoPagination();
      const all = res.data || [];
      setRecipes(all.filter(r => favorites.includes(r.id)));
    } catch { } finally { setLoading(false); }
  };

  if (loading) return <div className="text-center text-teal font-bold text-xl py-20 animate-pulse">Đang tải... 🍜</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6">❤️ Món ăn yêu thích ({recipes.length})</h2>
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-xl mb-4">Bạn chưa yêu thích món ăn nào 😢</p>
          <Link to="/" className="text-azure font-bold hover:underline">← Khám phá công thức ngay</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-card hover:shadow-lg transition-all border border-slate-100 flex flex-col">
              <img src={r.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} alt={r.name} className="w-full h-48 object-cover rounded-t-2xl" />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{r.name}</h3>
                <div className="flex gap-2 mb-3">
                  <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs font-medium">⏱ {r.prepTimeMinutes + (r.cookTimeMinutes || 0)} ph</span>
                  <span className="bg-ruby-50 text-ruby-700 px-2 py-0.5 rounded text-xs font-medium">🔥 {r.difficulty}</span>
                </div>
                <div className="mt-auto flex gap-2">
                  <Link to={`/recipes/${r.id}`} className="flex-1 bg-teal hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl transition text-center text-sm">Xem chi tiết</Link>
                  <button onClick={() => toggleFavorite(r.id)} className="px-3 py-2.5 rounded-xl font-bold bg-red-50 border-2 border-red-200 text-red-500 cursor-pointer">❤️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default FavoritesPage;
