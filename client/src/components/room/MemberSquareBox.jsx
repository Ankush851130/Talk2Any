import React, { useRef, useEffect } from 'react';
import { FiMicOff, FiSettings, FiUserX, FiBookmark } from 'react-icons/fi';

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

  const username = user?.username || 'Guest';
  const initials = getInitials(username);
  const subtitleText = user?.country || 'UNVERIFIED';

  return (
    <div
      className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl flex-shrink-0 overflow-hidden select-none shadow-2xl border transition-all duration-300 group ${
        isSpeaking
          ? 'border-blue-500 ring-2 ring-blue-500/60 shadow-blue-500/30 scale-[1.02]'
          : isPinned
          ? 'border-indigo-500 ring-2 ring-indigo-500/50'
          : 'border-slate-800/90'
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

      {/* Video or Initial Box View */}
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
        /* Fallback Brown Initials Card View (Matching Screenshot) */
        <div className="w-full h-full bg-[#6c4d42] flex flex-col items-center justify-center p-2 text-center relative">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
            {initials}
          </span>
          <span className="text-[9px] font-bold text-slate-300 tracking-wider uppercase mt-0.5 opacity-90">
            {subtitleText}
          </span>
        </div>
      )}

      {/* Top Right Gear / Settings Icon Button (Matching Screenshot) */}
      <div className="absolute top-1.5 right-1.5 flex items-center space-x-1 z-10">
        {onPin && (
          <button
            onClick={onPin}
            className="p-1 rounded bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isPinned ? 'Unpin from stage' : 'Pin to stage'}
          >
            <FiBookmark className={`w-3 h-3 ${isPinned ? 'text-indigo-400' : ''}`} />
          </button>
        )}

        {canModerate && !isLocal && onKick && (
          <button
            onClick={onKick}
            className="p-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
            title="Kick participant"
          >
            <FiUserX className="w-3 h-3" />
          </button>
        )}

        <button
          type="button"
          className="p-1 rounded bg-slate-950/40 hover:bg-slate-900/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Member settings"
        >
          <FiSettings className="w-3 h-3" />
        </button>
      </div>

      {/* Top Left Hand Raised Indicator */}
      {isHandRaised && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold animate-bounce shadow-md">
            ✋
          </span>
        </div>
      )}

      {/* Bottom Left Blue "Owner" Pill Badge (Matching Screenshot) */}
      {isRoomOwner && (
        <div className="absolute bottom-1.5 left-1.5 z-10">
          <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[9px] leading-none shadow-md">
            Owner
          </span>
        </div>
      )}

      {isCoOwner && !isRoomOwner && (
        <div className="absolute bottom-1.5 left-1.5 z-10">
          <span className="px-1.5 py-0.5 rounded bg-purple-600 text-white font-extrabold text-[9px] leading-none shadow-md">
            Co-Owner
          </span>
        </div>
      )}

      {/* Bottom Right Muted Mic Icon (Matching Screenshot) */}
      {isMuted && (
        <div className="absolute bottom-1.5 right-1.5 z-10" title="Muted">
          <FiMicOff className="w-3.5 h-3.5 text-white drop-shadow-md" />
        </div>
      )}

      {/* Bottom Edge Glowing Blue/Emerald Bar when Speaking (Matching Screenshot) */}
      <div
        className={`absolute bottom-0 inset-x-0 h-1 transition-all duration-200 ${
          isSpeaking ? 'bg-blue-500 shadow-blue-500 shadow-md' : 'bg-transparent'
        }`}
      />
    </div>
  );
};

export default MemberSquareBox;
