import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI, categoryAPI, ingredientAPI } from '../../services/api';
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

  // === State cho tìm kiếm theo nguyên liệu tủ lạnh ===
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isIngredientSearch, setIsIngredientSearch] = useState(false);
  const [showIngredientPanel, setShowIngredientPanel] = useState(false);

  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 400);
    return () => clearTimeout(t);
  }, [keyword]);

  // Load categories + ingredients khi mount
  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data)).catch(() => {});
    ingredientAPI.getAll().then(r => setIngredients(r.data || [])).catch(() => {});
  }, []);

  // Fetch recipes bình thường (theo tên/category)
  useEffect(() => {
    if (!isIngredientSearch) fetchRecipes();
  }, [debouncedKeyword, categoryId, page, isIngredientSearch]);

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

  // Toggle chọn/bỏ chọn nguyên liệu
  const toggleIngredient = (id) => {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Tìm kiếm theo nguyên liệu đã chọn
  const searchByIngredients = async () => {
    if (selectedIngredients.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 nguyên liệu');
      return;
    }
    setLoading(true);
    setIsIngredientSearch(true);
    try {
      const res = await recipeAPI.searchByIngredients(selectedIngredients);
      setRecipes(res.data || []);
      setTotalPages(0);
      setTotalElements(res.data?.length || 0);
    } catch { toast.error('Lỗi tìm kiếm'); }
    finally { setLoading(false); }
  };

  // Xóa bộ lọc nguyên liệu, quay về tìm kiếm bình thường
  const clearIngredientSearch = () => {
    setSelectedIngredients([]);
    setIsIngredientSearch(false);
    setShowIngredientPanel(false);
    setPage(0);
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
      {/* Thanh tìm kiếm theo tên + danh mục */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-4 gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button onClick={() => { setCategoryId(''); clearIngredientSearch(); }} className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition cursor-pointer ${!categoryId && !isIngredientSearch ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Tất cả</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => { setCategoryId(c.id); if (isIngredientSearch) clearIngredientSearch(); }} className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition cursor-pointer ${categoryId === c.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{c.name}</button>
          ))}
        </div>
        <div className="flex gap-2 items-center flex-shrink-0">
          <div className="relative w-full lg:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🔍</span>
            <input type="text" placeholder="Tìm món ăn..." value={keyword} onChange={e => { setKeyword(e.target.value); if (isIngredientSearch) clearIngredientSearch(); }} className="w-full py-3 pl-11 pr-4 rounded-full border border-slate-200 focus:border-teal outline-none transition bg-pastel text-sm" />
          </div>
          <button
            onClick={() => setShowIngredientPanel(!showIngredientPanel)}
            className={`px-4 py-3 rounded-full font-bold text-sm whitespace-nowrap transition cursor-pointer border-2 ${showIngredientPanel || isIngredientSearch ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'}`}
          >
            🧊 Tủ lạnh
          </button>
        </div>
      </div>

      {/* Panel chọn nguyên liệu tủ lạnh */}
      {showIngredientPanel && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-emerald-100 mb-4 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-800">🥬 Chọn nguyên liệu trong tủ lạnh của bạn:</h3>
            {selectedIngredients.length > 0 && (
              <button onClick={() => setSelectedIngredients([])} className="text-xs text-slate-400 hover:text-rose-500 transition cursor-pointer">
                Bỏ chọn tất cả
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map(ing => {
              const isSelected = selectedIngredients.includes(ing.id);
              return (
                <button
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {isSelected && '✓ '}{ing.name}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={searchByIngredients}
              disabled={selectedIngredients.length === 0}
              className="bg-teal hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg cursor-pointer text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🔍 Tìm theo nguyên liệu ({selectedIngredients.length})
            </button>
            {isIngredientSearch && (
              <button onClick={clearIngredientSearch} className="text-sm text-slate-500 hover:text-rose-500 font-medium transition cursor-pointer">
                ✕ Xóa bộ lọc
              </button>
            )}
            {selectedIngredients.length > 0 && (
              <span className="text-xs text-slate-400">
                Đã chọn {selectedIngredients.length} nguyên liệu
              </span>
            )}
          </div>
        </div>
      )}

      {/* Thông tin kết quả */}
      <p className="text-slate-500 text-sm font-medium mb-6">
        {isIngredientSearch ? (
          <>Tìm theo nguyên liệu: <span className="text-emerald-600 font-bold">{totalElements}</span> công thức phù hợp</>
        ) : (
          <>Tìm thấy <span className="text-teal font-bold">{totalElements}</span> công thức</>
        )}
      </p>

      {loading ? (
        <div className="text-center text-teal font-bold text-xl py-20 animate-pulse">Đang tải... 🍜</div>
      ) : recipes.length === 0 ? (
        <div className="text-center text-slate-500 py-20 text-xl bg-white rounded-2xl border border-slate-100">
          {isIngredientSearch
            ? 'Không tìm thấy món ăn với nguyên liệu đã chọn 😢'
            : keyword ? `Không tìm thấy "${keyword}" 😢` : 'Chưa có món ăn nào.'}
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
          {/* Phân trang chỉ hiển thị khi tìm kiếm bình thường */}
          {!isIngredientSearch && totalPages > 1 && (
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
