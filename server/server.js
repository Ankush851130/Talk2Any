const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');
const setupSocket = require('./services/socketService');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const server = http.createServer(app);

// Dynamic CORS origin function
const allowOrigin = (origin, callback) => {
  if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
    callback(null, true);
  } else {
    callback(null, true);
  }
};

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  pingTimeout: 60000,
});

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'Talk2Any WebRTC Platform',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// Socket.IO Handlers
setupSocket(io);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find route ${req.originalUrl} on Talk2Any server`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Server Listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[Talk2Any Backend] Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = { app, server };
