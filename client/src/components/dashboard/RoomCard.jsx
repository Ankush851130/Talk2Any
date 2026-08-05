import React from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiLock, FiSettings, FiLink, FiSlash, FiHeart } from 'react-icons/fi';
import { getLanguageFlag } from '../../utils/languages';

const levelMap = {
  Beginner: 'Beginner',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
  General: 'Any Level',
  Study: 'Upper Advanced',
  Programming: 'Advanced',
  Gaming: 'Any Level',
  Music: 'Any Level',
  'Language Exchange': 'Beginner',
  'Interview Practice': 'Upper Advanced',
};

const RoomCard = ({ room, onJoin, onOpenDetails }) => {
  const participants = room.participants || [];
  const maxCount = room?.maxParticipants || 4;
  const currentCount = participants.length;
  const isFull = currentCount >= maxCount;
  const isLocked = Boolean(room?.isLocked);
  const isDisabled = isFull || isLocked;

  // Generate array of 4 slots
  const slots = Array.from({ length: maxCount });

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900/90 border border-slate-800/90 hover:border-sky-500/40 rounded-3xl p-5 flex flex-col justify-between relative shadow-xl backdrop-blur-md group"
    >
      {/* Top Bar: Language + Level + Settings Icon */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {/* Country Flag or Globe Icon */}
            <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sm">
              {getLanguageFlag(room.language)}
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm font-extrabold text-white tracking-tight">
                {room.language}
              </span>
              <span className="text-xs text-slate-400 italic font-medium">
                {room.level || levelMap[room.category] || 'Any Level'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isLocked && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold" title="Room Locked">
                Locked 🔒
              </span>
            )}
            {room.isPrivate && (
              <span className="p-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs" title="Password Protected">
                <FiLock className="w-3.5 h-3.5" />
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenDetails) onOpenDetails(room);
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 cursor-pointer"
              title="Room & Host Information"
            >
              <FiSettings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Room Title / Topic */}
        <h3 className="text-xs font-semibold text-sky-300/90 tracking-wide line-clamp-1 mb-4">
          {room.title}
        </h3>

        {/* Center 4 Participant Avatar Circles & Dashed Placeholders */}
        <div className="grid grid-cols-4 gap-3 items-center justify-items-center my-4 py-2">
          {slots.map((_, idx) => {
            const p = participants[idx];
            if (p && p.user) {
              return (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <div className="relative group/avatar">
                    <img
                      src={p.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.user.username}`}
                      alt={p.user.username}
                      className="w-14 h-14 rounded-full bg-slate-800 object-cover border-2 border-sky-400/60 shadow-lg"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online"></span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium truncate max-w-[60px] flex items-center space-x-0.5">
                    <FiHeart className="w-2.5 h-2.5 text-sky-400 inline" />
                    <span>{Math.floor(Math.random() * 150) + 12}</span>
                  </span>
                </div>
              );
            }

            return (
              /* Empty Dashed Circle Slot */
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-700/80 bg-slate-950/40 flex items-center justify-center transition-all group-hover:border-slate-600">
                </div>
                <span className="text-[10px] text-slate-600 mt-1 font-mono">empty</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Button (Free4Talk Style) */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onJoin(room)}
          disabled={isDisabled}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${isDisabled
              ? 'bg-slate-800/60 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              : 'bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-500/40 shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
        >
          {isLocked ? (
            <>
              <FiLock className="w-3.5 h-3.5 text-rose-400" />
              <span>Room is locked 🔒</span>
            </>
          ) : isFull ? (
            <>
              <FiSlash className="w-3.5 h-3.5 text-slate-500" />
              <span>This group is full.</span>
            </>
          ) : (
            <>
              <FiLink className="w-3.5 h-3.5 text-emerald-300" />
              <span>Join and talk now!</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default RoomCard;
