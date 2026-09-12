import React from 'react';
import PeerVideo from './PeerVideo';
import AudioEqualizer from './AudioEqualizer';
import { FiLock, FiGlobe, FiTag, FiBarChart2, FiCopy, FiUsers, FiMinimize2, FiMic } from 'react-icons/fi';

const RoomStage = ({
  pinnedSocketId,
  pinnedPeer,
  localStream,
  user,
  isLocalMuted,
  isLocalVideoOff,
  isLocalScreenSharing,
  isLocalSpeaking,
  isLocalHandRaised,
  isRoomOwner,
  isCoOwner,
  canModerate,
  onUnpin,
  onKick,
  room,
  totalParticipants = 1,
  onCopyInvite,
}) => {
  // If a participant is pinned or sharing screen on stage
  if (pinnedSocketId) {
    const isLocalPinned = pinnedSocketId === 'local';
    const stream = isLocalPinned ? localStream : pinnedPeer?.stream;
    const peerUser = isLocalPinned ? user : pinnedPeer?.user;
    const isMuted = isLocalPinned ? isLocalMuted : pinnedPeer?.isMuted;
    const isVideoOff = isLocalPinned ? isLocalVideoOff : pinnedPeer?.isVideoOff;
    const isScreenSharing = isLocalPinned ? isLocalScreenSharing : pinnedPeer?.isScreenSharing;
    const isSpeaking = isLocalPinned ? isLocalSpeaking : pinnedPeer?.isSpeaking;
    const isHandRaised = isLocalPinned ? isLocalHandRaised : pinnedPeer?.isHandRaised;

    return (
      <div className="relative w-full h-full max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] rounded-3xl bg-slate-900 border border-slate-800/90 overflow-hidden shadow-2xl transition-all">
        <PeerVideo
          stream={stream}
          user={peerUser}
          isLocal={isLocalPinned}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isScreenSharing={isScreenSharing}
          isSpeaking={isSpeaking}
          isHandRaised={isHandRaised}
          isPinned={true}
          isRoomOwner={isRoomOwner(peerUser?._id)}
          isCoOwner={isCoOwner(peerUser?._id)}
          canModerate={canModerate}
          onPin={onUnpin}
          onKick={!isLocalPinned && onKick ? () => onKick(pinnedSocketId, peerUser?._id) : null}
        />
        <button
          onClick={onUnpin}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-xs font-semibold text-white backdrop-blur-md transition-all flex items-center space-x-1.5 z-20 shadow-lg cursor-pointer"
        >
          <FiMinimize2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Exit Stage View</span>
        </button>
      </div>
    );
  }

  // Default Stage View: Discussion Topic & Voice Stage Banner
  return (
    <div className="relative w-full h-full max-h-[45vh] sm:max-h-[50vh] min-h-[220px] rounded-3xl glass-card border border-slate-800/90 p-6 flex flex-col justify-between overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-indigo-950/40">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Stage Header Metadata */}
      <div className="flex items-start justify-between z-10">
        <div className="space-y-1 max-w-[80%]">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center space-x-1">
              <FiTag className="w-3 h-3" />
              <span>{room?.category || 'General'}</span>
            </span>
            {room?.isLocked && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center space-x-1">
                <FiLock className="w-3 h-3" />
                <span>Locked Room</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm truncate">
            {room?.title || 'Voice Room Stage'}
          </h2>
        </div>

        {/* Live Audio Stage Equalizer */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-md">
          <AudioEqualizer size="md" isSpeaking={true} />
          <span className="text-xs font-extrabold text-emerald-400">Live Voice</span>
        </div>
      </div>

      {/* Center Stage Topic / Language Details */}
      <div className="my-auto py-2 z-10 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
        <div className="flex items-center space-x-2 bg-slate-900/60 px-3.5 py-2 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
          <FiGlobe className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-400">Language:</span>
          <span className="font-bold text-white">{room?.language || 'English'}</span>
        </div>

        {room?.level && (
          <div className="flex items-center space-x-2 bg-slate-900/60 px-3.5 py-2 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
            <FiBarChart2 className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-400">Level:</span>
            <span className="font-bold text-amber-300">{room?.level}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 bg-slate-900/60 px-3.5 py-2 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
          <FiUsers className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-400">In Room:</span>
          <span className="font-bold text-indigo-300">
            {totalParticipants} / {room?.maxParticipants || 4} Members
          </span>
        </div>
      </div>

      {/* Bottom Stage Action Strip */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 z-10">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <FiMic className="w-3.5 h-3.5 text-slate-500 animate-pulse" />
          <span>Members will appear in the square boxes below when connected.</span>
        </div>

        <button
          onClick={onCopyInvite}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 border border-indigo-500 text-xs font-bold text-white transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer hover:scale-105"
        >
          <FiCopy className="w-3.5 h-3.5" />
          <span>Invite Friends</span>
        </button>
      </div>
    </div>
  );
};

export default RoomStage;
