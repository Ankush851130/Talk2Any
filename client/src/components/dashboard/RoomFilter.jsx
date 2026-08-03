import React from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';

const languagePills = [
  { name: 'Any', label: 'All', count: 50 },
  { name: 'English', label: 'English', count: 22 },
  { name: 'Hindi', label: 'Hindi', count: 8 },
  { name: 'Spanish', label: 'Spanish', count: 5 },
  { name: 'French', label: 'French', count: 4 },
  { name: 'German', label: 'German', count: 3 },
  { name: 'Japanese', label: 'Japanese', count: 3 },
  { name: 'Chinese', label: 'Chinese', count: 3 },
  { name: 'Arabic', label: 'Arabic', count: 2 },
];

const categories = ['All', 'Study', 'Programming', 'Gaming', 'Music', 'Language Exchange', 'Interview Practice', 'General'];

const RoomFilter = ({
  search,
  setSearch,
  category,
  setCategory,
  language,
  setLanguage,
  gridCols = 3,
  setGridCols,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Search Bar & Column Layout Switcher (Free4Talk Style) */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Topic & User..."
            className="w-full pl-11 pr-20 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors shadow-inner"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded-md">
            🔍 Search
          </span>
        </div>

        {/* Grid Column Layout Switcher (3x, 2x, 1x) */}
        {setGridCols && (
          <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {[3, 2, 1].map((cols) => (
              <button
                key={cols}
                onClick={() => setGridCols(cols)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  gridCols === cols
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`Show ${cols} columns`}
              >
                {cols}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Language Filter Pills Bar (Free4Talk Style) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {languagePills.map((lang) => {
          const isActive = (language === 'Any' && lang.name === 'Any') || language === lang.name;
          return (
            <button
              key={lang.name}
              onClick={() => setLanguage(lang.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 border ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30 scale-105'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{lang.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-sky-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {lang.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-500 pr-1 flex items-center space-x-1">
          <FiSliders className="w-3 h-3 text-sky-400" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              category === cat
                ? 'bg-slate-800 text-sky-300 border border-sky-500/40'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomFilter;
