# Talk2Any API & Socket Documentation

## REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user account.
- `POST /api/auth/login` - Authenticate user & receive JWT token + Refresh Cookie.
- `POST /api/auth/logout` - Clear refresh cookie & update user status to offline.
- `POST /api/auth/refresh` - Refresh access token using refresh token.
- `POST /api/auth/forgot-password` - Generate password reset token.
- `POST /api/auth/reset-password/:token` - Reset account password.
- `GET /api/auth/verify-email/:token` - Verify email address.
- `GET /api/auth/me` - Fetch currently logged-in user profile.

### Rooms (`/api/rooms`)
- `GET /api/rooms` - Query active talk rooms with optional `category`, `language`, `search`.
- `POST /api/rooms` - Create a new room (max 4 participants).
- `GET /api/rooms/:id` - Fetch room details and recent 100 messages.
- `POST /api/rooms/:id/join-check` - Authorize user join & verify room password.
- `DELETE /api/rooms/:id` - Close/delete room (Owner or Admin).

### Users & Social (`/api/users`)
- `GET /api/users/profile/:identifier` - Fetch profile by ID or username.
- `PUT /api/users/profile` - Update bio, country, languages, interests.
- `GET /api/users/search` - Search users by query.
- `GET /api/users/friends` - List user friends & pending requests.
- `POST /api/users/friend-request` - Send friend request.
- `POST /api/users/friend-request/respond` - Accept or reject friend request.

### Admin (`/api/admin`) - Admin Role Required
- `GET /api/admin/stats` - Platform analytics overview.
- `GET /api/admin/users` - List all users with ban controls.
- `PUT /api/admin/users/:id/ban` - Ban or unban user.
- `DELETE /api/admin/rooms/:id` - Force terminate room.
- `GET /api/admin/reports` - View moderation reports.

---

## Socket.IO Events Reference

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `register-user` | Client → Server | `user` object | Binds socket ID to authenticated user ID |
| `join-room` | Client → Server | `{ roomId, user }` | Joins Socket room & broadcasts presence |
| `signal-offer` | Bi-directional | `{ toSocketId, offer, fromUser }` | WebRTC SDP offer signaling |
| `signal-answer` | Bi-directional | `{ toSocketId, answer }` | WebRTC SDP answer signaling |
| `signal-ice-candidate` | Bi-directional | `{ toSocketId, candidate }` | WebRTC ICE candidate trickling |
| `media-status-change` | Client → Server | `{ roomId, isMuted, isVideoOff, isScreenSharing }` | Syncs media toggles across room peers |
| `speaking-status` | Client → Server | `{ roomId, isSpeaking }` | Real-time audio volume detection |
| `send-message` | Client → Server | `{ roomId, content, replyTo }` | Broadcasts new message to room participants |
| `kick-participant` | Owner → Server | `{ roomId, targetSocketId, targetUserId }` | Removes participant from call |
