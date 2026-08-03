# Deployment Guide - Talk2Any

This guide outlines deployment of Talk2Any to production cloud services:

- **Frontend**: Vercel
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas

---

## 1. Database Setup (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a cluster and database named `talk2any`.
3. Create a Database User with read/write credentials.
4. Allow access from anywhere (`0.0.0.0/0` IP access entry for cloud hosts).
5. Copy connection URI: `mongodb+srv://<username>:<password>@cluster.mongodb.net/talk2any`.

---

## 2. Backend Deployment (Render / Railway)

### On Render:
1. Connect your repository and choose **Web Service**.
2. Set Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-app.vercel.app`
   - `MONGODB_URI`: `your_atlas_connection_string`
   - `JWT_ACCESS_SECRET`: `random_strong_secret`
   - `JWT_REFRESH_SECRET`: `random_strong_secret`

---

## 3. Frontend Deployment (Vercel)

1. Import your repository into [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Framework Preset: `Vite`.
4. Deploy!
