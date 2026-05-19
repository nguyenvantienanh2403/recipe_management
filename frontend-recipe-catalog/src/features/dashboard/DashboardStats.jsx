import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardStats = ({ recipes, favorites }) => {
  const diffCount = { 'Dễ': 0, 'Trung bình': 0, 'Khó': 0 };
  const cuisineCount = {};
  
  recipes.forEach(r => {
    if (r.difficulty && diffCount[r.difficulty] !== undefined) diffCount[r.difficulty]++;
    const cuisine = r.cuisine || 'Việt Nam';
    cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
  });

  const pieData = [
    { name: 'Dễ', value: diffCount['Dễ'], color: '#0ea5e9' },
    { name: 'Trung bình', value: diffCount['Trung bình'], color: '#f59e0b' },
    { name: 'Khó', value: diffCount['Khó'], color: '#e11d48' }
  ].filter(d => d.value > 0);

  const barData = Object.keys(cuisineCount).map(key => ({ name: key, count: cuisineCount[key] }));

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6">📊 Tổng Quan Dữ Liệu Hệ Thống</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-teal">
          <p className="text-slate-500 font-bold mb-1">Tổng số công thức</p>
          <h3 className="text-4xl font-extrabold text-slate-800">{recipes.length} <span className="text-lg font-normal text-slate-400">món</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-fuchsia-600">
          <p className="text-slate-500 font-bold mb-1">Bạn đã yêu thích</p>
          <h3 className="text-4xl font-extrabold text-slate-800">{favorites.length} <span className="text-lg font-normal text-slate-400">món</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-orange-500">
          <p className="text-slate-500 font-bold mb-1">Thời gian nấu trung bình</p>
          <h3 className="text-4xl font-extrabold text-slate-800">
            {recipes.length > 0 ? Math.round(recipes.reduce((acc, r) => acc + (r.cookTimeMinutes || 0), 0) / recipes.length) : 0}
            <span className="text-lg font-normal text-slate-400"> phút/món</span>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Tỷ lệ theo Độ Khó</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Phân bố theo Quốc Gia</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <RechartsTooltip cursor={{ fill: '#f0faff' }} />
              <Bar dataKey="count" fill="#008080" radius={[8, 8, 0, 0]} name="Số lượng món" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;