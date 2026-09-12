import React from 'react';
import { FiUserPlus, FiCopy } from 'react-icons/fi';

const EmptySquareSlot = ({ slotIndex, totalSlots, onInvite }) => {
  return (
    <div
      onClick={onInvite}
      className="relative aspect-square w-36 sm:w-44 md:w-48 lg:w-52 rounded-2xl sm:rounded-3xl bg-slate-900/40 backdrop-blur-sm border-2 border-dashed border-slate-800/90 hover:border-indigo-500/60 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center group cursor-pointer flex-shrink-0 shadow-sm hover:shadow-indigo-500/10 hover:bg-slate-900/60"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800/60 border border-slate-700/60 group-hover:border-indigo-500/60 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 flex items-center justify-center mb-2 transition-all group-hover:scale-110">
        <FiUserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
        Slot {slotIndex} of {totalSlots}
      </span>

      <span className="text-[11px] text-slate-500 mt-0.5 mb-2 font-medium">
        Waiting for member...
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onInvite();
        }}
        className="px-2.5 py-1 rounded-xl bg-slate-800 group-hover:bg-indigo-600 border border-slate-700 group-hover:border-indigo-500 text-[11px] font-semibold text-slate-300 group-hover:text-white transition-all flex items-center space-x-1 shadow-sm"
      >
        <FiCopy className="w-3 h-3 text-indigo-400 group-hover:text-white" />
        <span>Invite</span>
      </button>
    </div>
  );
};

export default EmptySquareSlot;
