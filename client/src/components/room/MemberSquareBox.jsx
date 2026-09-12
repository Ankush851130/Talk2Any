import React, { useRef, useEffect } from 'react';
import { FiMicOff, FiSettings, FiUserX, FiBookmark } from 'react-icons/fi';
import AudioEqualizer from './AudioEqualizer';

const MemberSquareBox = ({
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

  // Extract 2-letter initials (e.g. "Talk2Any User" -> "TS", "Ankush Sharma" -> "AS")
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate deterministic gradient based on username for rich visual aesthetics
  const getGradientStyle = (name) => {
    const gradients = [
      'from-indigo-600 via-purple-700 to-slate-900',
      'from-emerald-600 via-teal-700 to-slate-900',
      'from-amber-600 via-orange-700 to-slate-900',
      'from-cyan-600 via-blue-700 to-slate-900',
      'from-rose-600 via-pink-700 to-slate-900',
      'from-violet-600 via-purple-800 to-slate-900',
    ];
    if (!name) return gradients[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const username = user?.username || 'Guest';
  const initials = getInitials(username);
  const subtitleText = user?.country || 'GLOBAL';
  const gradientClass = getGradientStyle(username);

  return (
    <div
      className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl flex-shrink-0 overflow-hidden select-none shadow-2xl border transition-all duration-300 group hover:scale-105 ${
        isSpeaking
          ? 'border-emerald-400 ring-2 ring-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-[1.03]'
          : isPinned
          ? 'border-indigo-400 ring-2 ring-indigo-500/80 shadow-indigo-500/40'
          : 'border-slate-800/90 hover:border-slate-700'
      }`}
    >
      {/* Hidden Audio Element */}
      {stream && (
        <audio
          ref={audioRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="hidden"
        />
      )}

      {/* Video or Avatar Box View */}
      {!isVideoOff && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal && !isScreenSharing ? 'scale-x-[-1]' : ''}`}
        />
      ) : user?.avatar ? (
        /* User Avatar Photo View */
        <img
          src={user.avatar}
          alt={username}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Vibrant Gradient Initials Card View */
        <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center p-2 text-center relative border border-white/10`}>
          <span className="text-2xl sm:text-3xl font-black text-white tracking-wider drop-shadow-md">
            {initials}
          </span>
          <span className="text-[9px] font-bold text-slate-200 tracking-wider uppercase mt-0.5 opacity-90 truncate max-w-full px-1">
            {subtitleText}
          </span>
        </div>
      )}

      {/* Top Right Gear / Settings / Action Icons */}
      <div className="absolute top-1.5 right-1.5 flex items-center space-x-1 z-10">
        {onPin && (
          <button
            onClick={onPin}
            className="p-1 rounded-lg bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title={isPinned ? 'Unpin from stage' : 'Pin to stage'}
          >
            <FiBookmark className={`w-3 h-3 ${isPinned ? 'text-indigo-400 fill-indigo-400' : ''}`} />
          </button>
        )}

        {canModerate && !isLocal && onKick && (
          <button
            onClick={onKick}
            className="p-1 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white transition-colors cursor-pointer border border-rose-400/30"
            title="Kick participant"
          >
            <FiUserX className="w-3 h-3" />
          </button>
        )}

        <button
          type="button"
          className="p-1 rounded-lg bg-slate-950/50 hover:bg-slate-900/80 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/5 opacity-80 group-hover:opacity-100"
          title="Member settings"
        >
          <FiSettings className="w-3 h-3" />
        </button>
      </div>

      {/* Top Left Hand Raised Indicator */}
      {isHandRaised && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <span className="px-1.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold animate-bounce shadow-lg shadow-amber-500/40">
            ✋
          </span>
        </div>
      )}

      {/* Bottom Left Owner / Co-Owner Badges */}
      {isRoomOwner && (
        <div className="absolute bottom-1.5 left-1.5 z-10">
          <span className="px-1.5 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-md border border-blue-400/40 text-white font-extrabold text-[9px] leading-none shadow-md">
            Owner
          </span>
        </div>
      )}

      {isCoOwner && !isRoomOwner && (
        <div className="absolute bottom-1.5 left-1.5 z-10">
          <span className="px-1.5 py-0.5 rounded-md bg-purple-600/90 backdrop-blur-md border border-purple-400/40 text-white font-extrabold text-[9px] leading-none shadow-md">
            Co-Owner
          </span>
        </div>
      )}

      {/* Bottom Right Muted Mic / Speaking Equalizer */}
      <div className="absolute bottom-1.5 right-1.5 z-10 flex items-center space-x-1">
        {isSpeaking && (
          <div className="px-1 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 backdrop-blur-sm flex items-center justify-center">
            <AudioEqualizer size="sm" isSpeaking={true} />
          </div>
        )}
        {isMuted && (
          <div className="p-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-white backdrop-blur-sm" title="Muted">
            <FiMicOff className="w-3 h-3 text-rose-300" />
          </div>
        )}
      </div>

      {/* Bottom Edge Glowing Emerald Bar when Speaking */}
      <div
        className={`absolute bottom-0 inset-x-0 h-1 transition-all duration-200 ${
          isSpeaking ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_12px_#34d399]' : 'bg-transparent'
        }`}
      />
    </div>
  );
};

export default MemberSquareBox;
