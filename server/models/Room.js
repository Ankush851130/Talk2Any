const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    socketId: {
      type: String,
      default: '',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isMuted: {
      type: Boolean,
      default: false,
    },
    isVideoOff: {
      type: Boolean,
      default: false,
    },
    isScreenSharing: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Talk Room',
      trim: true,
      maxlength: [80, 'Room title cannot exceed 80 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [300, 'Room description cannot exceed 300 characters'],
    },
    category: {
      type: String,
      enum: ['Study', 'Programming', 'Gaming', 'Music', 'Language Exchange', 'Interview Practice', 'General'],
      default: 'General',
    },
    language: {
      type: String,
      default: 'English',
    },
    level: {
      type: String,
      enum: ['Any Level', 'Beginner', 'Upper Beginner', 'Intermediate', 'Upper Intermediate', 'Advanced'],
      default: 'Any Level',
    },
    maxParticipants: {
      type: Number,
      default: 4,
      max: 4,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: '',
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coOwners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participants: [participantSchema],
    bannedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    mutedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
