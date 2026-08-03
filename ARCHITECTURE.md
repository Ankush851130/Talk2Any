# Talk2Any Platform Architecture & WebRTC Mesh

Talk2Any is designed as a hybrid full-stack application separating REST state management from low-latency WebRTC media transport.

---

## WebRTC Full Mesh Topology

```
                       ┌─────────────────────────┐
                       │ Socket.IO Server Relay  │
                       │ (Signaling & Presence) │
                       └───────────┬─────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Peer A (Client) │◄────►│  Peer B (Client) │◄────►│  Peer C (Client) │
└──────────────────┘      └──────────────────┘      └──────────────────┘
         ▲                                                   ▲
         └───────────────────────────────────────────────────┘
                    Direct P2P WebRTC Audio/Video
```

### Why Mesh Topology for Capped 4-Participant Rooms?
1. **Low Latency**: Direct Peer-to-Peer STUN/TURN connection between browsers provides sub-100ms audio/video latency.
2. **Zero Media Server Cost**: No need for SFU (Selective Forwarding Unit) media servers like Mediasoup or Janus for small room sizes.
3. **End-to-End Encryption**: Media streams are encrypted directly between peers using SRTP.

---

## State Management Flow

1. **Auth Context**: Persists JWT access tokens and user profile state. Intercepts HTTP requests to inject `Authorization: Bearer <token>`.
2. **Socket Context**: Maintains single persistent WebSocket connection per logged-in client.
3. **WebRTC Context**: Manages local media stream (`navigator.mediaDevices.getUserMedia`), AudioContext frequency analyzer for speaking detection, and map of `RTCPeerConnection` instances per remote peer.
