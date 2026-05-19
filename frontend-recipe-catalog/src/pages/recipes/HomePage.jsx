import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI, categoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { favorites, toggleFavorite } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 8;

  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 400);
    return () => clearTimeout(t);
  }, [keyword]);

  useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.data)).catch(() => {}); }, []);
  useEffect(() => { fetchRecipes(); }, [debouncedKeyword, categoryId, page]);
  useEffect(() => { setPage(0); }, [debouncedKeyword, categoryId]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = { page, size };
      if (debouncedKeyword) params.keyword = debouncedKeyword;
      if (categoryId) params.categoryId = categoryId;
      const res = await recipeAPI.getAll(params);
      setRecipes(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch { toast.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  };

  const handleFav = async (id) => {
    try {
      const added = await toggleFavorite(id);
      toast.success(added ? '❤️ Đã thêm yêu thích!' : '💔 Đã bỏ yêu thích');
    } catch { toast.error('Lỗi'); }
  };

  const colors = ['bg-teal hover:bg-sky-700','bg-mustard-600 hover:bg-mustard-700','bg-fuchsia-600 hover:bg-fuchsia-700','bg-coral hover:bg-orange-600'];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-8 gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button onClick={() => setCategoryId('')} className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition cursor-pointer ${!categoryId ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Tất cả</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCategoryId(c.id)} className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition cursor-pointer ${categoryId === c.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{c.name}</button>
          ))}
        </div>
        <div className="relative w-full lg:w-80 flex-shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🔍</span>
          <input type="text" placeholder="Tìm món ăn..." value={keyword} onChange={e => setKeyword(e.target.value)} className="w-full py-3 pl-11 pr-4 rounded-full border border-slate-200 focus:border-teal outline-none transition bg-pastel text-sm" />
        </div>
      </div>

      <p className="text-slate-500 text-sm font-medium mb-6">Tìm thấy <span className="text-teal font-bold">{totalElements}</span> công thức</p>

      {loading ? (
        <div className="text-center text-teal font-bold text-xl py-20 animate-pulse">Đang tải... 🍜</div>
      ) : recipes.length === 0 ? (
        <div className="text-center text-slate-500 py-20 text-xl bg-white rounded-2xl border border-slate-100">
          {keyword ? `Không tìm thấy "${keyword}" 😢` : 'Chưa có món ăn nào.'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((r, i) => (
              <div key={r.id} className="bg-white rounded-2xl shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col group">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img src={r.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} alt={r.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  {r.categoryName && <span className="absolute top-3 left-3 bg-white/90 text-teal text-xs font-bold px-3 py-1 rounded-full">{r.categoryName}</span>}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{r.name}</h3>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs font-medium">⏱ {r.prepTimeMinutes + (r.cookTimeMinutes||0)} ph</span>
                    <span className="bg-ruby-50 text-ruby-700 px-2 py-0.5 rounded text-xs font-medium">🔥 {r.difficulty||'Dễ'}</span>
                    {r.averageRating > 0 && <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs font-medium">⭐ {r.averageRating.toFixed(1)}</span>}
                  </div>
                  {r.description && <p className="text-slate-500 text-xs mb-3 line-clamp-2">{r.description}</p>}
                  <div className="mt-auto flex gap-2">
                    <Link to={`/recipes/${r.id}`} className={`flex-1 ${colors[i%4]} text-white font-bold py-2.5 rounded-xl transition text-center text-sm`}>Xem chi tiết</Link>
                    <button onClick={() => handleFav(r.id)} className={`px-3 py-2.5 rounded-xl font-bold transition border-2 cursor-pointer ${favorites.includes(r.id) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200'}`}>
                      {favorites.includes(r.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10 bg-white w-max mx-auto p-2 rounded-full shadow-sm border border-slate-200">
              <button onClick={() => setPage(p => Math.max(p-1,0))} disabled={page===0} className="px-4 py-2 rounded-full font-bold transition disabled:opacity-40 hover:bg-slate-100 text-slate-700 text-sm cursor-pointer">← Trước</button>
              <span className="font-extrabold text-teal px-3 bg-pastel py-1.5 rounded-full text-sm">{page+1}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(p+1,totalPages-1))} disabled={page>=totalPages-1} className="px-4 py-2 rounded-full font-bold transition disabled:opacity-40 hover:bg-slate-100 text-slate-700 text-sm cursor-pointer">Sau →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default HomePage;
