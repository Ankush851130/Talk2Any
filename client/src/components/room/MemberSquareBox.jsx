import React, { useRef, useEffect } from 'react';
import { FiMicOff, FiUser, FiTv, FiBookmark, FiUserX, FiVolume2 } from 'react-icons/fi';
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

  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'user'}`;

  return (
    <div
      className={`relative aspect-square w-36 sm:w-44 md:w-48 lg:w-52 rounded-2xl sm:rounded-3xl bg-slate-900/90 backdrop-blur-md overflow-hidden border transition-all duration-300 flex-shrink-0 group shadow-lg ${
        isSpeaking
          ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-emerald-500/20 scale-[1.02]'
          : isPinned
          ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-indigo-500/20'
          : 'border-slate-800/90 hover:border-slate-700'
      }`}
    >
      {/* Hidden Audio Stream Element */}
      {stream && (
        <audio
          ref={audioRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="hidden"
        />
      )}

      {/* Video Stream or Avatar Box */}
      {!isVideoOff && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal && !isScreenSharing ? 'scale-x-[-1]' : ''}`}
        />
      ) : (
        /* Video Off Avatar Display */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-3 relative">
          <div className="relative mb-2">
            <img
              src={avatarUrl}
              alt={user?.username || 'Participant'}
              className={`w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-2 bg-slate-800 object-cover shadow-xl transition-all duration-300 ${
                isSpeaking
                  ? 'ring-4 ring-emerald-500 border-emerald-400 scale-105 animate-pulse shadow-emerald-500/50 shadow-2xl'
                  : 'border-indigo-500/30'
              }`}
            />
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-slate-900 shadow-md">
                <AudioEqualizer size="sm" isSpeaking={true} />
              </span>
            )}
          </div>

          <span className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center space-x-1 max-w-[90%] truncate">
            <span className="truncate">{user?.username || 'Guest'}</span>
            {isRoomOwner && <span title="Room Owner">👑</span>}
            {isCoOwner && !isRoomOwner && <span title="Co-Owner">⭐</span>}
          </span>
          
          <span className="text-[10px] text-slate-400 font-medium truncate">
            {isLocal ? '(You)' : user?.country || 'Global'}
          </span>
        </div>
      )}

      {/* Top Left Badges (Role, Hand Raised, Screen Share) */}
      <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1 z-10">
        {isHandRaised && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] shadow-md animate-bounce">
            ✋
          </span>
        )}

        {isRoomOwner && (
          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/30 backdrop-blur-md border border-amber-500/50 text-[10px] font-extrabold text-amber-300 shadow-sm" title="Room Owner">
            👑 Owner
          </span>
        )}

        {isCoOwner && !isRoomOwner && (
          <span className="px-1.5 py-0.5 rounded-md bg-purple-500/30 backdrop-blur-md border border-purple-500/50 text-[10px] font-extrabold text-purple-300 shadow-sm" title="Co-Owner">
            ⭐ Co-Owner
          </span>
        )}

        {isScreenSharing && (
          <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/30 backdrop-blur-md border border-indigo-500/40 text-[10px] font-bold text-indigo-300 flex items-center space-x-1">
            <FiTv className="w-2.5 h-2.5" />
          </span>
        )}
      </div>

      {/* Top Right Action Controls (Pin / Kick) */}
      <div className="absolute top-2 right-2 flex items-center space-x-1 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
        {canModerate && !isLocal && onKick && (
          <button
            onClick={onKick}
            className="p-1 sm:p-1.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-md border border-rose-500 text-xs transition-all cursor-pointer shadow-md"
            title="Kick participant"
          >
            <FiUserX className="w-3 h-3" />
          </button>
        )}

        {onPin && (
          <button
            onClick={onPin}
            className={`p-1 sm:p-1.5 rounded-full backdrop-blur-md border text-xs transition-all cursor-pointer ${
              isPinned
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-slate-950/70 hover:bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={isPinned ? 'Unpin member stage' : 'Pin member to stage'}
          >
            <FiBookmark className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Bottom Floating Equalizer / Speaking Badge */}
      {isSpeaking && (
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-md border border-emerald-400 shadow-md flex items-center space-x-1 z-10">
          <AudioEqualizer size="sm" isSpeaking={true} />
          <span className="text-[9px] font-bold">Speaking</span>
        </div>
      )}

      {/* Bottom Right Muted Microphone Indicator */}
      {isMuted && (
        <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-rose-500/90 text-white backdrop-blur-md shadow-md z-10" title="Microphone Muted">
          <FiMicOff className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Bottom Name Ribbon for Video view */}
      {!isVideoOff && stream && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-2 pt-4 flex items-center justify-between z-1">
          <span className="text-xs font-bold text-white truncate max-w-[80%] drop-shadow-md">
            {user?.username || 'Participant'} {isLocal && '(You)'}
          </span>
        </div>
      )}
    </div>
  );
};

export default MemberSquareBox;
