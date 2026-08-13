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

  const handleToggleNotif = async () => {
    const nextState = !showNotifMenu;
    setShowNotifMenu(nextState);
    setShowProfileMenu(false);

    if (nextState && unreadCount > 0) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      try {
        await userApi.markNotificationsRead();
      } catch (err) {
        console.warn('Notif mark read error:', err.message);
      }
    }
  };

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
                    onClick={handleToggleNotif}
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
                    <div className="absolute right-[-0.5rem] sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm dropdown-menu-panel rounded-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                        <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                          <FiBell className="w-4 h-4 text-indigo-400" />
                          <span>Notifications</span>
                        </h4>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          {unreadCount} new
                        </span>
                      </div>
                      <div className="space-y-2.5 max-h-[65vh] sm:max-h-80 overflow-y-auto pr-1">
                        {notifications.length === 0 ? (
                          <div className="text-center py-8">
                            <FiBell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-40" />
                            <p className="text-xs text-slate-400">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                if (n.link) {
                                  navigate(n.link);
                                  setShowNotifMenu(false);
                                }
                              }}
                              className={`p-3 rounded-xl text-xs transition-all ${
                                n.link ? 'cursor-pointer hover:border-indigo-500/50' : ''
                              } ${
                                n.read
                                  ? 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-900'
                                  : 'bg-indigo-950/90 border border-indigo-500/40 text-slate-100 shadow-sm shadow-indigo-500/10'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <p className="font-bold text-white text-xs mb-0.5">{n.title}</p>
                                {!n.read && (
                                  <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0 ml-2 mt-1"></span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
                              {n.createdAt && (
                                <span className="text-[9px] text-slate-400 block mt-1.5 font-mono">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
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
                    <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] dropdown-menu-panel rounded-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2.5 border-b border-slate-800/80 mb-2 flex items-center justify-between">
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">{user.username}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        {user.tagId && (
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono font-bold flex-shrink-0 ml-2">
                            {user.tagId}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/profile/${user.username}`}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-indigo-600/20 hover:text-white transition-colors"
                      >
                        <FiUser className="w-4 h-4 text-indigo-400" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/20 transition-colors mt-1 cursor-pointer"
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
