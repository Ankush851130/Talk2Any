import React from 'react';
import PeerVideo from './PeerVideo';
import { FiMinimize2 } from 'react-icons/fi';

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
  // If no member or screen share is pinned, keep stage canvas clean and open
  if (!pinnedSocketId) {
    return null;
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
