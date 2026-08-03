import React, { useRef, useEffect } from 'react';
import { FiMicOff, FiMaximize2, FiUser, FiTv, FiBookmark, FiUserX } from 'react-icons/fi';

const PeerVideo = ({
  stream,
  user,
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
  isScreenSharing = false,
  isSpeaking = false,
  isHandRaised = false,
  isPinned = false,
  isRoomOwner = false,
  isCoOwner = false,
  canModerate = false,
  onPin,
  onKick,
}) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((e) => console.log('Video play error:', e.message));
    }
  }, [stream, isVideoOff]);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
      audioRef.current.play().catch((e) => console.log('Audio play error:', e.message));
    }
  }, [stream]);

  return (
    <div
      className={`relative w-full h-full min-h-[220px] rounded-3xl bg-slate-900 overflow-hidden border transition-all duration-300 ${
        isSpeaking ? 'speaking-glow border-emerald-500 ring-2 ring-emerald-500/40' : 'border-slate-800'
      } ${isPinned ? 'ring-2 ring-indigo-500 shadow-2xl' : ''}`}
    >
      {/* Audio Stream Element - Always Active for Stream Audio Playback */}
      {stream && (
        <audio
          ref={audioRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="hidden"
        />
      )}

      {/* Video Stream Element */}
      {!isVideoOff && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal && !isScreenSharing ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        /* Video Off Avatar Placeholder with Active Speaker Glow Ring */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 text-center">
          <div className="relative mb-3">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'user'}`}
              alt={user?.username || 'Participant'}
              className={`w-20 h-20 rounded-full border-2 bg-slate-800 object-cover shadow-xl transition-all duration-300 ${
                isSpeaking
                  ? 'ring-4 ring-emerald-500 border-emerald-400 animate-pulse shadow-emerald-500/50 shadow-2xl scale-105'
                  : 'border-indigo-500/40'
              }`}
            />
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-white tracking-tight flex items-center space-x-1">
            <span>{user?.username || 'Guest'}</span>
            {isRoomOwner && <span className="text-amber-400 font-extrabold text-xs" title="Room Owner">👑</span>}
            {isCoOwner && !isRoomOwner && <span className="text-indigo-400 font-extrabold text-xs" title="Co-Owner">⭐</span>}
          </span>
          <span className="text-xs text-slate-500">{isLocal ? '(You)' : user?.country || 'Global'}</span>
        </div>
      )}

      {/* Top Left User Badges & Owner/Co-Owner Tags */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-white flex items-center space-x-1.5 shadow-md">
          <FiUser className="w-3 h-3 text-indigo-400" />
          <span>{user?.username || 'Participant'} {isLocal && '(You)'}</span>
        </span>

        {isHandRaised && (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white font-extrabold text-xs flex items-center space-x-1 shadow-lg shadow-amber-500/30 animate-bounce">
            <span>✋ Hand Raised</span>
          </span>
        )}

        {isRoomOwner && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[10px] font-extrabold text-amber-300 shadow-md">
            👑 Owner
          </span>
        )}

        {isCoOwner && !isRoomOwner && (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/40 text-[10px] font-extrabold text-purple-300 shadow-md">
            ⭐ Co-Owner
          </span>
        )}

        {isScreenSharing && (
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-[10px] font-bold text-indigo-300 flex items-center space-x-1">
            <FiTv className="w-3 h-3" />
            <span>Sharing</span>
          </span>
        )}
      </div>

      {/* Top Right Overlay Action Controls */}
      <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
        {canModerate && !isLocal && onKick && (
          <button
            onClick={onKick}
            className="p-1.5 rounded-full bg-rose-600/90 text-white backdrop-blur-md border border-rose-500 hover:bg-rose-500 text-xs transition-all cursor-pointer shadow-lg"
            title="Kick participant from room"
          >
            <FiUserX className="w-3.5 h-3.5" />
          </button>
        )}

        {onPin && (
          <button
            onClick={onPin}
            className={`p-1.5 rounded-full backdrop-blur-md border text-xs transition-colors cursor-pointer ${
              isPinned ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:text-white'
            }`}
            title={isPinned ? 'Unpin participant' : 'Pin participant'}
          >
            <FiBookmark className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bottom Status Icons (Muted Badge) */}
      {isMuted && (
        <div className="absolute bottom-3 right-3 p-2 rounded-full bg-rose-500/90 text-white backdrop-blur-md shadow-lg z-10" title="Microphone Muted">
          <FiMicOff className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default PeerVideo;
