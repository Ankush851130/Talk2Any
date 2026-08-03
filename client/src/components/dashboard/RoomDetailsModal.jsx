import React from 'react';
import Modal from '../common/Modal';
import { FiUser, FiGlobe, FiTag, FiBarChart2, FiLock, FiShield, FiCheckCircle } from 'react-icons/fi';

const RoomDetailsModal = ({ isOpen, onClose, room, onJoin }) => {
  if (!room) return null;

  const owner = room.owner || {};
  const username = owner.username || 'Anonymous Host';
  const tagId = owner.tagId ? `#${owner.tagId}` : `@${username.toLowerCase()}`;
  const avatarUrl = owner.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
  const country = owner.country || 'Global';
  const bio = owner.bio || 'Talk2Any community member';
  const spokenLanguages = owner.languages?.spoken || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Room & Creator Information">
      <div className="space-y-5">
        {/* Creator Info Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 relative overflow-hidden shadow-xl">
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold flex items-center space-x-1">
            <span>👑 Room Host</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={username}
                className="w-16 h-16 rounded-2xl object-cover bg-slate-800 border-2 border-indigo-400/80 shadow-lg shadow-indigo-500/20"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" title="Online Host"></span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline space-x-2">
                <h4 className="text-base font-bold text-white truncate">{username}</h4>
                <span className="text-xs font-mono text-indigo-300 font-semibold">{tagId}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                <span>📍 {country}</span>
              </p>
              {spokenLanguages.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {spokenLanguages.map((lang) => (
                    <span key={lang} className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-medium">
                      🗣 {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {bio && (
            <p className="text-xs text-slate-300 italic mt-3 pt-3 border-t border-slate-800/80 leading-relaxed">
              "{bio}"
            </p>
          )}
        </div>

        {/* Room Specifications Grid */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Room Specs</h5>

          <div className="grid grid-cols-2 gap-3">
            {/* Custom Topic / Title */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start space-x-3 col-span-2">
              <FiTag className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Custom Topic</span>
                <span className="text-xs font-semibold text-white">{room.title}</span>
              </div>
            </div>

            {/* Category */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center space-x-2.5">
              <FiShield className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</span>
                <span className="text-xs font-semibold text-white">{room.category}</span>
              </div>
            </div>

            {/* Level */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center space-x-2.5">
              <FiBarChart2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Level</span>
                <span className="text-xs font-semibold text-white">{room.level || 'Any Level'}</span>
              </div>
            </div>

            {/* Languages */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center space-x-2.5">
              <FiGlobe className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Languages</span>
                <span className="text-xs font-semibold text-white">{room.language}</span>
              </div>
            </div>

            {/* Privacy */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center space-x-2.5">
              <FiLock className={`w-4 h-4 flex-shrink-0 ${room.isPrivate ? 'text-amber-400' : 'text-emerald-400'}`} />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Access</span>
                <span className="text-xs font-semibold text-white">{room.isPrivate ? 'Private Room' : 'Public Room'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onJoin ? (
          <button
            onClick={() => {
              onClose();
              onJoin(room);
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <FiCheckCircle className="w-4 h-4" />
            <span>Join Room Now</span>
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm transition-all cursor-pointer"
          >
            Close Details
          </button>
        )}
      </div>
    </Modal>
  );
};

export default RoomDetailsModal;
