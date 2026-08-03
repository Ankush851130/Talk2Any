import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { FiVideo, FiShield } from 'react-icons/fi';

const Login = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleLogin({ credential: credentialResponse.credential });
      setLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Google Sign-In failed.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Google Sign-In failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <FiVideo className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">Talk2Any</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Sign In</h2>
        <p className="mt-2 text-sm text-slate-400">
          Secure authentication exclusively via Google.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6 text-center">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Official Secure Google OAuth Button */}
          <div className="flex flex-col items-center justify-center w-full space-y-4 py-4">
            {loading ? (
              <div className="text-sm font-semibold text-indigo-400 animate-pulse">
                Signing in with Google...
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google OAuth authentication failed. Please try again.')}
                  theme="filled_black"
                  size="large"
                  shape="pill"
                  width="100%"
                  text="continue_with"
                />
              </div>
            )}
          </div>

          <div className="pt-4 text-center text-xs text-slate-500 border-t border-slate-900 flex items-center justify-center space-x-1.5">
            <FiShield className="w-4 h-4 text-emerald-400" />
            <span>Registration disabled • Google OAuth 2.0 Encrypted Sign-In</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
