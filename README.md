# Talk2Any - Next-Gen WebRTC Voice & Video Platform

Talk2Any is a production-ready, full-stack WebRTC audio and video community platform inspired by Free4Talk. Built with React 19, Vite, Tailwind CSS, Express, Socket.IO, and MongoDB, Talk2Any provides real-time group calls (up to 4 participants per room), live chat with emojis & replies, friend connections, notifications, moderation controls, and an admin dashboard.

---

## Features

- 🎙️ **WebRTC Audio & Video Call**: Low latency peer-to-peer mesh media calls with Noise Suppression, Echo Cancellation, Speaking Indicator Glow, Camera Toggle, Screen Sharing, Full Screen, and Pin User.
- 💬 **Socket.IO Live Chat**: Real-time messaging, emoji reactions, reply-to thread, pinned messages, typing indicator, and user mentions.
- 🔐 **Complete Authentication**: JWT dual-token system (Access Token + Refresh Token in HTTP-Only cookies), Register, Login, Password Reset, Email Verification flow.
- 🌐 **Room Categories & Filtering**: Rooms organized by Study, Programming, Gaming, Music, Language Exchange, Interview Practice, and General. Capped at 4 participants.
- 🛡️ **Moderation & Security**: Helmet, Rate Limiting, Owner controls (Kick user, Remote mute), Admin Dashboard (Ban users, Terminate rooms, Review reports).
- 🎨 **Modern Aesthetics**: Rich dark mode, glassmorphism UI, smooth Framer Motion micro-animations, and responsive layout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, Framer Motion, Socket.IO Client, React Icons |
| Backend | Node.js, Express.js, Socket.IO, WebRTC Mesh Relay, Mongoose, JWT, bcryptjs, Helmet, Cookie Parser |
| Database | MongoDB Atlas / Local MongoDB |

---

## Quick Start

### 1. Clone & Install Dependencies
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup
Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/talk2any
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### 3. Run Development Servers
```bash
# Start Backend (Port 5000)
cd server
npm run dev

# Start Frontend (Port 5173)
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Documentation

- [Installation Guide](INSTALLATION.md)
- [Environment Variables](ENVIRONMENT_VARIABLES.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Architecture & WebRTC Mesh](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)
