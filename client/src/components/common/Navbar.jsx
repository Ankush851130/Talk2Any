import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { userApi } from '../../services/userApi';
import {
  FiVideo,
  FiUser,
  FiUsers,
  FiSearch,
  FiBell,
  FiShield,
  FiLogOut,
  FiGrid,
  FiPlusCircle,
} from 'react-icons/fi';

const Navbar = ({ onCreateRoomClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) {
      userApi
        .getNotifications()
        .then((res) => {
          if (res.success) setNotifications(res.notifications);
        })
        .catch((err) => console.warn('Notif fetch error:', err.message));
    }
  }, [user]);

  // Handle clicking outside to close dropdown menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    setShowProfileMenu(false);
    setShowNotifMenu(false);
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <FiVideo className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight brand-logo-text">
              Talk<span className="text-indigo-500 font-black">2</span>Any
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-slate-300 hover:text-white font-medium text-sm transition-colors"
            >
              <FiGrid className="w-4 h-4 text-indigo-400" />
              <span>Rooms</span>
            </Link>
            {user && (
              <Link
                to="/friends"
                className="flex items-center space-x-2 text-slate-300 hover:text-white font-medium text-sm transition-colors"
              >
                <FiUsers className="w-4 h-4 text-emerald-400" />
                <span>Friends</span>
              </Link>
            )}
            <Link
              to="/search"
              className="flex items-center space-x-2 text-slate-300 hover:text-white font-medium text-sm transition-colors"
            >
              <FiSearch className="w-4 h-4 text-amber-400" />
              <span>Search</span>
            </Link>
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-semibold text-sm transition-colors"
              >
                <FiShield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <>
                {onCreateRoomClick && (
                  <button
                    onClick={onCreateRoomClick}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <FiPlusCircle className="w-4 h-4" />
                    <span>Create Room</span>
                  </button>
                )}

                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setShowNotifMenu((prev) => !prev);
                      setShowProfileMenu(false);
                    }}
                    className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <FiBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                        <h4 className="text-sm font-bold text-white">Notifications</h4>
                        <span className="text-xs text-indigo-400">{unreadCount} new</span>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-4">No notifications yet</p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`p-2.5 rounded-xl text-xs ${
                                n.read ? 'bg-slate-900/50 text-slate-400' : 'bg-indigo-950/40 text-slate-200 border border-indigo-500/20'
                              }`}
                            >
                              <p className="font-semibold text-white">{n.title}</p>
                              <p className="text-[11px] text-slate-400">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => {
                      setShowProfileMenu((prev) => !prev);
                      setShowNotifMenu(false);
                    }}
                    className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                      alt={user.username}
                      className="w-9 h-9 rounded-xl border border-indigo-500/40 bg-slate-800 object-cover"
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{user.username}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        {user.tagId && (
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold">
                            {user.tagId}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/profile/${user.username}`}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <FiUser className="w-4 h-4 text-indigo-400" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors mt-1 cursor-pointer"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
