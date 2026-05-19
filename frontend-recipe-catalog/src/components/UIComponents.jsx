import React from 'react';

export const Icon = ({ name }) => {
  const icons = {
    search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    heartEmpty: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    heartFull: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
    edit: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    delete: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    plus: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
    back: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    chart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  };
  return icons[name] || null;
};

export const TabButton = ({ active, onClick, label, color = "azure" }) => {
  const activeClasses = { mustard: "bg-white text-mustard-700 shadow-sm", fuchsia: "bg-white text-fuchsia-700 shadow-sm", azure: "bg-white text-azure shadow-sm" };
  return <button onClick={onClick} className={`px-7 py-3 rounded-full font-bold transition flex items-center gap-2 w-full lg:w-auto justify-center whitespace-nowrap ${active ? activeClasses[color] : "text-slate-500 hover:text-slate-800"}`}>{label}</button>;
};

export const FormInput = ({ label, ...props }) => (<div><label className="block font-bold mb-1.5 text-slate-800">{label}</label><input className="w-full border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-sky-100 focus:border-teal outline-none transition text-lg bg-pastel placeholder:text-slate-400" {...props} /></div>);
export const FormSelect = ({ label, options, ...props }) => (<div><label className="block font-bold mb-1.5 text-slate-800">{label}</label><select className="w-full border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-sky-100 focus:border-teal outline-none transition text-lg bg-pastel" {...props}>{options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>);
export const FormTextarea = ({ label, ...props }) => (<div><label className="block font-bold mb-1.5 text-slate-800">{label}</label><textarea className="w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-sky-100 focus:border-teal outline-none transition text-lg bg-pastel placeholder:text-slate-400" {...props}></textarea></div>);
export const SectionTitle = ({ title, color="slate" }) => <h3 className={`text-2xl font-bold border-b-2 pb-3 mb-5 mt-8 ${color === 'azure' ? 'border-sky-100 text-azure' : 'border-slate-100 text-slate-900'}`}>{title}</h3>;

export const InfoChip = ({ icon, label, color }) => {
  const colors = { orange: "bg-orange-100 text-orange-800", green: "bg-green-100 text-green-800", ruby: "bg-ruby-100 text-ruby-800", azure: "bg-sky-100 text-azure", slate: "bg-slate-100 text-slate-800" };
  return <span className={`${colors[color]} px-4 py-2 rounded-full font-semibold text-base flex items-center gap-2 shadow-inner border border-white`}><span>{icon}</span> {label}</span>;
};

export const InfoChipLabel = ({ icon, label, color }) => <span className={`${color === 'orange' ? 'bg-orange-50 text-orange-700' : 'bg-ruby-50 text-ruby-700'} px-2.5 py-1 rounded-md font-medium text-xs flex items-center gap-1.5`}><span>{icon}</span> {label}</span>;