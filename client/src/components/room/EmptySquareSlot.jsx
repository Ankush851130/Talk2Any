import React from 'react';
import { FiUserPlus } from 'react-icons/fi';

const EmptySquareSlot = ({ slotIndex, totalSlots, onInvite }) => {
  return (
    <div
      onClick={onInvite}
      className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl bg-slate-900/40 backdrop-blur-sm border-2 border-dashed border-slate-800/90 hover:border-blue-500/60 transition-all duration-300 flex flex-col items-center justify-center p-2 text-center group cursor-pointer flex-shrink-0 shadow-sm hover:shadow-blue-500/10 hover:bg-slate-900/60 select-none"
    >
      <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/60 group-hover:border-blue-500/60 group-hover:bg-blue-600/20 text-slate-400 group-hover:text-blue-400 flex items-center justify-center mb-1 transition-all group-hover:scale-110">
        <FiUserPlus className="w-4 h-4" />
      </div>

      <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">
        Slot {slotIndex}
      </span>

      <span className="text-[9px] text-blue-400 font-semibold mt-0.5">
        + Invite
      </span>
    </div>
  );
};

export default EmptySquareSlot;
