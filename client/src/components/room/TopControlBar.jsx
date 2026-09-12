import React from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiBarChart2, FiPhoneOff } from 'react-icons/fi';

const TopControlBar = ({
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onLeaveRoom,
  onTestAudio,
}) => {
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="bg-slate-900/80 border border-white/10 p-2 rounded-2xl flex items-center space-x-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all">
        {/* Microphone Button */}
        <button
          onClick={onToggleMute}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
            isMuted
              ? 'bg-rose-600/90 text-white hover:bg-rose-500 border border-rose-400/40 shadow-rose-600/30'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5 animate-pulse" />}
        </button>

        {/* Video Camera Button */}
        <button
          onClick={onToggleVideo}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
            isVideoOff
              ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
          }`}
          title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
        >
          {isVideoOff ? <FiVideoOff className="w-5 h-5" /> : <FiVideo className="w-5 h-5" />}
        </button>

        {/* Audio Level Signal / Test Button */}
        <button
          onClick={onTestAudio}
          className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-blue-300 hover:text-blue-200 flex items-center justify-center transition-all cursor-pointer shadow-md border border-white/5 hover:border-blue-400/30 hover:scale-105 active:scale-95"
          title="Test Audio Level"
        >
          <FiBarChart2 className="w-5 h-5 text-indigo-400" />
        </button>

        <div className="w-px h-6 bg-white/10 my-auto mx-1" />

        {/* Leave Room Button */}
        <button
          onClick={onLeaveRoom}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-rose-600/40 border border-rose-400/30 hover:scale-105 active:scale-95"
          title="Leave Room"
        >
          <FiPhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TopControlBar;
