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

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-semibold animate-pulse">Establishing WebRTC Peer Connection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-3xl glass-card border border-slate-800 text-center max-w-md">
          <FiAlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Room Error</h2>
          <p className="text-xs text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const roomOwnerId = room?.owner?._id || room?.owner;
  const isRoomOwner = (uId) => uId === roomOwnerId;
  const isCoOwner = (uId) => coOwners.includes(uId);
  const canModerate = isRoomOwner(user?._id) || isCoOwner(user?._id) || user?.role === 'admin';

  const remotePeersArray = Array.from(remoteStreams.entries()); // [[socketId, peerObj]]

  // Build list of participants for moderation list
  const allParticipantsList = [
    { socketId: 'local', user, isSpeaking },
    ...remotePeersArray.map(([sId, p]) => ({ socketId: sId, user: p.user, isSpeaking: p.isSpeaking })),
  ];

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Room Header Bar */}
      <header className="h-16 px-6 glass-panel border-b border-slate-800/80 flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLeave}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Leave Call"
          >
            <FiLogOut className="w-4 h-4 text-rose-400" />
          </button>

          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>{room?.title}</span>
              {room?.isPrivate && <FiLock className="w-3.5 h-3.5 text-amber-400" />}
            </h1>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <FiTag className="w-3 h-3 text-indigo-400" />
                <span>{room?.category}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <FiGlobe className="w-3 h-3 text-emerald-400" />
                <span>{room?.language}</span>
              </span>
              {room?.level && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <FiBarChart2 className="w-3 h-3 text-amber-400" />
                    <span>{room?.level}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {canModerate && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleLock}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${room?.isLocked
                  ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                title={room?.isLocked ? 'Room is Locked (Click to Unlock)' : 'Lock Room (Click to Lock)'}
              >
                <FiLock className={`w-3.5 h-3.5 ${room?.isLocked ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{room?.isLocked ? 'Locked 🔒' : 'Lock Room'}</span>
              </button>

              <select
                value={room?.maxParticipants || 4}
                onChange={(e) => handleCapacityChange(e.target.value)}
                className="px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                title="Change max room participant capacity"
              >
                <option value="2">Max 2</option>
                <option value="3">Max 3</option>
                <option value="4">Max 4</option>
              </select>
            </div>
          )}

          <button
            onClick={handleTestAudio}
            disabled={isTestingAudio}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${isTestingAudio
              ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            title="Test hearing your microphone sound through your speakers"
          >
            <FiVolume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isTestingAudio ? 'Testing Mic (4s)...' : 'Test Mic Sound'}</span>
          </button>

          <button
            onClick={copyRoomLink}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Link Copied' : 'Invite Link'}</span>
          </button>

          <button
            onClick={() => setIsDetailsModalOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            title="Room & Host Information"
          >
            <FiSettings className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      </header>

      {/* Main Video Call Area + Drawers */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Free4Talk Layout Container: Upper Stage + Bottom Square Member Dock */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between overflow-y-auto max-w-7xl mx-auto w-full gap-4">
          {/* Upper Stage Display */}
          <div className="flex-1 min-h-[220px] sm:min-h-[260px] flex items-center justify-center">
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

          {/* Bottom Dock: Member Square Boxes (Free4Talk Style) */}
          <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-3 sm:p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                  Room Members ({allParticipantsList.length} / {Number(room?.maxParticipants) || 4} Slots)
                </h3>
              </div>
              <span className="text-[11px] text-indigo-400 font-semibold hidden sm:inline">
                ✨ Free4Talk Mode: Every member sees each other in small square boxes
              </span>
            </div>

            {/* Scrollable / Centered Row of Member Square Cards */}
            <div className="flex items-center justify-start sm:justify-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {/* Local User Square Box */}
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

              {/* Remote Peers Square Boxes */}
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

              {/* Empty Capacity Slots */}
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
      </div>

      {/* Bottom Floating Call Controls */}
      <div className="py-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex justify-center z-20">
        <ControlsBar
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isScreenSharing={isScreenSharing}
          isHandRaised={isHandRaised}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onToggleScreenShare={toggleScreenShare}
          onToggleHandRaise={toggleHandRaise}
          onToggleChat={() => {
            setIsChatOpen(!isChatOpen);
            setIsParticipantsOpen(false);
          }}
          onToggleParticipants={() => {
            setIsParticipantsOpen(!isParticipantsOpen);
            setIsChatOpen(false);
          }}
          onLeaveRoom={handleLeave}
          isChatOpen={isChatOpen}
          isParticipantsOpen={isParticipantsOpen}
          unreadMessages={unreadMessages}
        />
      </div>

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
