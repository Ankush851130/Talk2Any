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
    <aside className="fixed right-0 top-0 bottom-0 w-14 bg-slate-950/90 border-l border-slate-800/80 flex flex-col items-center justify-between py-4 z-30 backdrop-blur-md select-none">
      {/* Top Section Icons */}
      <div className="flex flex-col items-center space-y-4 w-full">
        {/* Chat Button */}
        <button
          onClick={onToggleChat}
          className={`relative p-2.5 rounded-xl transition-all cursor-pointer ${
            isChatOpen
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title="Open Chat Drawer"
        >
          <FiMessageSquare className="w-5 h-5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse">
              {unreadMessages}
            </span>
          )}
        </button>

        {/* Share / Invite Link */}
        <button
          onClick={onCopyInvite}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title="Copy Invite Link"
        >
          <FiShare2 className="w-5 h-5" />
        </button>

        {/* Grid / Participants View Toggle */}
        <button
          onClick={onToggleParticipants}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title="View Participants List"
        >
          <FiGrid className="w-5 h-5" />
        </button>

        {/* Room Settings */}
        <button
          onClick={onToggleSettings}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title="Room Settings"
        >
          <FiSettings className="w-5 h-5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
        </button>
      </div>

      {/* Bottom Section: Blue "Bottom Menu" Badge Button matching screenshot */}
      <div className="w-full flex justify-center px-1">
        <button
          type="button"
          onClick={onToggleParticipants}
          className="w-11 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-bold text-[9px] leading-tight shadow-md transition-all text-center uppercase tracking-tighter"
          title="Toggle Room Dock"
        >
          Bottom Menu
        </button>
      </div>
    </aside>
  );
};

export default RightVerticalToolbar;
