const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to access.', 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || 'talk2any_super_secret_access_key_2026_x98z'
    );

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    if (currentUser.isBanned) {
      return next(new AppError(`Your account has been banned. Reason: ${currentUser.banReason || 'Policy violation'}`, 403));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
});

const requireVerifiedEmail = (req, res, next) => {
  next();
};

module.exports = { protect, requireVerifiedEmail };
