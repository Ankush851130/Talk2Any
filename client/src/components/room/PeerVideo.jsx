import React, { useRef, useEffect } from 'react';
import { FiMicOff, FiUser, FiTv, FiUserX } from 'react-icons/fi';
import AudioEqualizer from './AudioEqualizer';

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

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
        /* Video Off Circular DP / Avatar View in the Middle of the Room Stage */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 text-center">
          <div className="relative mb-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.username || 'Participant'}
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 bg-slate-800 object-cover shadow-2xl transition-all duration-300 ${
                  isSpeaking
                    ? 'ring-4 ring-emerald-500 border-emerald-400 animate-pulse shadow-emerald-500/50 scale-105'
                    : 'border-indigo-500/50 shadow-indigo-500/30'
                }`}
              />
            ) : (
              <div
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 border-4 flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  isSpeaking
                    ? 'ring-4 ring-emerald-500 border-emerald-400 animate-pulse shadow-emerald-500/50 scale-105'
                    : 'border-indigo-500/50 shadow-indigo-500/30'
                }`}
              >
                <span className="text-3xl sm:text-4xl font-black text-white tracking-widest drop-shadow-lg">
                  {getInitials(user?.username || 'Guest')}
                </span>
              </div>
            )}
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 border-2 border-slate-900 shadow-lg">
                <AudioEqualizer size="sm" isSpeaking={true} />
              </span>
            )}
          </div>
          <span className="text-base font-bold text-white tracking-tight flex items-center space-x-1.5">
            <span>{user?.username || 'Guest'}</span>
            {isRoomOwner && <span className="text-amber-400 font-extrabold text-xs" title="Room Owner">👑</span>}
            {isCoOwner && !isRoomOwner && <span className="text-indigo-400 font-extrabold text-xs" title="Co-Owner">⭐</span>}
          </span>
          <span className="text-xs text-slate-400 mt-0.5">{isLocal ? '(You)' : user?.country || 'Global'}</span>
        </div>
      )}

      {/* Top Left User Badges & Owner/Co-Owner Tags & Equalizer */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-white flex items-center space-x-1.5 shadow-md">
          <FiUser className="w-3 h-3 text-indigo-400" />
          <span>{user?.username || 'Participant'} {isLocal && '(You)'}</span>
          {isSpeaking && <AudioEqualizer size="sm" isSpeaking={true} className="ml-1" />}
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

      {/* Top Right Overlay Action Controls (Bookmark Removed) */}
      <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
        {canModerate && !isLocal && onKick && (
          <button
            type="button"
            onClick={onKick}
            className="p-1.5 rounded-full bg-rose-600/90 text-white backdrop-blur-md border border-rose-500 hover:bg-rose-500 text-xs transition-all cursor-pointer shadow-lg"
            title="Kick participant from room"
          >
            <FiUserX className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bottom Floating Speaking Equalizer Badge */}
      {isSpeaking && (
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-md border border-emerald-400 shadow-lg flex items-center space-x-1.5 z-10 animate-fade-in">
          <AudioEqualizer size="sm" isSpeaking={true} />
          <span className="text-[11px] font-extrabold tracking-tight">Speaking</span>
        </div>
      )}

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
