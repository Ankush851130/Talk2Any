import React from 'react';
import { Link } from 'react-router-dom';
import { FiVideo, FiGithub, FiTwitter, FiGlobe, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Col */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
              <FiVideo className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Talk2Any</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The next-generation WebRTC audio & video community platform for global language exchange, peer learning, and practice calls.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Browse Rooms</Link></li>
            <li><Link to="/search" className="hover:text-indigo-400 transition-colors">Find People</Link></li>
            <li><Link to="/friends" className="hover:text-indigo-400 transition-colors">Friends Network</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-indigo-400 cursor-pointer">Language Exchange</span></li>
            <li><span className="hover:text-indigo-400 cursor-pointer">Study & Work</span></li>
            <li><span className="hover:text-indigo-400 cursor-pointer">Programming</span></li>
            <li><span className="hover:text-indigo-400 cursor-pointer">Interview Practice</span></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Community</h4>
          <div className="flex space-x-3 mb-4">
            <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition-colors"><FiGithub className="w-4 h-4" /></a>
            <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition-colors"><FiTwitter className="w-4 h-4" /></a>
            <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition-colors"><FiGlobe className="w-4 h-4" /></a>
          </div>
          <p className="text-xs text-slate-500">Built for seamless WebRTC communication.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Talk2Any Platform. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Crafted with</span> <FiHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> <span>for global connections</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
