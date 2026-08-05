import React from 'react';
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiTv,
  FiMessageSquare,
  FiUsers,
  FiPhoneOff,
} from 'react-icons/fi';

const ControlsBar = ({
  isMuted,
  isVideoOff,
  isScreenSharing,
  isHandRaised = false,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleHandRaise,
  onToggleChat,
  onToggleParticipants,
  onLeaveRoom,
  isChatOpen,
  isParticipantsOpen,
  unreadMessages = 0,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-3 glass-panel rounded-full border border-slate-800/80 shadow-2xl flex items-center justify-between gap-2 z-30">
      {/* Mic Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onToggleMute) onToggleMute();
        }}
        className={`p-3.5 rounded-full text-white font-medium transition-all duration-300 shadow-md cursor-pointer ${isMuted
            ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
      >
        {isMuted ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5 text-emerald-400" />}
      </button>

      {/* Camera Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onToggleVideo) onToggleVideo();
        }}
        className={`p-3.5 rounded-full text-white font-medium transition-all duration-300 shadow-md cursor-pointer ${isVideoOff
            ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
      >
        {isVideoOff ? <FiVideoOff className="w-5 h-5" /> : <FiVideo className="w-5 h-5 text-indigo-400" />}
      </button>

      {/* Screen Share Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onToggleScreenShare) onToggleScreenShare();
        }}
        className={`p-3.5 rounded-full font-medium transition-all duration-300 shadow-md cursor-pointer ${isScreenSharing
            ? 'bg-indigo-600 text-white shadow-indigo-600/30'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
      >
        <FiTv className="w-5 h-5" />
      </button>

      {/* Raise Hand Toggle ✋ */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onToggleHandRaise) onToggleHandRaise();
        }}
        className={`p-3.5 rounded-full font-medium transition-all duration-300 shadow-md cursor-pointer ${isHandRaised
            ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 animate-bounce'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        title={isHandRaised ? 'Lower Hand' : 'Raise Hand ✋'}
      >
        <span className="text-base leading-none">✋</span>
      </button>

      <div className="h-6 w-[1px] bg-slate-800 mx-1"></div>

      {/* Participants Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onToggleParticipants) onToggleParticipants();
        }}
        className={`p-3 rounded-full font-medium transition-all duration-300 cursor-pointer ${isParticipantsOpen ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        title="Participants"
      >
        <FiUsers className="w-5 h-5" />
      </button>

      {/* Live Chat Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onToggleChat) onToggleChat();
        }}
        className={`relative p-3 rounded-full font-medium transition-all duration-300 cursor-pointer ${isChatOpen ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        title="Live Chat"
      >
        <FiMessageSquare className="w-5 h-5" />
        {unreadMessages > 0 && !isChatOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
            {unreadMessages}
          </span>
        )}
      </button>

      {/* Leave Room Call Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onLeaveRoom) onLeaveRoom();
        }}
        className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer ml-2"
        title="Leave Room"
      >
        <FiPhoneOff className="w-4 h-4" />
        <span className="hidden sm:inline">Leave</span>
      </button>
    </div>
  );
};

export default ControlsBar;
