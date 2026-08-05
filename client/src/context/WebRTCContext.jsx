import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { soundSynth } from '../utils/soundUtils';

const WebRTCContext = createContext();

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
  ],
};

export const WebRTCProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map()); // socketId -> { stream, user, isMuted, isVideoOff, isScreenSharing, isSpeaking }
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState(new Map()); // socketId -> boolean
  const [currentRoomId, setCurrentRoomId] = useState(null);

  const localStreamRef = useRef(null);
  const currentRoomIdRef = useRef(null);
  const peerConnections = useRef(new Map()); // socketId -> RTCPeerConnection
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const screenTrackRef = useRef(null);

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Audio speaking indicator detection
  const setupAudioAnalysis = (stream) => {
    try {
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) { }
      }

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current || !localStreamRef.current) return;

        const currentTrack = localStreamRef.current.getAudioTracks()[0];
        if (!currentTrack || !currentTrack.enabled || isMutedRef.current) {
          setIsSpeaking((prev) => {
            const rId = currentRoomIdRef.current || currentRoomId;
            if (prev && socket && rId) {
              socket.emit('speaking-status', { roomId: rId, isSpeaking: false });
            }
            return false;
          });
          animationFrameRef.current = requestAnimationFrame(checkVolume);
          return;
        }

        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(() => {});
        }

        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }

        const average = sum / dataArray.length;
        const speaking = average > 8; // Threshold 8 for sensitive speech detection

        setIsSpeaking((prev) => {
          const rId = currentRoomIdRef.current || currentRoomId;
          if (prev !== speaking && socket && rId) {
            socket.emit('speaking-status', { roomId: rId, isSpeaking: speaking });
          }
          return speaking;
        });

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn('Audio analysis setup warning:', err.message);
    }
  };

  // Start Local Media Stream
  const initLocalStream = async (videoEnabled = false, audioEnabled = false, roomId = null) => {
    if (roomId) {
      setCurrentRoomId(roomId);
      currentRoomIdRef.current = roomId;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = audioEnabled;
      }

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = videoEnabled;
      }

      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsVideoOff(!videoEnabled);
      setIsMuted(!audioEnabled);

      if (audioTrack) {
        setupAudioAnalysis(stream);
      }

      return stream;
    } catch (err) {
      console.warn('Dual video+audio media acquisition fallback:', err.message);
      try {
        const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        const audioTrack = audioOnlyStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = audioEnabled;
        }

        localStreamRef.current = audioOnlyStream;
        setLocalStream(audioOnlyStream);
        setIsVideoOff(true);
        setIsMuted(!audioEnabled);

        if (audioTrack) {
          setupAudioAnalysis(audioOnlyStream);
        }
        return audioOnlyStream;
      } catch (fallbackErr) {
        console.error('Audio stream acquisition failed:', fallbackErr.message);
        setIsVideoOff(true);
        setIsMuted(true);
        return null;
      }
    }
  };

  // Create RTCPeerConnection with a peer
  const createPeerConnection = (targetSocketId, targetUser, isInitiator, streamToUse) => {
    if (peerConnections.current.has(targetSocketId)) {
      return peerConnections.current.get(targetSocketId);
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current.set(targetSocketId, pc);

    const activeStream = streamToUse || localStreamRef.current;
    if (activeStream) {
      activeStream.getTracks().forEach((track) => {
        pc.addTrack(track, activeStream);
      });
    }

    // ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('signal-ice-candidate', {
          toSocketId: targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    // Remote Track Handling
    pc.ontrack = (event) => {
      console.log('[WebRTC] Remote track received from:', targetSocketId, event.track.kind);
      setRemoteStreams((prev) => {
        const updated = new Map(prev);
        const existing = updated.get(targetSocketId) || {};

        let currentStream = existing.stream;
        if (!currentStream) {
          if (event.streams && event.streams[0]) {
            currentStream = event.streams[0];
          } else {
            currentStream = new MediaStream();
          }
        }

        if (!currentStream.getTracks().some((t) => t.id === event.track.id)) {
          currentStream.addTrack(event.track);
        }

        const newStream = new MediaStream(currentStream.getTracks());

        updated.set(targetSocketId, {
          ...existing,
          stream: newStream,
          user: targetUser || existing.user,
        });
        return updated;
      });
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        removePeerConnection(targetSocketId);
      }
    };

    // Create Offer if Initiator
    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit('signal-offer', {
            toSocketId: targetSocketId,
            offer: pc.localDescription,
            fromUser: user,
          });
        })
        .catch((err) => console.error('Error creating offer:', err));
    }

    return pc;
  };

  // Remove peer connection
  const removePeerConnection = (targetSocketId) => {
    if (peerConnections.current.has(targetSocketId)) {
      const pc = peerConnections.current.get(targetSocketId);
      pc.close();
      peerConnections.current.delete(targetSocketId);
    }

    setRemoteStreams((prev) => {
      const updated = new Map(prev);
      updated.delete(targetSocketId);
      return updated;
    });
  };

  // Socket Signaling Handlers
  useEffect(() => {
    if (!socket) return;

    // Room Peers received when joining room
    const handleRoomPeers = ({ peers, roomId }) => {
      setCurrentRoomId(roomId);
      currentRoomIdRef.current = roomId;

      peers.forEach((p) => {
        createPeerConnection(p.socketId, p.user, true, localStreamRef.current);
        setRemoteStreams((prev) => {
          const updated = new Map(prev);
          updated.set(p.socketId, {
            stream: null,
            user: p.user,
            isMuted: p.isMuted,
            isVideoOff: p.isVideoOff,
            isScreenSharing: p.isScreenSharing,
          });
          return updated;
        });
      });
    };

    // New User Joined Room
    const handleUserJoinedRoom = ({ peer }) => {
      soundSynth.playJoinSound();
      setRemoteStreams((prev) => {
        const updated = new Map(prev);
        updated.set(peer.socketId, {
          stream: null,
          user: peer.user,
          isMuted: peer.isMuted,
          isVideoOff: peer.isVideoOff,
          isScreenSharing: peer.isScreenSharing,
        });
        return updated;
      });
    };

    // Offer Signal received
    const handleSignalOffer = async ({ fromSocketId, offer, fromUser }) => {
      const pc = createPeerConnection(fromSocketId, fromUser, false, localStreamRef.current);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('signal-answer', {
        toSocketId: fromSocketId,
        answer,
      });
    };

    // Answer Signal received
    const handleSignalAnswer = async ({ fromSocketId, answer }) => {
      if (peerConnections.current.has(fromSocketId)) {
        const pc = peerConnections.current.get(fromSocketId);
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    // ICE Candidate Signal received
    const handleSignalIceCandidate = async ({ fromSocketId, candidate }) => {
      if (peerConnections.current.has(fromSocketId)) {
        const pc = peerConnections.current.get(fromSocketId);
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    // Peer Media status changed
    const handlePeerMediaStatus = ({ socketId, isMuted: m, isVideoOff: v, isScreenSharing: s }) => {
      setRemoteStreams((prev) => {
        const updated = new Map(prev);
        if (updated.has(socketId)) {
          const p = updated.get(socketId);
          updated.set(socketId, {
            ...p,
            isMuted: m !== undefined ? m : p.isMuted,
            isVideoOff: v !== undefined ? v : p.isVideoOff,
            isScreenSharing: s !== undefined ? s : p.isScreenSharing,
          });
        }
        return updated;
      });
    };

    // Peer speaking changed
    const handlePeerSpeaking = ({ socketId, isSpeaking: sp }) => {
      setRemoteStreams((prev) => {
        const updated = new Map(prev);
        if (updated.has(socketId)) {
          const p = updated.get(socketId);
          updated.set(socketId, { ...p, isSpeaking: sp });
        }
        return updated;
      });
    };

    // Peer Hand Raised ✋
    const handlePeerHandRaised = ({ socketId, isHandRaised: raised }) => {
      soundSynth.playHandRaiseSound();
      setRaisedHands((prev) => {
        const updated = new Map(prev);
        updated.set(socketId, raised);
        return updated;
      });
    };

    // User left room
    const handleUserLeftRoom = ({ socketId }) => {
      soundSynth.playLeaveSound();
      removePeerConnection(socketId);
      setRaisedHands((prev) => {
        const updated = new Map(prev);
        updated.delete(socketId);
        return updated;
      });
    };

    socket.on('room-peers', handleRoomPeers);
    socket.on('user-joined-room', handleUserJoinedRoom);
    socket.on('signal-offer', handleSignalOffer);
    socket.on('signal-answer', handleSignalAnswer);
    socket.on('signal-ice-candidate', handleSignalIceCandidate);
    socket.on('peer-media-status-changed', handlePeerMediaStatus);
    socket.on('peer-speaking-changed', handlePeerSpeaking);
    socket.on('peer-hand-raised', handlePeerHandRaised);
    socket.on('user-left-room', handleUserLeftRoom);

    return () => {
      socket.off('room-peers', handleRoomPeers);
      socket.off('user-joined-room', handleUserJoinedRoom);
      socket.off('signal-offer', handleSignalOffer);
      socket.off('signal-answer', handleSignalAnswer);
      socket.off('signal-ice-candidate', handleSignalIceCandidate);
      socket.off('peer-media-status-changed', handlePeerMediaStatus);
      socket.off('peer-speaking-changed', handlePeerSpeaking);
      socket.off('peer-hand-raised', handlePeerHandRaised);
      socket.off('user-left-room', handleUserLeftRoom);
    };
  }, [socket]);

  // Controls: Mute/Unmute
  const toggleMute = async () => {
    let stream = localStreamRef.current || localStream;

    if (!stream) {
      const rId = currentRoomIdRef.current || currentRoomId;
      stream = await initLocalStream(true, true, rId);
    }

    if (stream) {
      let audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioTrack = audioStream.getAudioTracks()[0];
          if (audioTrack) {
            stream.addTrack(audioTrack);
            peerConnections.current.forEach((pc) => {
              pc.addTrack(audioTrack, stream);
            });
          }
        } catch (e) {
          console.error('Error acquiring audio track:', e);
        }
      }

      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const newMutedState = !audioTrack.enabled;
        setIsMuted(newMutedState);

        const updatedStream = new MediaStream(stream.getTracks());
        localStreamRef.current = updatedStream;
        setLocalStream(updatedStream);

        const rId = currentRoomIdRef.current || currentRoomId;
        if (socket && rId) {
          socket.emit('media-status-change', {
            roomId: rId,
            isMuted: newMutedState,
            isVideoOff,
            isScreenSharing,
          });
        }
      }
    }
  };

  // Controls: Toggle Video
  const toggleVideo = async () => {
    let stream = localStreamRef.current || localStream;

    if (!stream) {
      const rId = currentRoomIdRef.current || currentRoomId;
      stream = await initLocalStream(true, true, rId);
    }

    if (stream) {
      let videoTrack = stream.getVideoTracks()[0];

      if (!videoTrack) {
        try {
          const newVidStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          });
          videoTrack = newVidStream.getVideoTracks()[0];
          if (videoTrack) {
            stream.addTrack(videoTrack);
            peerConnections.current.forEach((pc) => {
              pc.addTrack(videoTrack, stream);
            });
          }
        } catch (err) {
          console.warn('Could not acquire video track:', err.message);
        }
      }

      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const newVideoOffState = !videoTrack.enabled;
        setIsVideoOff(newVideoOffState);

        const updatedStream = new MediaStream(stream.getTracks());
        localStreamRef.current = updatedStream;
        setLocalStream(updatedStream);

        const rId = currentRoomIdRef.current || currentRoomId;
        if (socket && rId) {
          socket.emit('media-status-change', {
            roomId: rId,
            isMuted,
            isVideoOff: newVideoOffState,
            isScreenSharing,
          });
        }
      }
    }
  };

  // Controls: Screen Share
  const toggleScreenShare = async () => {
    const stream = localStreamRef.current || localStream;
    const rId = currentRoomIdRef.current || currentRoomId;

    if (isScreenSharing) {
      // Stop screen share
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
      }
      setIsScreenSharing(false);
      // Re-enable camera track if present
      if (stream) {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) videoTrack.enabled = !isVideoOff;
      }
      if (socket && rId) {
        socket.emit('media-status-change', {
          roomId: rId,
          isMuted,
          isVideoOff,
          isScreenSharing: false,
        });
      }
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        // Replace video track in peer connections
        peerConnections.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        setIsScreenSharing(true);
        if (socket && rId) {
          socket.emit('media-status-change', {
            roomId: rId,
            isMuted,
            isVideoOff,
            isScreenSharing: true,
          });
        }

        screenTrack.onended = () => {
          setIsScreenSharing(false);
          if (socket && rId) {
            socket.emit('media-status-change', {
              roomId: rId,
              isMuted,
              isVideoOff,
              isScreenSharing: false,
            });
          }
        };
      } catch (err) {
        console.error('Screen sharing canceled or failed:', err.message);
      }
    }
  };

  // Hand Raise Toggle ✋
  const toggleHandRaise = () => {
    const rId = currentRoomIdRef.current || currentRoomId;
    const newHandState = !isHandRaised;
    setIsHandRaised(newHandState);
    if (newHandState) {
      soundSynth.playHandRaiseSound();
    }
    if (socket && rId) {
      socket.emit('raise-hand', { roomId: rId, isHandRaised: newHandState });
    }
  };

  // Leave room & clean up WebRTC
  const leaveWebRTCRoom = (roomId) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) { }
    }

    const stream = localStreamRef.current || localStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }

    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();
    setRemoteStreams(new Map());
    setRaisedHands(new Map());
    setIsHandRaised(false);

    const rId = roomId || currentRoomIdRef.current || currentRoomId;
    if (socket && rId) {
      socket.emit('leave-room', { roomId: rId });
    }

    setCurrentRoomId(null);
    currentRoomIdRef.current = null;
  };

  return (
    <WebRTCContext.Provider
      value={{
        localStream,
        remoteStreams,
        isMuted,
        isVideoOff,
        isScreenSharing,
        isSpeaking,
        isHandRaised,
        raisedHands,
        currentRoomId,
        initLocalStream,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
        toggleHandRaise,
        leaveWebRTCRoom,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => useContext(WebRTCContext);
