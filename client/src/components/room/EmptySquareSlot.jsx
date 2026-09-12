import React from 'react';
import { FiUserPlus } from 'react-icons/fi';

const EmptySquareSlot = ({ slotIndex, totalSlots, onInvite }) => {
  return (
    <div
      onClick={onInvite}
      className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-slate-900/40 backdrop-blur-md border-2 border-dashed border-slate-800 hover:border-indigo-500/80 transition-all duration-300 flex flex-col items-center justify-center p-2 text-center group cursor-pointer flex-shrink-0 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:bg-slate-900/70 select-none hover:scale-105"
    >
      <div className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700/60 group-hover:border-indigo-400 group-hover:bg-indigo-600/30 text-slate-400 group-hover:text-indigo-300 flex items-center justify-center mb-1 transition-all group-hover:scale-110 shadow-sm">
        <FiUserPlus className="w-4 h-4" />
      </div>

      <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">
        Slot {slotIndex}
      </span>

      <span className="text-[9px] text-indigo-400 font-extrabold mt-0.5 tracking-wide uppercase">
        + Invite
      </span>
    </div>
  );
};

export default EmptySquareSlot;
