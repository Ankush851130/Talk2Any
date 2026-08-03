import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { userApi } from '../services/userApi';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiUserCheck, FiUserPlus, FiUserX, FiGlobe, FiSearch, FiCheck, FiX } from 'react-icons/fi';

const Friends = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'search'
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFriendsData = async () => {
    setLoading(true);
    try {
      const res = await userApi.getFriends();
      if (res.success) {
        setFriends(res.friends || []);
        setRequests(res.requests || []);
      }
    } catch (err) {
      console.error('Fetch friends error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await userApi.searchUsers({ query });
      if (res.success) setSearchResults(res.users || []);
    } catch (err) {
      console.error('User search error:', err.message);
    }
  };

  const handleRespondRequest = async (requestId, action) => {
    try {
      const res = await userApi.respondFriendRequest(requestId, action);
      if (res.success) {
        fetchFriendsData();
      }
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleSendRequest = async (recipientId) => {
    try {
      const res = await userApi.sendFriendRequest(recipientId);
      if (res.success) alert('Friend request sent!');
    } catch (err) {
      alert(err.message || 'Could not send request');
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending' && r.receiver?._id === user?._id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <FiUsers className="w-6 h-6 text-emerald-400" />
              <span>Friends & Connections</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Connect with speakers, study partners, and call buddies</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'friends'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            My Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`relative px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'requests'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Pending Requests ({pendingRequests.length})
            {pendingRequests.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px]">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'search'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Find New Friends
          </button>
        </div>

        {/* Tab 1: Friends List */}
        {activeTab === 'friends' && (
          <div>
            {friends.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-3xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-4">You haven't added any friends yet.</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Find People Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((f) => (
                  <div key={f._id} className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={f.avatar} alt={f.username} className="w-11 h-11 rounded-xl bg-slate-800 object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{f.username}</h4>
                        <p className="text-xs text-slate-400">{f.country || 'Global'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Requests */}
        {activeTab === 'requests' && (
          <div>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-3xl border border-slate-800">
                <p className="text-xs text-slate-400">No pending friend requests at the moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req._id} className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={req.sender?.avatar} alt={req.sender?.username} className="w-10 h-10 rounded-xl bg-slate-800 object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{req.sender?.username}</h4>
                        <p className="text-[11px] text-slate-400">Sent you a friend request</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRespondRequest(req._id, 'accept')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center space-x-1"
                      >
                        <FiCheck className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleRespondRequest(req._id, 'reject')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center space-x-1"
                      >
                        <FiX className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Search Users */}
        {activeTab === 'search' && (
          <div>
            <form onSubmit={handleSearch} className="mb-6 flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users by username..."
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Search
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((u) => (
                <div key={u._id} className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={u.avatar} alt={u.username} className="w-10 h-10 rounded-xl bg-slate-800 object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{u.username}</h4>
                      <p className="text-[11px] text-slate-400">{u.country || 'Global'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendRequest(u._id)}
                    className="p-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-colors"
                    title="Add Friend"
                  >
                    <FiUserPlus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Friends;
