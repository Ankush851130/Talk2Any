import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useWebRTC } from '../context/WebRTCContext';
import { roomApi } from '../services/roomApi';
import PeerVideo from '../components/room/PeerVideo';
import MemberSquareBox from '../components/room/MemberSquareBox';
import EmptySquareSlot from '../components/room/EmptySquareSlot';
import RoomStage from '../components/room/RoomStage';
import TopControlBar from '../components/room/TopControlBar';
import RightVerticalToolbar from '../components/room/RightVerticalToolbar';
import BottomActionPill from '../components/room/BottomActionPill';
import ControlsBar from '../components/room/ControlsBar';
import ChatPanel from '../components/room/ChatPanel';
import ParticipantsList from '../components/room/ParticipantsList';
import RoomDetailsModal from '../components/dashboard/RoomDetailsModal';
import {
  FiLock,
  FiGlobe,
  FiTag,
  FiBarChart2,
  FiCopy,
  FiCheck,
  FiLogOut,
  FiAlertTriangle,
  FiVolume2,
  FiSettings,
} from 'react-icons/fi';

const Room = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const {
    localStream,
    remoteStreams,
    isMuted,
    isVideoOff,
    isScreenSharing,
    isSpeaking,
    isHandRaised,
    raisedHands,
    initLocalStream,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    toggleHandRaise,
    leaveWebRTCRoom,
  } = useWebRTC();

  const [room, setRoom] = useState(null);
  const [coOwners, setCoOwners] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [pinnedSocketId, setPinnedSocketId] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Fetch Room Data
  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      try {
        const res = await roomApi.getRoomById(roomId);
        if (res.success && isMounted) {
          setRoom(res.room);
          setCoOwners((res.room.coOwners || []).map((u) => u._id || u));
          setMessages(res.messages || []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load room');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [roomId]);

  // Init WebRTC and Socket join room
  useEffect(() => {
    if (!socket || !user || !roomId) return;

    // Initialize Local Media Stream with Camera & Mic OFF by default
    initLocalStream(false, false, roomId).then(() => {
      // Emit Join Room to Socket server
      socket.emit('join-room', { roomId, user });
    });

    // Listen for Kicked, Remote Muted, and Co-Owner updates
    const handleKicked = ({ reason }) => {
      alert(`You were removed from the call: ${reason}`);
      leaveWebRTCRoom(roomId);
      navigate('/dashboard');
    };

    const handleRemoteMuted = ({ message }) => {
      alert(message);
      if (!isMuted) toggleMute();
    };

    const handleCoOwnersUpdated = ({ coOwners: updatedList }) => {
      setCoOwners(updatedList.map((u) => u._id || u));
    };

    const handleRoomLockUpdated = ({ isLocked }) => {
      setRoom((prev) => (prev ? { ...prev, isLocked } : prev));
    };

    const handleRoomCapacityUpdated = ({ maxParticipants }) => {
      setRoom((prev) => (prev ? { ...prev, maxParticipants } : prev));
    };

    socket.on('kicked-from-room', handleKicked);
    socket.on('remote-muted', handleRemoteMuted);
    socket.on('co-owners-updated', handleCoOwnersUpdated);
    socket.on('room-lock-updated', handleRoomLockUpdated);
    socket.on('room-capacity-updated', handleRoomCapacityUpdated);

    return () => {
      socket.off('kicked-from-room', handleKicked);
      socket.off('remote-muted', handleRemoteMuted);
      socket.off('co-owners-updated', handleCoOwnersUpdated);
      socket.off('room-lock-updated', handleRoomLockUpdated);
      socket.off('room-capacity-updated', handleRoomCapacityUpdated);
      leaveWebRTCRoom(roomId);
    };
  }, [socket, user, roomId]);

  const handleToggleLock = () => {
    if (socket) {
      socket.emit('toggle-room-lock', { roomId });
    }
  };

  const handleCapacityChange = (newCap) => {
    if (socket) {
      socket.emit('update-room-capacity', { roomId, maxParticipants: newCap });
    }
  };

  const handleLeave = () => {
    leaveWebRTCRoom(roomId);
    navigate('/dashboard');
  };

  const handleKickParticipant = (targetSocketId, targetUserId) => {
    if (socket) {
      socket.emit('kick-participant', { roomId, targetSocketId, targetUserId });
    }
  };

  const [isTestingAudio, setIsTestingAudio] = useState(false);

  const handleTestAudio = () => {
    if (!localStream) return alert('Local microphone stream is not active.');
    const audioTrack = localStream.getAudioTracks()[0];
    if (!audioTrack) return alert('Microphone track not found.');

    setIsTestingAudio(true);
    const audioEl = new Audio();
    audioEl.srcObject = new MediaStream([audioTrack]);
    audioEl.play().catch((e) => console.log('Audio test error:', e.message));

    setTimeout(() => {
      audioEl.pause();
      audioEl.srcObject = null;
      setIsTestingAudio(false);
    }, 4000);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0A0D14] text-slate-100 flex flex-col justify-between overflow-hidden select-none relative pr-14">
      {/* Top Floating Controls Bar (Mic, Cam, Signal, Leave) matching screenshot */}
      <TopControlBar
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onLeaveRoom={handleLeave}
        onTestAudio={handleTestAudio}
      />

      {/* Right Vertical Sidebar Toolbar matching screenshot */}
      <RightVerticalToolbar
        onToggleChat={() => {
          setIsChatOpen(!isChatOpen);
          setIsParticipantsOpen(false);
        }}
        onToggleParticipants={() => {
          setIsParticipantsOpen(!isParticipantsOpen);
          setIsChatOpen(false);
        }}
        onCopyInvite={copyRoomLink}
        onToggleSettings={() => setIsDetailsModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isChatOpen={isChatOpen}
        unreadMessages={unreadMessages}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col justify-between p-4 pt-16 pb-14 overflow-hidden relative">
        {/* Upper Stage (Pinned Stream or Room Stage Banner) */}
        <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden mb-2">
          <RoomStage
            pinnedSocketId={pinnedSocketId}
            pinnedPeer={pinnedSocketId && pinnedSocketId !== 'local' ? remoteStreams.get(pinnedSocketId) : null}
            localStream={localStream}
            user={user}
            isLocalMuted={isMuted}
            isLocalVideoOff={isVideoOff}
            isLocalScreenSharing={isScreenSharing}
            isLocalSpeaking={isSpeaking}
            isLocalHandRaised={isHandRaised}
            isRoomOwner={isRoomOwner}
            isCoOwner={isCoOwner}
            canModerate={canModerate}
            onUnpin={() => setPinnedSocketId(null)}
            onKick={handleKickParticipant}
            room={room}
            totalParticipants={allParticipantsList.length}
            onCopyInvite={copyRoomLink}
          />
        </div>

        {/* Member Cards Row Positioned Near Bottom (Matching Screenshot) */}
        <div className="w-full flex justify-center mb-1 z-20">
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 overflow-x-auto max-w-full py-1 scrollbar-none px-2">
            {/* Local User Box */}
            <MemberSquareBox
              stream={localStream}
              user={user}
              isLocal={true}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              isScreenSharing={isScreenSharing}
              isSpeaking={isSpeaking}
              isHandRaised={isHandRaised}
              isPinned={pinnedSocketId === 'local'}
              isRoomOwner={isRoomOwner(user?._id)}
              isCoOwner={isCoOwner(user?._id)}
              canModerate={canModerate}
              onPin={() => setPinnedSocketId(pinnedSocketId === 'local' ? null : 'local')}
            />

            {/* Remote Peers Boxes */}
            {remotePeersArray.map(([sId, p]) => (
              <MemberSquareBox
                key={sId}
                stream={p.stream}
                user={p.user}
                isMuted={p.isMuted}
                isVideoOff={p.isVideoOff}
                isScreenSharing={p.isScreenSharing}
                isSpeaking={p.isSpeaking}
                isHandRaised={raisedHands.get(sId)}
                isPinned={pinnedSocketId === sId}
                isRoomOwner={isRoomOwner(p.user?._id)}
                isCoOwner={isCoOwner(p.user?._id)}
                canModerate={canModerate}
                onPin={() => setPinnedSocketId(pinnedSocketId === sId ? null : sId)}
                onKick={() => handleKickParticipant(sId, p.user?._id)}
              />
            ))}

            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, (Number(room?.maxParticipants) || 4) - allParticipantsList.length) }).map((_, idx) => (
              <EmptySquareSlot
                key={`empty-slot-${idx}`}
                slotIndex={allParticipantsList.length + idx + 1}
                totalSlots={Number(room?.maxParticipants) || 4}
                onInvite={copyRoomLink}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Curved Floating Action Pill matching screenshot */}
      <BottomActionPill
        isHandRaised={isHandRaised}
        onToggleHandRaise={toggleHandRaise}
        onToggleTheme={() => {}}
        onToggleMore={() => setIsDetailsModalOpen(true)}
      />

      {/* Live Chat Panel Drawer */}
      {isChatOpen && (
        <ChatPanel
          roomId={roomId}
          initialMessages={messages}
          onClose={() => setIsChatOpen(false)}
          isOwner={canModerate}
        />
      )}

      {/* Participants List Panel Drawer */}
      {isParticipantsOpen && (
        <ParticipantsList
          roomId={roomId}
          participants={allParticipantsList}
          roomOwnerId={roomOwnerId}
          coOwnerIds={coOwners}
          currentUserId={user?._id}
          onClose={() => setIsParticipantsOpen(false)}
        />
      )}

      {/* Room & Creator Information Modal */}
      <RoomDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        room={room}
      />
    </div>
  );
};

export default Room;
