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
      <div className="bg-slate-900/90 border-t border-x border-slate-800/90 px-6 py-2 rounded-t-3xl flex items-center space-x-6 shadow-2xl backdrop-blur-md">
        {/* Hand Raise Toggle Button */}
        <button
          onClick={onToggleHandRaise}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isHandRaised
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 scale-110'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        >
          <span className="text-lg">✋</span>
        </button>

        {/* Color Wheel / Theme Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full hover:bg-slate-800 transition-all cursor-pointer text-slate-300"
          title="Color Theme"
        >
          <span className="text-lg">🎨</span>
        </button>

        {/* More Options Button */}
        <button
          onClick={onToggleMore}
          className="p-2 rounded-full hover:bg-slate-800 text-blue-400 transition-all cursor-pointer"
          title="More Options"
        >
          <FiMoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BottomActionPill;
