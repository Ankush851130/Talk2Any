import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { adminApi } from '../services/adminApi';
import {
  FiShield,
  FiUsers,
  FiVideo,
  FiAlertTriangle,
  FiMessageSquare,
  FiSlash,
  FiCheckCircle,
  FiTrash2,
  FiActivity,
} from 'react-icons/fi';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'reports', 'logs'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, reportsRes, logsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getReports(),
        adminApi.getLogs(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (reportsRes.success) setReports(reportsRes.reports || []);
      if (logsRes.success) setLogs(logsRes.logs);
    } catch (err) {
      console.error('Admin fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleBan = async (userId) => {
    const reason = prompt('Reason for ban action:', 'Community guidelines violation');
    if (reason === null) return;

    try {
      const res = await adminApi.toggleBanUser(userId, reason);
      if (res.success) fetchData();
    } catch (err) {
      alert(err.message || 'Ban action failed');
    }
  };

  const handleReportAction = async (reportId, status) => {
    try {
      const res = await adminApi.updateReportStatus(reportId, status);
      if (res.success) fetchData();
    } catch (err) {
      alert(err.message || 'Report action failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <FiShield className="w-7 h-7 text-purple-400" />
              <span>Admin Control Panel</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Platform metrics, user moderation, and compliance logs</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-2 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'overview' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'users' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'reports' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Moderation Reports ({reports.length})
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-3xl p-6 border border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                  <FiUsers className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{stats?.totalUsers || 0}</h3>
                <p className="text-xs text-slate-400 mt-1">Total Registered Users</p>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <FiActivity className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{stats?.onlineUsers || 0}</h3>
                <p className="text-xs text-slate-400 mt-1">Currently Online / In Call</p>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                  <FiVideo className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{stats?.totalRooms || 0}</h3>
                <p className="text-xs text-slate-400 mt-1">Active WebRTC Rooms</p>
              </div>

              <div className="glass-card rounded-3xl p-6 border border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                  <FiAlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{stats?.pendingReports || 0}</h3>
                <p className="text-xs text-slate-400 mt-1">Pending Moderation Reports</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management Table */}
        {activeTab === 'users' && (
          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-900/40">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded-xl bg-slate-800 object-cover" />
                        <span className="font-bold text-white">{u.username}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${u.isBanned ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {u.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleBan(u._id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              u.isBanned ? 'bg-emerald-600 text-white' : 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600 hover:text-white'
                            }`}
                          >
                            {u.isBanned ? 'Unban' : 'Ban User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12">No reports submitted.</p>
            ) : (
              reports.map((rep) => (
                <div key={rep._id} className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                      Reason: {rep.reason}
                    </span>
                    <p className="text-xs text-slate-300 mt-2">
                      Reported by <strong className="text-white">{rep.reporter?.username}</strong> against <strong className="text-rose-300">{rep.reportedUser?.username || 'Room'}</strong>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReportAction(rep._id, 'actioned')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
                    >
                      Action & Close
                    </button>
                    <button
                      onClick={() => handleReportAction(rep._id, 'dismissed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
