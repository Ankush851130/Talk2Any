const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get All Active Rooms with filtering
exports.getRooms = catchAsync(async (req, res, next) => {
  const { category, language, search } = req.query;

  const query = { isActive: true };

  if (category && category !== 'All') {
    query.category = category;
  }

  if (language && language !== 'Any') {
    query.language = { $regex: language, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Automatically purge empty rooms older than 2 minutes (120,000 ms) from MongoDB
  try {
    const cutoffTime = new Date(Date.now() - 120000);
    const emptyRooms = await Room.find({
      $or: [{ participants: { $size: 0 } }, { participants: { $exists: false } }],
      updatedAt: { $lt: cutoffTime },
    });

    for (const emptyRoom of emptyRooms) {
      await Room.findByIdAndDelete(emptyRoom._id);
      await Message.deleteMany({ room: emptyRoom._id });
    }
  } catch (err) {
    console.warn('[RoomCleanup] Auto purge warning:', err.message);
  }

  const rooms = await Room.find(query)
    .populate('owner', 'username tagId avatar country bio languages role createdAt')
    .populate('participants.user', 'username avatar status')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: rooms.length,
    rooms,
  });
});

// Create Room
exports.createRoom = catchAsync(async (req, res, next) => {
  const { title, description, category, language, level, maxParticipants, isPrivate, password } = req.body;

  const roomCategory = category || 'General';
  const roomTitle = title?.trim() || `${roomCategory} Room`;

  const newRoom = await Room.create({
    title: roomTitle,
    description: description || '',
    category: roomCategory,
    language: language || 'English',
    level: level || 'Any Level',
    maxParticipants: Math.min(maxParticipants || 4, 4),
    isPrivate: Boolean(isPrivate),
    password: password || '',
    owner: req.user.id,
    participants: [],
  });

  const populatedRoom = await Room.findById(newRoom._id)
    .populate('owner', 'username tagId avatar country bio languages role createdAt')
    .populate('participants.user', 'username avatar status');

  res.status(201).json({
    success: true,
    room: populatedRoom,
  });
});

// Get Room By ID
exports.getRoomById = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.id)
    .populate('owner', 'username tagId avatar country bio languages role createdAt')
    .populate('coOwners', 'username avatar')
    .populate('participants.user', 'username avatar status country bio languages interests')
    .populate('bannedUsers', 'username avatar');

  if (!room || !room.isActive) {
    return next(new AppError('Room not found or active', 404));
  }

  // Get recent messages for room
  const messages = await Message.find({ room: room._id })
    .populate('sender', 'username avatar')
    .populate('replyTo')
    .sort({ createdAt: 1 })
    .limit(100);

  res.status(200).json({
    success: true,
    room,
    messages,
  });
});

// Join Room Check (Verifies password and limits before Socket connection)
exports.joinRoomCheck = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const room = await Room.findById(req.params.id);

  if (!room || !room.isActive) {
    return next(new AppError('Room does not exist or has closed', 404));
  }

  // Check if user is banned from room
  if (room.bannedUsers.includes(req.user.id)) {
    return next(new AppError('You are banned from this room', 403));
  }

  // Check if room is locked by owner
  if (room.isLocked && room.owner.toString() !== req.user.id.toString() && !room.coOwners.some(id => id.toString() === req.user.id.toString())) {
    return next(new AppError('This room has been locked by the owner. New participants cannot join right now.', 403));
  }

  // Check max participants
  if (room.participants.length >= room.maxParticipants && !room.participants.some(p => p.user.toString() === req.user.id.toString())) {
    return next(new AppError('Room is full (Maximum 4 participants allowed)', 400));
  }

  // Check password if private
  if (room.isPrivate && room.password) {
    if (password !== room.password) {
      return next(new AppError('Incorrect room password', 401));
    }
  }

  res.status(200).json({
    success: true,
    message: 'Authorized to join room',
  });
});

// Delete / Close Room
exports.deleteRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(new AppError('Room not found', 404));
  }

  if (room.owner.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Only the room owner or an admin can delete this room', 403));
  }

  await Room.findByIdAndDelete(req.params.id);
  await Message.deleteMany({ room: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Room and associated messages permanently deleted from database',
  });
});
