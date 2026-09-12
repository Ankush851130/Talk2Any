import React, { useState } from 'react';
import {
  FiMessageSquare,
  FiShare2,
  FiGrid,
  FiSettings,
  FiMaximize,
  FiMinimize,
  FiChevronRight,
  FiMenu,
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
  const [isOpen, setIsOpen] = useState(false);

  // If toolbar is collapsed, show floating toggle button on the right edge
  if (!isOpen) {
    return (
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-30 select-none">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative px-2.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] shadow-2xl backdrop-blur-md flex flex-col items-center space-y-1 border border-blue-400/40 transition-all hover:scale-105 cursor-pointer"
          title="Show Tools Menu (Chat, Share, Settings)"
        >
          <FiMenu className="w-4 h-4" />
          <span className="leading-tight uppercase tracking-tighter text-[9px] font-black">
            Tools
          </span>
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>
    );
  }

  // Expanded Right Vertical Toolbar containing the 5 icons
  return (
    <aside className="fixed right-0 top-0 bottom-0 w-14 bg-slate-950/95 border-l border-slate-800/90 flex flex-col items-center justify-between py-4 z-30 backdrop-blur-md select-none animate-in slide-in-from-right duration-200">
      {/* Top Section Icons */}
      <div className="flex flex-col items-center space-y-4 w-full">
        {/* Collapse Close Arrow Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title="Hide Tools Menu"
        >
          <FiChevronRight className="w-5 h-5 text-blue-400" />
        </button>

        {/* 1. Chat Button */}
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

        {/* 2. Share / Invite Link */}
        <button
          onClick={onCopyInvite}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title="Copy Invite Link"
        >
          <FiShare2 className="w-5 h-5" />
        </button>

        {/* 3. Grid / Participants View Toggle */}
        <button
          onClick={onToggleParticipants}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title="View Participants List"
        >
          <FiGrid className="w-5 h-5" />
        </button>

        {/* 4. Room Settings */}
        <button
          onClick={onToggleSettings}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title="Room Settings"
        >
          <FiSettings className="w-5 h-5" />
        </button>

        {/* 5. Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
        </button>
      </div>

      {/* Bottom Section: Hide Menu button matching screenshot */}
      <div className="w-full flex justify-center px-1">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-11 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-[9px] leading-tight shadow-md transition-all text-center uppercase tracking-tighter cursor-pointer"
          title="Hide Menu"
        >
          Hide Menu
        </button>
      </div>
    </aside>
  );
};

export default RightVerticalToolbar;
