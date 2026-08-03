const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talk2any';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talk2any'}`);
    console.warn(`[MongoDB] ${error.message}`);
    console.warn(`[MongoDB] Server will continue, but DB operations require a running MongoDB instance or valid MONGODB_URI.`);
  }
};

module.exports = connectDB;
