const Report = require('../models/Report');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReport = catchAsync(async (req, res, next) => {
  const { reportedUser, reportedRoom, reason, details } = req.body;

  if (!reason) {
    return next(new AppError('Report reason is required', 400));
  }

  const report = await Report.create({
    reporter: req.user.id,
    reportedUser: reportedUser || null,
    reportedRoom: reportedRoom || null,
    reason,
    details: details || '',
  });

  res.status(201).json({
    success: true,
    message: 'Report submitted successfully to moderators',
    report,
  });
});
