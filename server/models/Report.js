const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
    },
    details: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed', 'actioned'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
