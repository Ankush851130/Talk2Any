const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/talk2any';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect to MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;
