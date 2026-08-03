import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { FiVideo, FiMail, FiCheckCircle } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await authApi.forgotPassword(email);
      if (res.success) {
        setMessage(res.message || 'Reset token generated successfully!');
      }
    } catch (err) {
      setError(err.message || 'Error sending password reset token');
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
        <h2 className="text-2xl font-extrabold text-white">Reset your password</h2>
        <p className="mt-1 text-xs text-slate-400">Enter your account email to receive a password reset link</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">{error}</div>}
            {message && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">{message}</div>}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Remember password? <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
