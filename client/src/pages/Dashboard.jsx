import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import RoomCard from '../components/dashboard/RoomCard';
import RoomFilter from '../components/dashboard/RoomFilter';
import RoomCreateModal from '../components/dashboard/RoomCreateModal';
import RoomDetailsModal from '../components/dashboard/RoomDetailsModal';
import Modal from '../components/common/Modal';
import { roomApi } from '../services/roomApi';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { FiPlus, FiLock, FiUsers, FiRefreshCw, FiVolume2, FiGrid } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [language, setLanguage] = useState('Any');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [passwordModalRoom, setPasswordModalRoom] = useState(null);
  const [detailsModalRoom, setDetailsModalRoom] = useState(null);
  const [roomPassword, setRoomPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [gridCols, setGridCols] = useState(3);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomApi.getRooms({
        category: category !== 'All' ? category : '',
        language: language !== 'Any' ? language : '',
        search,
      });
      if (res.success) {
        setRooms(res.rooms);
      }
    } catch (err) {
      console.error('Fetch rooms error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [category, language, search]);

  // Real-time listener for auto-deleted rooms
  useEffect(() => {
    if (!socket) return;
    const handleRoomDeleted = ({ roomId }) => {
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
    };

    socket.on('room-deleted', handleRoomDeleted);
    return () => {
      socket.off('room-deleted', handleRoomDeleted);
    };
  }, [socket]);

  const { sendOtpCode, verifyOtpCode } = useAuth();
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpMsg, setOtpMsg] = useState('');
  const [devCodeHint, setDevCodeHint] = useState('');

  const handleSendOtp = async () => {
    setSendingOtp(true);
    setOtpMsg('');
    setDevCodeHint('');
    const res = await sendOtpCode();
    setSendingOtp(false);
    if (res.success) {
      setOtpSent(true);
      setOtpMsg(res.message);
      if (res.devOtp) setDevCodeHint(res.devOtp);
    } else {
      setOtpMsg(res.message || 'Failed to send verification code');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length !== 6) {
      return setOtpMsg('Please enter a valid 6-digit code');
    }
    setVerifyingOtp(true);
    setOtpMsg('');
    const res = await verifyOtpCode(otpInput);
    setVerifyingOtp(false);
    if (res.success) {
      setOtpMsg('Email verified successfully! Full room access unlocked.');
      setTimeout(() => {
        setIsVerifyModalOpen(false);
        setOtpMsg('');
        setOtpInput('');
        setOtpSent(false);
      }, 1500);
    } else {
      setOtpMsg(res.message || 'Incorrect verification code');
    }
  };

  const handleJoinRoom = async (room) => {
    if (room.isPrivate) {
      setPasswordModalRoom(room);
      setRoomPassword('');
      setPasswordError('');
    } else {
      navigate(`/room/${room._id}`);
    }
  };

  const handleCreateRoomClick = () => {
    setIsCreateModalOpen(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordModalRoom) return;

    try {
      const res = await roomApi.joinRoomCheck(passwordModalRoom._id, roomPassword);
      if (res.success) {
        setPasswordModalRoom(null);
        navigate(`/room/${passwordModalRoom._id}`);
      }
    } catch (err) {
      setPasswordError(err.message || 'Incorrect room password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar onCreateRoomClick={handleCreateRoomClick} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Welcome Header & Action Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
              alt={user?.username}
              className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-indigo-500/40 object-cover shadow-xl"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                <span>Welcome back, {user?.username || 'Learner'}!</span>
                <span className="text-xl">👋</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Spoken: <strong className="text-indigo-300">{user?.languages?.spoken?.join(', ') || 'English'}</strong> • Country: <strong className="text-emerald-300">{user?.country || 'Global'}</strong>
                {user?.isVerified ? (
                  <span className="ml-2 inline-flex items-center text-emerald-400 text-xs font-bold">
                    ✓ Verified Account
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center text-amber-400 text-xs font-bold">
                    ⚠ Unverified Email
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={handleCreateRoomClick}
              className="flex-1 md:flex-initial px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create Talk Room</span>
            </button>
            <button
              onClick={fetchRooms}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh Room List"
            >
              <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Room Filter Controls */}
        <RoomFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          language={language}
          setLanguage={setLanguage}
          gridCols={gridCols}
          setGridCols={setGridCols}
        />

        {/* Active Rooms Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <FiGrid className="w-5 h-5 text-sky-400" />
              <span>Active Talk Rooms ({rooms.length})</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Max 4 participants per room</span>
          </div>

          {loading ? (
            <div className={`grid gap-6 ${
              gridCols === 1
                ? 'grid-cols-1 max-w-3xl mx-auto'
                : gridCols === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-48 rounded-3xl bg-slate-900/60 border border-slate-800/80 animate-pulse"></div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-12 rounded-3xl glass-card text-center border border-slate-800 max-w-md mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <FiVolume2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">No Active Rooms Found</h3>
              <p className="text-xs text-slate-400 mb-6">Be the first to start a conversation in this category!</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
              >
                Create Room Now
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              gridCols === 1
                ? 'grid-cols-1 max-w-3xl mx-auto'
                : gridCols === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onJoin={handleJoinRoom}
                  onOpenDetails={(r) => setDetailsModalRoom(r)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Room Modal */}
      <RoomCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(room) => navigate(`/room/${room._id}`)}
      />

      {/* Room & Creator Information Modal (Free4Talk feature) */}
      <RoomDetailsModal
        isOpen={Boolean(detailsModalRoom)}
        onClose={() => setDetailsModalRoom(null)}
        room={detailsModalRoom}
        onJoin={handleJoinRoom}
      />

      {/* Password Protected Room Modal */}
      <Modal
        isOpen={Boolean(passwordModalRoom)}
        onClose={() => setPasswordModalRoom(null)}
        title="Enter Room Password"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 text-xs text-amber-400 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <FiLock className="w-4 h-4 flex-shrink-0" />
            <span>This room is password protected by the owner.</span>
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {passwordError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Room Password
            </label>
            <input
              type="password"
              required
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
          >
            Unlock & Join Call
          </button>
        </form>
      </Modal>

      {/* Email Security Verification Modal */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Email Identity Verification"
      >
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-2xl">
            🛡️
          </div>
          <h3 className="text-sm font-bold text-white">
            Verify 6-Digit Code for {user?.email}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To eliminate fake accounts and scam identities, Talk2Any sends a <strong>6-digit verification code</strong> to your logged-in email. You must enter the code below to unlock call rooms.
          </p>

          {devCodeHint && (
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold tracking-widest text-center">
              [DEV MODE EMAIL OTP HINT]: {devCodeHint}
            </div>
          )}

          {otpMsg && (
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
              {otpMsg}
            </div>
          )}

          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {sendingOtp ? 'Sending 6-Digit Code...' : `Send 6-Digit Code to ${user?.email}`}
            </button>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="e.g. 749201"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl font-extrabold text-indigo-400 focus:outline-none focus:border-indigo-500 tracking-widest"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={verifyingOtp}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  {verifyingOtp ? 'Verifying Code...' : 'Verify Code & Unlock'}
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Resend
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default Dashboard;
