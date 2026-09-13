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

  // Collapsed state: Floating "Tools" Button fixed on the right side
  if (!isOpen) {
    return (
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-30 select-none">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative px-3 py-2.5 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-[10px] shadow-[0_10px_25px_rgba(99,102,241,0.4)] backdrop-blur-xl flex flex-col items-center space-y-1 border border-indigo-400/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Show Tools Menu (Chat, Share, Settings)"
        >
          <FiMenu className="w-4 h-4" />
          <span className="leading-tight uppercase tracking-tighter text-[9px] font-black">
            Tools
          </span>
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center animate-pulse shadow-md">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>
    );
  }

  // Expanded Right Vertical Toolbar containing the 5 icons
  return (
    <aside className="fixed right-0 top-0 bottom-0 w-16 bg-slate-950/95 border-l border-white/10 flex flex-col items-center justify-between py-5 z-30 backdrop-blur-xl select-none shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Top Section */}
      <div className="flex flex-col items-center space-y-3.5 w-full px-2">
        {/* Collapse Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Hide Tools Menu"
        >
          <FiChevronRight className="w-5 h-5 text-indigo-400" />
        </button>

        <div className="w-8 h-px bg-white/10" />

        {/* 1. Chat Button */}
        <button
          type="button"
          onClick={() => {
            if (onToggleChat) onToggleChat();
          }}
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
          onClick={() => {
            if (onCopyInvite) onCopyInvite();
          }}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Copy Invite Link"
        >
          <FiShare2 className="w-5 h-5" />
        </button>

        {/* 3. Grid / Participants View Toggle */}
        <button
          type="button"
          onClick={() => {
            if (onToggleParticipants) onToggleParticipants();
          }}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="View Participants List"
        >
          <FiGrid className="w-5 h-5" />
        </button>

        {/* 4. Room Settings */}
        <button
          type="button"
          onClick={() => {
            if (onToggleSettings) onToggleSettings();
          }}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Room Settings"
        >
          <FiSettings className="w-5 h-5" />
        </button>

        {/* 5. Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => {
            if (onToggleFullscreen) onToggleFullscreen();
          }}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
        </button>
      </div>

      {/* Bottom Section: Hide Button */}
      <div className="w-full flex justify-center px-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-12 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold text-[9px] leading-tight shadow-md transition-all text-center uppercase tracking-tighter cursor-pointer hover:scale-105 active:scale-95 border border-indigo-400/30"
          title="Hide Menu"
        >
          Hide Menu
        </button>
      </div>
    </aside>
  );
};

export default RightVerticalToolbar;
