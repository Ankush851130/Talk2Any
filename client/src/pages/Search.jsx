import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import RoomCard from '../components/dashboard/RoomCard';
import { roomApi } from '../services/roomApi';
import { userApi } from '../services/userApi';
import { FiSearch, FiGlobe, FiUsers, FiGrid } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleGlobalSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const [roomRes, userRes] = await Promise.all([
        roomApi.getRooms({ search: query }),
        userApi.searchUsers({ query }),
      ]);

      if (roomRes.success) setRooms(roomRes.rooms || []);
      if (userRes.success) setUsers(userRes.users || []);
    } catch (err) {
      console.error('Search error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">Global Search</h1>
          <p className="text-xs text-slate-400">Search for active rooms, study partners, users, or topics</p>

          <form onSubmit={handleGlobalSearch} className="mt-6 flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by User ID (e.g. ID-123456), username, email, or topics..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-white focus:outline-none focus:border-indigo-500 shadow-xl"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {searched && (
          <div className="space-y-12">
            {/* User Results */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <FiUsers className="w-5 h-5 text-indigo-400" />
                <span>Matching Users ({users.length})</span>
              </h3>
              {users.length === 0 ? (
                <p className="text-xs text-slate-500">No users found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => navigate(`/profile/${u.username}`)}
                      className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/30 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={u.avatar} alt={u.username} className="w-10 h-10 rounded-xl bg-slate-800 object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{u.username}</h4>
                          <p className="text-[11px] text-slate-400">{u.country || 'Global'}</p>
                        </div>
                      </div>
                      {u.tagId && (
                        <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-mono font-bold">
                          {u.tagId}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Room Results */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <FiGrid className="w-5 h-5 text-emerald-400" />
                <span>Matching Rooms ({rooms.length})</span>
              </h3>
              {rooms.length === 0 ? (
                <p className="text-xs text-slate-500">No active rooms found matching query.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <RoomCard key={room._id} room={room} onJoin={(r) => navigate(`/room/${r._id}`)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Search;
