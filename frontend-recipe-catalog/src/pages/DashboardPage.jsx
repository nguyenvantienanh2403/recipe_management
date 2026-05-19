import React, { useState, useEffect } from 'react';
import { recipeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { favorites } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipeAPI.getAllNoPagination().then(r => setRecipes(r.data || [])).catch(() => { }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-teal font-bold text-xl py-20 animate-pulse">Đang tải... 📊</div>;

  const diffCount = { 'Dễ': 0, 'Trung bình': 0, 'Khó': 0 };
  const cuisineCount = {};
  const categoryCount = {};
  recipes.forEach(r => {
    if (r.difficulty && diffCount[r.difficulty] !== undefined) diffCount[r.difficulty]++;
    const c = r.cuisine || 'Việt Nam';
    cuisineCount[c] = (cuisineCount[c] || 0) + 1;
    const cat = r.categoryName || 'Chưa phân loại';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const pieData = [
    { name: 'Dễ', value: diffCount['Dễ'], color: '#0ea5e9' },
    { name: 'TB', value: diffCount['Trung bình'], color: '#f59e0b' },
    { name: 'Khó', value: diffCount['Khó'], color: '#e11d48' },
  ].filter(d => d.value > 0);

  const barData = Object.keys(categoryCount).map(k => ({ name: k, count: categoryCount[k] }));
  const avgCook = recipes.length > 0 ? Math.round(recipes.reduce((a, r) => a + (r.cookTimeMinutes || 0), 0) / recipes.length) : 0;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6">📊 Tổng Quan Hệ Thống</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tổng công thức', value: recipes.length, unit: 'món', color: 'border-l-teal' },
          { label: 'Yêu thích', value: favorites.length, unit: 'món', color: 'border-l-fuchsia-600' },
          { label: 'Thời gian TB', value: avgCook, unit: 'phút', color: 'border-l-orange-500' },
          { label: 'Danh mục', value: Object.keys(categoryCount).length, unit: 'loại', color: 'border-l-blue-500' },
        ].map((s, i) => (
          <div key={i} className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 ${s.color}`}>
            <p className="text-slate-500 font-bold text-sm mb-1">{s.label}</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{s.value} <span className="text-sm font-normal text-slate-400">{s.unit}</span></h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Tỷ lệ theo Độ Khó</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip /><Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Phân bố theo Danh Mục</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: '#f0faff' }} />
              <Bar dataKey="count" fill="#008080" radius={[6, 6, 0, 0]} name="Số lượng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
