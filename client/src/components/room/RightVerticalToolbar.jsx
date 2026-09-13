import React from 'react';
import {
  FiMessageSquare,
  FiShare2,
  FiGrid,
  FiSettings,
  FiMaximize,
  FiMinimize,
} from 'react-icons/fi';

const RightVerticalToolbar = ({
  onToggleChat,
  onToggleParticipants,
  onCopyInvite,
  onToggleSettings,
  isFullscreen,
  onToggleFullscreen,
  isChatOpen,
  unreadMessages = 0,
}) => {
  return (
    <aside className="fixed right-0 top-0 bottom-0 w-16 bg-slate-950/90 border-l border-white/10 flex flex-col items-center justify-center py-5 z-30 backdrop-blur-xl select-none shadow-2xl">
      {/* 5 Right Side Fixed Icons */}
      <div className="flex flex-col items-center space-y-4 w-full px-2">
        {/* 1. Chat Button */}
        <button
          type="button"
          onClick={onToggleChat}
          className={`relative p-2.5 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 ${
            isChatOpen
              ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10'
          }`}
          title="Open Chat Drawer"
        >
          <FiMessageSquare className="w-5 h-5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse shadow-md">
              {unreadMessages}
            </span>
          )}
        </button>

        {/* 2. Share / Invite Link */}
        <button
          type="button"
          onClick={onCopyInvite}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Copy Invite Link"
        >
          <FiShare2 className="w-5 h-5" />
        </button>

        {/* 3. Grid / Participants View Toggle */}
        <button
          type="button"
          onClick={onToggleParticipants}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="View Participants List"
        >
          <FiGrid className="w-5 h-5" />
        </button>

        {/* 4. Room Settings */}
        <button
          type="button"
          onClick={onToggleSettings}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Room Settings"
        >
          <FiSettings className="w-5 h-5" />
        </button>

        {/* 5. Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

export default RightVerticalToolbar;
