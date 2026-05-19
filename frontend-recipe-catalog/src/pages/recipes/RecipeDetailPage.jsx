import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeAPI, commentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favorites, toggleFavorite } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recipeRes, commentRes] = await Promise.all([
        recipeAPI.getById(id),
        commentAPI.getByRecipe(id),
      ]);
      setRecipe(recipeRes.data);
      setComments(commentRes.data || []);
    } catch { toast.error('Lỗi tải dữ liệu'); navigate('/'); }
    finally { setLoading(false); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await commentAPI.create({ content: commentText, rating, recipeId: parseInt(id) });
      toast.success('Đã thêm bình luận! 💬');
      setCommentText(''); setRating(5);
      loadData();
    } catch { toast.error('Lỗi thêm bình luận'); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Xóa bình luận này?')) return;
    try {
      await commentAPI.delete(commentId);
      toast.success('Đã xóa bình luận');
      loadData();
    } catch { toast.error('Không có quyền xóa'); }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa món ăn này?')) return;
    try {
      await recipeAPI.delete(id);
      toast.success('Đã xóa công thức');
      navigate('/');
    } catch { toast.error('Lỗi xóa'); }
  };

  if (loading) return <div className="text-center text-teal font-bold text-xl py-20 animate-pulse">Đang tải... 🍜</div>;
  if (!recipe) return <div className="text-center py-20">Không tìm thấy công thức</div>;

  const isFav = favorites.includes(recipe.id);

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-card border border-slate-100 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-azure hover:text-sky-700 font-bold transition">
          ← Quay lại
        </button>
        <div className="flex gap-3 items-center flex-wrap">
          <button onClick={() => toggleFavorite(recipe.id)} className={`px-4 py-2 rounded-xl font-bold transition border-2 cursor-pointer text-sm ${isFav ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            {isFav ? '❤️ Đã yêu thích' : '🤍 Yêu thích'}
          </button>
          {(user?.role === 'ROLE_ADMIN' || user?.id === recipe.userId) && (
            <>
              <Link to={`/recipes/edit/${recipe.id}`} className="bg-blue-50 text-blue-700 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-xl font-bold transition text-sm">✏️ Sửa</Link>
              <button onClick={handleDelete} className="bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl font-bold transition cursor-pointer text-sm">🗑️ Xóa</button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <img src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'} alt={recipe.name} className="w-full h-64 sm:h-96 object-cover rounded-2xl shadow-xl" />
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mb-2">{recipe.name}</h2>
          {recipe.categoryName && <span className="inline-block bg-teal text-white text-xs font-bold px-3 py-1 rounded-full mb-4">{recipe.categoryName}</span>}
          {recipe.description && <p className="text-slate-600 mb-6">{recipe.description}</p>}

          <div className="flex flex-wrap gap-3 mb-8 bg-pastel p-4 rounded-xl border border-white">
            <span className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full font-semibold text-sm">⏱ {recipe.prepTimeMinutes + (recipe.cookTimeMinutes||0)} phút</span>
            <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-semibold text-sm">🍽️ {recipe.servings} người</span>
            <span className="bg-ruby-100 text-ruby-800 px-3 py-1.5 rounded-full font-semibold text-sm">🔥 {recipe.difficulty}</span>
            <span className="bg-sky-100 text-azure px-3 py-1.5 rounded-full font-semibold text-sm">🌏 {recipe.cuisine}</span>
            {recipe.averageRating > 0 && <span className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full font-semibold text-sm">⭐ {recipe.averageRating.toFixed(1)} ({recipe.totalComments} đánh giá)</span>}
          </div>

          <h3 className="text-xl font-bold border-b-2 pb-2 mb-4 border-sky-100 text-azure">Nguyên liệu</h3>
          <ul className="space-y-2 mb-8 text-slate-700">
            {recipe.ingredients?.map((ing, i) => <li key={i} className="flex items-center gap-2"><span className="text-teal font-bold">✔</span> {ing}</li>)}
          </ul>

          <h3 className="text-xl font-bold border-b-2 pb-2 mb-4 border-sky-100 text-azure">Cách nấu</h3>
          <ol className="space-y-3 text-slate-700">
            {recipe.instructions?.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-sky-100 text-azure rounded-full flex items-center justify-center font-bold text-sm">{i+1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12 border-t border-slate-100 pt-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">💬 Bình luận & Đánh giá ({comments.length})</h3>

        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="bg-pastel p-6 rounded-xl mb-8 border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-sm text-slate-700">Đánh giá:</span>
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" onClick={() => setRating(s)} className={`text-2xl cursor-pointer transition hover:scale-110 ${s <= rating ? 'opacity-100' : 'opacity-30'}`}>⭐</button>
            ))}
          </div>
          <div className="flex gap-3">
            <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Viết bình luận..." className="flex-1 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal transition bg-white text-sm" />
            <button type="submit" className="bg-teal hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-bold transition cursor-pointer text-sm">Gửi</button>
          </div>
        </form>

        {/* Comment list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-slate-400 text-center py-6">Chưa có bình luận nào. Hãy là người đầu tiên! 🌟</p>
          ) : comments.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-sm">👤 {c.userName}</span>
                    <span className="text-yellow-500 text-sm">{'⭐'.repeat(c.rating)}</span>
                  </div>
                  <p className="text-slate-600 text-sm">{c.content}</p>
                  <p className="text-slate-400 text-xs mt-1">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                {(user?.id === c.userId || user?.role === 'ROLE_ADMIN') && (
                  <button onClick={() => handleDeleteComment(c.id)} className="text-slate-400 hover:text-rose-500 cursor-pointer text-sm">🗑️</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default RecipeDetailPage;
