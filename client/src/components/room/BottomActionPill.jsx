import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

const BottomActionPill = ({
  isHandRaised,
  onToggleHandRaise,
  onToggleTheme,
  onToggleMore,
}) => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="bg-slate-900/80 border-t border-x border-white/10 px-6 py-2.5 rounded-t-3xl flex items-center space-x-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all">
        {/* Hand Raise Toggle Button */}
        <button
          onClick={onToggleHandRaise}
          className={`p-2.5 rounded-full transition-all cursor-pointer hover:scale-110 active:scale-95 ${
            isHandRaised
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-amber-300/50 scale-110'
              : 'hover:bg-slate-800/80 text-slate-300 border border-transparent hover:border-white/10'
          }`}
          title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        >
          <span className="text-lg leading-none">✋</span>
        </button>

        {/* Color Wheel / Theme Button */}
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-full hover:bg-slate-800/80 transition-all cursor-pointer text-slate-300 border border-transparent hover:border-white/10 hover:scale-110 active:scale-95"
          title="Color Theme"
        >
          <span className="text-lg leading-none">🎨</span>
        </button>

        {/* More Options Button */}
        <button
          onClick={onToggleMore}
          className="p-2.5 rounded-full hover:bg-slate-800/80 text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer border border-transparent hover:border-white/10 hover:scale-110 active:scale-95"
          title="More Options"
        >
          <FiMoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BottomActionPill;
