import React, { useState } from 'react';
import { FiSearch, FiSliders, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { WORLD_LANGUAGES } from '../../utils/languages';

const popularLanguages = [
  { name: 'English', flag: '🇺🇸' },
  { name: 'Spanish', flag: '🇪🇸' },
  { name: 'French', flag: '🇫🇷' },
  { name: 'German', flag: '🇩🇪' },
  { name: 'Japanese', flag: '🇯🇵' },
  { name: 'Chinese', flag: '🇨🇳' },
  { name: 'Korean', flag: '🇰🇷' },
  { name: 'Hindi', flag: '🇮🇳' },
  { name: 'Arabic', flag: '🇦🇪' },
  { name: 'Russian', flag: '🇷🇺' },
  { name: 'Portuguese', flag: '🇵🇹' },
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAllLanguagesClick = () => {
    setLanguage('Any');
    setIsExpanded((prev) => !prev);
  };

  const displayLanguages = isExpanded ? WORLD_LANGUAGES : popularLanguages;

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

      {/* Language Filter Pills Bar (Inline Expandable - Free4Talk Style) */}
      <div className={`flex items-center gap-2 ${isExpanded ? 'flex-wrap' : 'overflow-x-auto scrollbar-none'} pb-1.5 transition-all`}>
        {/* All Languages Pill Button */}
        <button
          onClick={handleAllLanguagesClick}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 border ${
            language === 'Any'
              ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30 scale-105'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
          }`}
        >
          <span>🌐</span>
          <span>All Languages</span>
          {isExpanded ? (
            <FiChevronUp className="w-3.5 h-3.5 text-sky-200" />
          ) : (
            <FiChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Language Pill Buttons in Identical Design */}
        {displayLanguages.map((lang) => {
          const isActive = language === lang.name;
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
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          );
        })}

        {/* More / Less Toggle Pill */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-900 text-sky-400 border border-sky-500/30 hover:bg-sky-500/10 transition-all cursor-pointer flex items-center space-x-1"
        >
          <span>{isExpanded ? 'Show Less ▲' : `+ More (${WORLD_LANGUAGES.length}) ▼`}</span>
        </button>
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
