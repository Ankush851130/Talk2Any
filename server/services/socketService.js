const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');

const activeSockets = new Map(); // socketId -> { userId, username, avatar }
const roomParticipants = new Map(); // roomId -> Map of socketId -> participantInfo
const emptyRoomTimers = new Map(); // roomId -> NodeJS.Timeout (2-minute auto-delete)

// Instantly / Fast Purge Room if empty
const purgeEmptyRoom = async (roomId, io) => {
  try {
    if (emptyRoomTimers.has(roomId)) {
      clearTimeout(emptyRoomTimers.get(roomId));
      emptyRoomTimers.delete(roomId);
    }

    const roomMap = roomParticipants.get(roomId);
    const hasSockets = roomMap && roomMap.size > 0;

    if (!hasSockets) {
      await Room.findByIdAndDelete(roomId);
      await Message.deleteMany({ room: roomId });
      roomParticipants.delete(roomId);

      console.log(`[AutoDelete] Empty room ${roomId} and associated messages permanently deleted.`);
      if (io) {
        io.emit('room-deleted', { roomId });
      }
    }
  } catch (err) {
    console.error(`[AutoDelete] Error purging room ${roomId}:`, err.message);
  }
};

// Schedule room auto-deletion with a 2-minute grace period
const scheduleRoomAutoDelete = (roomId, io, delayMs = 120000) => {
  if (emptyRoomTimers.has(roomId)) {
    clearTimeout(emptyRoomTimers.get(roomId));
  }

  console.log(`[AutoDelete] Scheduled ${delayMs / 1000}s auto-deletion check for room: ${roomId}`);

  const timer = setTimeout(() => {
    purgeEmptyRoom(roomId, io);
  }, delayMs);

  emptyRoomTimers.set(roomId, timer);
};

