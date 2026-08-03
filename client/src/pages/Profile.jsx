import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EditProfileModal from '../components/profile/EditProfileModal';
import { userApi } from '../services/userApi';
import { useAuth } from '../context/AuthContext';
import {
  FiUser,
  FiGlobe,
  FiEdit,
  FiUserPlus,
  FiAward,
  FiCheckCircle,
  FiBookOpen,
} from 'react-icons/fi';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const isSelf = !username || username === currentUser?.username;

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const target = isSelf ? currentUser?.username : username;
        if (!target) return;
        const res = await userApi.getProfile(target);
        if (res.success) {
          setProfileUser(res.user);
        }
      } catch (err) {
        setError(err.message || 'Could not load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, currentUser, isSelf]);

  const handleSendFriendRequest = async () => {
    if (!profileUser) return;
    try {
      const res = await userApi.sendFriendRequest(profileUser._id);
      if (res.success) setRequestSent(true);
    } catch (err) {
      alert(err.message || 'Could not send request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const u = isSelf ? currentUser : profileUser;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Banner & Header */}
        <div className="glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={u?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u?.username}`}
              alt={u?.username}
              className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-indigo-500/40 object-cover shadow-2xl"
            />

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start space-x-2">
                    <span>{u?.username}</span>
                    {u?.tagId && (
                      <span className="px-2.5 py-0.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
                        {u?.tagId}
                      </span>
                    )}
                    {u?.role === 'admin' && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                        Admin
                      </span>
                    )}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start space-x-1">
                    <FiGlobe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{u?.country || 'Global'}</span>
                  </p>
                </div>

                {isSelf ? (
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSendFriendRequest}
                    disabled={requestSent}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FiUserPlus className="w-4 h-4" />
                    <span>{requestSent ? 'Request Sent' : 'Add Friend'}</span>
                  </button>
                )}
              </div>

              <p className="text-sm text-slate-300 mt-4 leading-relaxed max-w-2xl">
                {u?.bio || 'No bio specified.'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Spoken & Learning Languages */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <FiBookOpen className="w-4 h-4 text-indigo-400" />
              <span>Languages</span>
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 block mb-2 font-semibold">Native / Spoken:</span>
                <div className="flex flex-wrap gap-2">
                  {u?.languages?.spoken?.map((lang) => (
                    <span key={lang} className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-2 font-semibold">Currently Learning:</span>
                <div className="flex flex-wrap gap-2">
                  {u?.languages?.learning?.length > 0 ? (
                    u.languages.learning.map((lang) => (
                      <span key={lang} className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements & Badges */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <FiAward className="w-4 h-4 text-amber-400" />
              <span>Achievements</span>
            </h3>

            <div className="space-y-3">
              {u?.achievements?.map((ach, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-900">{ach.icon || '🏅'}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                    <p className="text-[11px] text-slate-400">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />

      <Footer />
    </div>
  );
};

export default Profile;
