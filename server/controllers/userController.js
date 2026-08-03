const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const Notification = require('../models/Notification');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get User Profile by ID, Tag ID, or Username
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

  const query = isObjectId
    ? { _id: identifier }
    : { $or: [{ username: identifier }, { tagId: identifier }, { email: identifier.toLowerCase() }] };

  const user = await User.findOne(query)
    .populate('followers', 'username avatar country tagId')
    .populate('following', 'username avatar country tagId');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { bio, country, languages, interests, avatar } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User not found', 404));

  if (bio !== undefined) user.bio = bio;
  if (country !== undefined) user.country = country;
  if (languages !== undefined) user.languages = languages;
  if (interests !== undefined) user.interests = interests;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});

// Search Users
exports.searchUsers = catchAsync(async (req, res, next) => {
  const { query, language, country } = req.query;

  const filter = { isBanned: false };

  if (query) {
    const isObjectId = query.match(/^[0-9a-fA-F]{24}$/);
    filter.$or = [
      { username: { $regex: query, $options: 'i' } },
      { tagId: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { bio: { $regex: query, $options: 'i' } },
    ];
    if (isObjectId) {
      filter.$or.push({ _id: query });
    }
  }

  if (country) {
    filter.country = country;
  }

  if (language) {
    filter['languages.spoken'] = language;
  }

  const users = await User.find(filter)
    .select('username tagId email avatar bio country languages status currentRoomId')
    .limit(20);

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// Send Friend Request
exports.sendFriendRequest = catchAsync(async (req, res, next) => {
  const { recipientId } = req.body;

  if (recipientId === req.user.id.toString()) {
    return next(new AppError('You cannot send a friend request to yourself', 400));
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return next(new AppError('Target user not found', 404));
  }

  const existing = await FriendRequest.findOne({
    $or: [
      { sender: req.user.id, receiver: recipientId },
      { sender: recipientId, receiver: req.user.id },
    ],
  });

  if (existing) {
    return next(new AppError('Friend request already exists or you are already friends', 400));
  }

  const request = await FriendRequest.create({
    sender: req.user.id,
    receiver: recipientId,
  });

  await Notification.create({
    recipient: recipientId,
    sender: req.user.id,
    type: 'friend_request',
    title: 'New Friend Request',
    message: `${req.user.username} sent you a friend request.`,
  });

  res.status(201).json({
    success: true,
    message: 'Friend request sent successfully',
    request,
  });
});

// Respond to Friend Request (accept / reject)
exports.respondFriendRequest = catchAsync(async (req, res, next) => {
  const { requestId, action } = req.body; // action: 'accept' or 'reject'

  const request = await FriendRequest.findById(requestId);
  if (!request) return next(new AppError('Friend request not found', 404));

  if (request.receiver.toString() !== req.user.id.toString()) {
    return next(new AppError('Unauthorized to respond to this request', 403));
  }

  if (action === 'accept') {
    request.status = 'accepted';
    await request.save();

    // Add to following/followers
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: request.sender } });
    await User.findByIdAndUpdate(request.sender, { $addToSet: { following: req.user.id } });

    await Notification.create({
      recipient: request.sender,
      sender: req.user.id,
      type: 'system',
      title: 'Friend Request Accepted',
      message: `${req.user.username} accepted your friend request!`,
    });
  } else {
    request.status = 'rejected';
    await request.save();
  }

  res.status(200).json({
    success: true,
    message: `Friend request ${action}ed`,
    request,
  });
});

// Get Friends List & Pending Requests
exports.getFriendsData = catchAsync(async (req, res, next) => {
  const requests = await FriendRequest.find({
    $or: [{ sender: req.user.id }, { receiver: req.user.id }],
  })
    .populate('sender', 'username avatar country status')
    .populate('receiver', 'username avatar country status');

  const user = await User.findById(req.user.id).populate('following', 'username avatar country status bio');

  res.status(200).json({
    success: true,
    friends: user ? user.following : [],
    requests,
  });
});

// Get User Notifications
exports.getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .populate('sender', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(30);

  res.status(200).json({
    success: true,
    notifications,
  });
});

// Mark Notifications as Read
exports.markNotificationsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });

  res.status(200).json({
    success: true,
    message: 'Notifications marked as read',
  });
});
