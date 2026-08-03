import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { FiVideo, FiLock } from 'react-icons/fi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.resetPassword(token, password);
      if (res.success) {
        if (res.token) localStorage.setItem('token', res.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <FiVideo className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">Talk2Any</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Set new password</h2>
        <p className="mt-1 text-xs text-slate-400">Enter a strong new password for your account</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">{error}</div>}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {loading ? 'Resetting...' : 'Update Password & Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
