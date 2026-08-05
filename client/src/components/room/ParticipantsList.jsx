import React from 'react';
import { FiX, FiUserX, FiMicOff, FiGlobe, FiStar } from 'react-icons/fi';
import { useSocket } from '../../context/SocketContext';
import AudioEqualizer from './AudioEqualizer';

const ParticipantsList = ({
  roomId,
  participants = [],
  roomOwnerId,
  coOwnerIds = [],
  currentUserId,
  onClose,
}) => {
  const { socket } = useSocket();

  const isCurrentOwner = roomOwnerId === currentUserId;
  const isCurrentCoOwner = coOwnerIds.includes(currentUserId);
  const canModerate = isCurrentOwner || isCurrentCoOwner;

  const handleKick = (targetSocketId, targetUserId) => {
    if (socket) {
      socket.emit('kick-participant', { roomId, targetSocketId, targetUserId });
    }
  };

  const handleMuteRemote = (targetSocketId) => {
    if (socket) {
      socket.emit('mute-participant-remote', { targetSocketId });
    }
  };

  const handleToggleCoOwner = (targetUserId) => {
    if (socket) {
      socket.emit('toggle-co-owner', { roomId, targetUserId });
    }
  };

  return (
    <div className="w-full md:w-80 h-full bg-slate-900/90 border-l border-slate-800 flex flex-col justify-between z-40 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-bold text-white tracking-tight">Participants</h3>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
            {participants.length}/4
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {participants.map((p) => {
          const userId = p.user?._id;
          const isMe = userId === currentUserId;
          const isOwner = userId === roomOwnerId;
          const isCoOwner = coOwnerIds.includes(userId);

          return (
            <div
              key={p.socketId || userId}
              className={`p-3 rounded-2xl bg-slate-950/60 border transition-all flex items-center justify-between gap-2 ${
                p.isSpeaking ? 'border-emerald-500/80 shadow-[0_0_12px_rgba(34,197,94,0.25)]' : 'border-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={p.user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.user?.username}`}
                    alt={p.user?.username}
                    className={`w-9 h-9 rounded-xl bg-slate-800 object-cover border ${
                      p.isSpeaking ? 'border-emerald-400 ring-2 ring-emerald-500/50' : 'border-slate-700'
                    }`}
                  />
                  {p.isSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 border border-slate-900 shadow">
                      <AudioEqualizer size="sm" isSpeaking={true} />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white flex items-center space-x-1.5 truncate">
                    <span className="truncate">{p.user?.username}</span>
                    {p.isSpeaking && <AudioEqualizer size="sm" isSpeaking={true} />}
                    {isMe && <span className="text-[10px] text-indigo-400">(You)</span>}
                    {isOwner && <span className="text-amber-400 font-bold text-[10px]" title="Room Creator / Owner">👑</span>}
                    {isCoOwner && !isOwner && <span className="text-purple-400 font-bold text-[10px]" title="Co-Owner">⭐</span>}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <FiGlobe className="w-3 h-3 text-emerald-400 inline" />
                    <span>{p.user?.country || 'Global'}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                {/* Toggle Co-Owner (Owner only) */}
                {isCurrentOwner && !isOwner && !isMe && (
                  <button
                    onClick={() => handleToggleCoOwner(userId)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isCoOwner
                        ? 'bg-purple-600/30 text-purple-300 border-purple-500/40 hover:bg-purple-600'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-amber-400 hover:bg-slate-800'
                    }`}
                    title={isCoOwner ? 'Revoke Co-Ownership' : 'Grant Co-Ownership'}
                  >
                    <FiStar className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Moderation Controls (Owner & Co-Owner) */}
                {canModerate && !isMe && !isOwner && (
                  <>
                    <button
                      onClick={() => handleMuteRemote(p.socketId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Remote Mute"
                    >
                      <FiMicOff className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleKick(p.socketId, userId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Kick Participant"
                    >
                      <FiUserX className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantsList;
