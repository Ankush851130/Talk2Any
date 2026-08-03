import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiVideo, FiArrowRight, FiInfo } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <FiVideo className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">Talk2Any</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Registration Info</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FiInfo className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">Google Sign-In Only</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manual registration has been disabled. Talk2Any now exclusively authenticates users through Google Sign-In.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Redirecting you to the Google Sign-In page...
          </div>

          <Link
            to="/login"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FcGoogle className="w-5 h-5 bg-white rounded-full p-0.5" />
            <span>Go to Google Sign-In</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
