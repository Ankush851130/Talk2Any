import React from 'react';
import PeerVideo from './PeerVideo';
import AudioEqualizer from './AudioEqualizer';
import { FiMinimize2, FiGlobe, FiUsers, FiShare2, FiBookmark, FiRadio } from 'react-icons/fi';

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
  // If no member is pinned, render a rich Ambient Stage Canvas instead of blank void
  if (!pinnedSocketId) {
    const roomTitle = room?.topic || room?.name || 'Talk2Any Live Lounge';
    const roomLang = room?.language || 'Global / Any';
    const roomCategory = room?.category || 'Voice & Video';

    return (
      <div className="relative w-full h-full max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between p-6 select-none group transition-all duration-300">
        {/* Decorative Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-purple-600/15 rounded-full blur-[80px] pointer-events-none" />

        {/* Top Header Bar inside Stage */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-[10px] tracking-wider uppercase animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 shadow-[0_0_8px_#f43f5e]" />
              LIVE
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-950/70 border border-slate-800 text-xs font-semibold text-slate-300 backdrop-blur-md flex items-center space-x-1">
              <FiGlobe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{roomLang}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-300 backdrop-blur-md">
              {roomCategory}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 rounded-full bg-slate-950/70 border border-slate-800 text-xs font-bold text-slate-200 flex items-center space-x-1.5 backdrop-blur-md">
              <FiUsers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{totalParticipants} {totalParticipants === 1 ? 'Member' : 'Members'}</span>
            </div>
            {onCopyInvite && (
              <button
                onClick={onCopyInvite}
                className="px-3.5 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-105 active:scale-95"
                title="Copy room invite link"
              >
                <FiShare2 className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Animated Visualizer & Topic display */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-4">
          <div className="relative mb-4 flex items-center justify-center">
            {/* Pulsing ring aura */}
            <div className="w-20 h-20 rounded-full bg-indigo-600/20 animate-ping absolute inset-0 pointer-events-none" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/40 shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center text-white backdrop-blur-md z-10">
              <FiRadio className="w-9 h-9 text-white animate-pulse" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md max-w-lg">
            {roomTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md font-medium">
            Jump in the conversation or pin a speaker to highlight them on the main stage.
          </p>

          <div className="mt-4 flex items-center space-x-2">
            <AudioEqualizer size="md" isSpeaking={true} />
            <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
              Audio Stage Active
            </span>
          </div>
        </div>

        {/* Bottom Hint Banner */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="px-4 py-1.5 rounded-full bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 font-medium backdrop-blur-md flex items-center space-x-1.5 shadow-sm">
            <FiBookmark className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tip: Click the bookmark icon on any participant box to feature them on stage</span>
          </div>
        </div>
      </div>
    );
  }

  const isLocalPinned = pinnedSocketId === 'local';
  const stream = isLocalPinned ? localStream : pinnedPeer?.stream;
  const peerUser = isLocalPinned ? user : pinnedPeer?.user;
  const isMuted = isLocalPinned ? isLocalMuted : pinnedPeer?.isMuted;
  const isVideoOff = isLocalPinned ? isLocalVideoOff : pinnedPeer?.isVideoOff;
  const isScreenSharing = isLocalPinned ? isLocalScreenSharing : pinnedPeer?.isScreenSharing;
  const isSpeaking = isLocalPinned ? isLocalSpeaking : pinnedPeer?.isSpeaking;
  const isHandRaised = isLocalPinned ? isLocalHandRaised : pinnedPeer?.isHandRaised;

  return (
    <div className="relative w-full h-full max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] rounded-3xl bg-slate-900 border border-indigo-500/30 overflow-hidden shadow-2xl transition-all">
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
        className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-indigo-500/40 text-xs font-bold text-white backdrop-blur-md transition-all flex items-center space-x-1.5 z-20 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
      >
        <FiMinimize2 className="w-3.5 h-3.5 text-indigo-400" />
        <span>Exit Stage View</span>
      </button>
    </div>
  );
};

export default RoomStage;
