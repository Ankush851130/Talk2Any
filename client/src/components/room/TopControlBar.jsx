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
      <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl flex items-center space-x-2 shadow-2xl backdrop-blur-md">
        {/* Microphone Button */}
        <button
          onClick={onToggleMute}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isMuted
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
        </button>

        {/* Video Camera Button */}
        <button
          onClick={onToggleVideo}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isVideoOff
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-500'
          }`}
          title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
        >
          {isVideoOff ? <FiVideoOff className="w-5 h-5" /> : <FiVideo className="w-5 h-5" />}
        </button>

        {/* Audio Level Signal Button */}
        <button
          onClick={onTestAudio}
          className="w-10 h-10 rounded-xl bg-blue-900/60 hover:bg-blue-800/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-md border border-blue-700/50"
          title="Test Audio Level"
        >
          <FiBarChart2 className="w-5 h-5 text-blue-300" />
        </button>

        {/* Leave Room Button */}
        <button
          onClick={onLeaveRoom}
          className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-rose-600/30"
          title="Leave Room"
        >
          <FiPhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TopControlBar;
