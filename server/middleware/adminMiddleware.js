const AppError = require('../utils/appError');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError('Permission denied. Admin privileges required.', 403));
};

module.exports = { adminOnly };
