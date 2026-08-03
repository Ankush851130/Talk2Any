# Installation & Setup Guide - Talk2Any

This document provides step-by-step instructions for running Talk2Any locally and setting up developer environments.

---

## Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: Local MongoDB instance (v6+) or a free MongoDB Atlas connection string.

---

## Backend Setup

1. Open terminal and navigate to `/server`:
   ```bash
   cd server
   ```
2. Install npm modules:
   ```bash
   npm install
   ```
3. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```
4. Verify server configuration in `.env`.
5. Run unit tests to confirm setup:
   ```bash
   npm test
   ```
6. Start development server:
   ```bash
   npm run dev
   ```

---

## Frontend Setup

1. Open terminal and navigate to `/client`:
   ```bash
   cd client
   ```
2. Install npm modules:
   ```bash
   npm install
   ```
3. Test production build:
   ```bash
   npm run build
   ```
4. Start Vite dev server:
   ```bash
   npm run dev
   ```

---

## Testing WebRTC Locally
To test WebRTC audio/video calls between multiple participants locally:
1. Open Chrome/Edge at `http://localhost:5173`.
2. Register User 1 and create a room.
3. Open an **Incognito / Private Window** or secondary browser (e.g. Firefox), navigate to `http://localhost:5173`, register User 2, and join the same room.
4. Allow Microphone and Camera permissions when prompted by browser.