// Cancel room auto-deletion timer if someone joins
const cancelRoomAutoDelete = (roomId) => {
  if (emptyRoomTimers.has(roomId)) {
    clearTimeout(emptyRoomTimers.get(roomId));
    emptyRoomTimers.delete(roomId);
    console.log(`[AutoDelete] Canceled auto-deletion for room ${roomId} (participant joined)`);
  }
};

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Register User Online Presence
    socket.on('register-user', async (user) => {
      if (!user || !user._id) return;
      activeSockets.set(socket.id, {
        userId: user._id.toString(),
        username: user.username,
        avatar: user.avatar,
      });

      socket.userId = user._id.toString();
      try {
        await User.findByIdAndUpdate(user._id, { status: 'online' });
        socket.broadcast.emit('user-status-changed', {
          userId: user._id,
          status: 'online',
        });
      } catch (err) {
        console.error('Error updating user online status:', err.message);
      }
    });

    // Join Room
    socket.on('join-room', async ({ roomId, user }) => {
      if (!roomId || !user) return;

      // Cancel auto-delete timer if room was empty
      cancelRoomAutoDelete(roomId);

      socket.join(roomId);
      socket.currentRoomId = roomId;

      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, new Map());
      }

      const roomMap = roomParticipants.get(roomId);

      // Max 4 check
      if (roomMap.size >= 4 && !roomMap.has(socket.id)) {
        socket.emit('room-full', { message: 'Room has reached maximum capacity of 4 participants' });
        return;
      }

      const participantInfo = {
        socketId: socket.id,
        user: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          country: user.country,
        },
        isMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
      };

      roomMap.set(socket.id, participantInfo);

      // Get existing participants to send to joining user
      const existingPeers = Array.from(roomMap.values()).filter((p) => p.socketId !== socket.id);

      // Notify existing users in room about new user
      socket.to(roomId).emit('user-joined-room', {
        peer: participantInfo,
      });

      // Send current participants list to joining user
      socket.emit('room-peers', {
        peers: existingPeers,
        roomId,
      });

      // Update room in DB
      try {
        await Room.findByIdAndUpdate(roomId, {
          $addToSet: {
            participants: {
              user: user._id,
              socketId: socket.id,
            },
          },
        });
        await User.findByIdAndUpdate(user._id, { status: 'in-room', currentRoomId: roomId });
      } catch (err) {
        console.error('DB update room join error:', err.message);
      }
    });

    // WebRTC Signaling: Offer
    socket.on('signal-offer', ({ toSocketId, offer, fromUser }) => {
      io.to(toSocketId).emit('signal-offer', {
        fromSocketId: socket.id,
        offer,
        fromUser,
      });
    });

    // WebRTC Signaling: Answer
    socket.on('signal-answer', ({ toSocketId, answer }) => {
      io.to(toSocketId).emit('signal-answer', {
        fromSocketId: socket.id,
        answer,
      });
    });

    // WebRTC Signaling: ICE Candidate
    socket.on('signal-ice-candidate', ({ toSocketId, candidate }) => {
      io.to(toSocketId).emit('signal-ice-candidate', {
        fromSocketId: socket.id,
        candidate,
      });
    });

    // Media Status Toggle (Mute, Video Off, Screen Share)
    socket.on('media-status-change', ({ roomId, isMuted, isVideoOff, isScreenSharing }) => {
      if (roomParticipants.has(roomId)) {
        const roomMap = roomParticipants.get(roomId);
        if (roomMap.has(socket.id)) {
          const p = roomMap.get(socket.id);
          p.isMuted = isMuted;
          p.isVideoOff = isVideoOff;
          p.isScreenSharing = isScreenSharing;
        }
      }

      socket.to(roomId).emit('peer-media-status-changed', {
        socketId: socket.id,
        isMuted,
        isVideoOff,
        isScreenSharing,
      });
    });

    // Speaking Indicator Status
    socket.on('speaking-status', ({ roomId, isSpeaking }) => {
      socket.to(roomId).emit('peer-speaking-changed', {
        socketId: socket.id,
        isSpeaking,
      });
    });

    // Real-Time Chat Message
    socket.on('send-message', async ({ roomId, content, type = 'text', fileUrl = '', replyTo = null, mentions = [] }) => {
      const userInfo = activeSockets.get(socket.id);
      if (!userInfo || !roomId || !content) return;

      try {
        const messageDoc = await Message.create({
          room: roomId,
          sender: userInfo.userId,
          content,
          type,
          fileUrl,
          replyTo,
          mentions,
        });

        const populatedMsg = await Message.findById(messageDoc._id).populate('sender', 'username avatar');

        io.in(roomId).emit('new-message', populatedMsg);
      } catch (err) {
        console.error('Error saving socket message:', err.message);
      }
    });

    // Typing Indicator
    socket.on('typing', ({ roomId }) => {
      const userInfo = activeSockets.get(socket.id);
      if (userInfo) {
        socket.to(roomId).emit('user-typing', {
          username: userInfo.username,
          socketId: socket.id,
        });
      }
    });

    socket.on('stop-typing', ({ roomId }) => {
      socket.to(roomId).emit('user-stop-typing', { socketId: socket.id });
    });

    // Moderation: Toggle Co-Ownership
    socket.on('toggle-co-owner', async ({ roomId, targetUserId }) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) return;

        // Check if requester is owner
        if (room.owner.toString() !== socket.userId && socket.userRole !== 'admin') {
          socket.emit('room-error', { message: 'Only the room creator can grant or revoke co-ownership.' });
          return;
        }

        const isCoOwner = room.coOwners.some((id) => id.toString() === targetUserId.toString());
        if (isCoOwner) {
          room.coOwners = room.coOwners.filter((id) => id.toString() !== targetUserId.toString());
        } else {
          room.coOwners.push(targetUserId);
        }
        await room.save();

        const updatedRoom = await Room.findById(roomId).populate('coOwners', 'username avatar');

        io.in(roomId).emit('co-owners-updated', {
          coOwners: updatedRoom.coOwners,
          targetUserId,
          isCoOwner: !isCoOwner,
        });
      } catch (err) {
        console.error('Error toggling co-ownership:', err.message);
      }
    });

    // Moderation: Kick Participant
    socket.on('kick-participant', async ({ roomId, targetSocketId, targetUserId }) => {
      try {
        const room = await Room.findById(roomId);
        const isOwner = room && room.owner.toString() === socket.userId;
        const isCoOwner = room && room.coOwners.some((id) => id.toString() === socket.userId);

        if (!isOwner && !isCoOwner && socket.userRole !== 'admin') {
          socket.emit('room-error', { message: 'You do not have permission to kick participants.' });
          return;
        }

        io.to(targetSocketId).emit('kicked-from-room', { reason: 'Kicked by room owner/co-owner' });

        // Add target user to banned list in DB
        if (targetUserId) {
          await Room.findByIdAndUpdate(roomId, { $addToSet: { bannedUsers: targetUserId } });
        }
      } catch (err) {
        console.error('Kick participant error:', err.message);
      }
    });

    // Moderation: Remote Mute Participant
    socket.on('mute-participant-remote', ({ targetSocketId }) => {
      io.to(targetSocketId).emit('remote-muted', { message: 'You were muted by a room owner/co-owner' });
    });

    // Room Lock Toggle (1-click lock/unlock room)
    socket.on('toggle-room-lock', async ({ roomId }) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) return;

        const isOwner = room.owner.toString() === socket.userId;
        const isCoOwner = room.coOwners.some((id) => id.toString() === socket.userId);

        if (!isOwner && !isCoOwner && socket.userRole !== 'admin') {
          socket.emit('room-error', { message: 'Only room owner or co-owners can lock or unlock the room.' });
          return;
        }

        room.isLocked = !room.isLocked;
        await room.save();

        io.in(roomId).emit('room-lock-updated', { isLocked: room.isLocked });
        io.emit('room-updated', { roomId: room._id, isLocked: room.isLocked });
      } catch (err) {
        console.error('Toggle room lock error:', err.message);
      }
    });

    // Dynamic Room Capacity Update (2, 3, 4 participants)
    socket.on('update-room-capacity', async ({ roomId, maxParticipants }) => {
      try {
        const room = await Room.findById(roomId);
        if (!room) return;

        const isOwner = room.owner.toString() === socket.userId;
        const isCoOwner = room.coOwners.some((id) => id.toString() === socket.userId);

        if (!isOwner && !isCoOwner && socket.userRole !== 'admin') {
          socket.emit('room-error', { message: 'Only room owner or co-owners can change room capacity.' });
          return;
        }

        const validCap = Math.min(Math.max(parseInt(maxParticipants) || 4, 2), 4);
        room.maxParticipants = validCap;
        await room.save();

        io.in(roomId).emit('room-capacity-updated', { maxParticipants: validCap });
        io.emit('room-updated', { roomId: room._id, maxParticipants: validCap });
      } catch (err) {
        console.error('Update room capacity error:', err.message);
      }
    });

    // Hand Raise ✋
    socket.on('raise-hand', ({ roomId, isHandRaised }) => {
      socket.to(roomId).emit('peer-hand-raised', {
        socketId: socket.id,
        isHandRaised: Boolean(isHandRaised),
      });
    });

    // Pin Message
    socket.on('pin-message', async ({ roomId, messageId }) => {
      const msg = await Message.findById(messageId);
      if (msg) {
        msg.pinned = !msg.pinned;
        await msg.save();
        io.in(roomId).emit('message-pinned-updated', { messageId, pinned: msg.pinned });
      }
    });

    // Delete Message
    socket.on('delete-message', async ({ roomId, messageId }) => {
      await Message.findByIdAndDelete(messageId);
      io.in(roomId).emit('message-deleted-socket', { messageId });
    });

    // Leave Room
    const handleLeaveRoom = async (roomId) => {
      if (!roomId) return;
      socket.leave(roomId);

      let roomIsEmpty = false;
      if (roomParticipants.has(roomId)) {
        const roomMap = roomParticipants.get(roomId);
        roomMap.delete(socket.id);

        if (roomMap.size === 0) {
          roomIsEmpty = true;
        }
      } else {
        roomIsEmpty = true;
      }

      socket.to(roomId).emit('user-left-room', { socketId: socket.id });

      if (socket.userId) {
        try {
          await Room.findByIdAndUpdate(roomId, {
            $pull: { participants: { socketId: socket.id } },
          });
          await User.findByIdAndUpdate(socket.userId, { status: 'online', currentRoomId: null });
        } catch (err) {
          console.error('Leave room DB error:', err.message);
        }
      }

      // Check DB participants count for accuracy
      const dbRoom = await Room.findById(roomId);
      if (!dbRoom || dbRoom.participants.length === 0 || roomIsEmpty) {
        scheduleRoomAutoDelete(roomId, io, 120000);
      }
    };

    socket.on('leave-room', ({ roomId }) => {
      handleLeaveRoom(roomId);
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);

      const roomsToLeave = new Set();
      if (socket.currentRoomId) {
        roomsToLeave.add(socket.currentRoomId);
      }

      for (const [rId, roomMap] of roomParticipants.entries()) {
        if (roomMap.has(socket.id)) {
          roomsToLeave.add(rId);
        }
      }

      for (const rId of roomsToLeave) {
        await handleLeaveRoom(rId);
      }

      if (socket.userId) {
        activeSockets.delete(socket.id);
        try {
          await User.findByIdAndUpdate(socket.userId, { status: 'online', currentRoomId: null });
          socket.broadcast.emit('user-status-changed', {
            userId: socket.userId,
            status: 'offline',
          });
        } catch (err) {
          console.error('Disconnect status error:', err.message);
        }
      }
    });
  });
};

module.exports = setupSocket;
