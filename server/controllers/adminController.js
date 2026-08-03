const User = require('../models/User');
const Room = require('../models/Room');
const Report = require('../models/Report');
const Message = require('../models/Message');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get System Dashboard Analytics Stats
exports.getAdminStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const onlineUsers = await User.countDocuments({ status: { $in: ['online', 'in-room'] } });
  const totalRooms = await Room.countDocuments({ isActive: true });
  const pendingReports = await Report.countDocuments({ status: 'pending' });
  const totalMessages = await Message.countDocuments();

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      onlineUsers,
      totalRooms,
      pendingReports,
      totalMessages,
    },
  });
});

// Get All Users (Admin table)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// Ban / Unban User
exports.toggleBanUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { banReason } = req.body;

  const user = await User.findById(userId);
  if (!user) return next(new AppError('User not found', 404));

  if (user.role === 'admin') {
    return next(new AppError('Cannot ban an admin user', 400));
  }

  user.isBanned = !user.isBanned;
  user.banReason = user.isBanned ? banReason || 'Violated community terms' : '';
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
    user,
  });
});

// Admin Delete Room
exports.adminDeleteRoom = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;

  const room = await Room.findById(roomId);
  if (!room) return next(new AppError('Room not found', 404));

  room.isActive = false;
  await room.save();

  res.status(200).json({
    success: true,
    message: 'Room terminated by admin',
  });
});

// Get Reports List
exports.getReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find()
    .populate('reporter', 'username email avatar')
    .populate('reportedUser', 'username email avatar isBanned')
    .populate('reportedRoom', 'title category')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    reports,
  });
});

// Update Report Status
exports.updateReportStatus = catchAsync(async (req, res, next) => {
  const { reportId } = req.params;
  const { status } = req.body; // 'reviewed', 'dismissed', 'actioned'

  const report = await Report.findById(reportId);
  if (!report) return next(new AppError('Report not found', 404));

  report.status = status;
  await report.save();

  res.status(200).json({
    success: true,
    message: 'Report status updated',
    report,
  });
});

// System Activity Logs
exports.getSystemLogs = catchAsync(async (req, res, next) => {
  const recentUsers = await User.find().select('username email createdAt status role').sort({ createdAt: -1 }).limit(10);
  const recentRooms = await Room.find().select('title category owner createdAt isActive').sort({ createdAt: -1 }).limit(10);

  res.status(200).json({
    success: true,
    logs: {
      recentUsers,
      recentRooms,
    },
  });
});
