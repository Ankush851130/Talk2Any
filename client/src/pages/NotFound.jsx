import React from 'react';
import { Link } from 'react-router-dom';
import { FiVideo, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/30">
        <FiVideo className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-extrabold text-white tracking-tight mb-3">404</h1>
      <h2 className="text-xl font-bold text-slate-300 mb-2">Room or Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mb-8">
        The WebRTC room or link you were trying to access does not exist or has closed.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
