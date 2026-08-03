require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');
const Message = require('./models/Message');

const clearAllRooms = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is missing!');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('[Clear] Connected to MongoDB Atlas...');

    const deletedRooms = await Room.deleteMany({});
    const deletedMessages = await Message.deleteMany({});

    console.log(`[Clear] Successfully deleted ${deletedRooms.deletedCount} rooms and ${deletedMessages.deletedCount} messages from MongoDB! 🧹`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Clear] Error clearing rooms:', err.message);
    process.exit(1);
  }
};

clearAllRooms();
