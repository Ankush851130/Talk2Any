import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  FiVideo,
  FiMic,
  FiUsers,
  FiShield,
  FiGlobe,
  FiZap,
  FiCheckCircle,
  FiHelpCircle,
  FiArrowRight,
  FiLock,
} from 'react-icons/fi';

const categories = [
  { name: 'Language Exchange', icon: '🌐', count: '128+ active calls', desc: 'Practice speaking English, Spanish, Japanese, French & more.' },
  { name: 'Study & Focus', icon: '📚', count: '94+ active rooms', desc: 'Silent study sessions, Pomodoro timers, and peer accountability.' },
  { name: 'Programming & Tech', icon: '💻', count: '76+ active calls', desc: 'Discuss WebRTC, React, Node.js, AI, and code together.' },
  { name: 'Interview Practice', icon: '🎯', count: '45+ active calls', desc: 'Mock interviews, peer feedback, and soft skills training.' },
  { name: 'Gaming Lounge', icon: '🎮', count: '110+ active rooms', desc: 'Casual squad comms, strategy talk, and casual gaming.' },
  { name: 'Music & Vibes', icon: '🎵', count: '52+ active rooms', desc: 'Share beats, jam sessions, and listen to music together.' },
];

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Language Learner',
    country: 'United Kingdom',
    text: 'Talk2Any made practicing spoken Spanish effortless. The 4-person room limit creates intimate, focused conversations without chaos!',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah',
  },
  {
    name: 'Kenji Sato',
    role: 'Software Engineer',
    country: 'Japan',
    text: 'The WebRTC audio clarity and low latency screen sharing are incredible. Best platform for pair programming and tech mock interviews.',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kenji',
  },
  {
    name: 'Elena Rostova',
    role: 'University Student',
    country: 'Germany',
    text: 'I use the Study rooms every single day. The UI is gorgeous, dark mode is super slick, and the community is super welcoming.',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena',
  },
];

const faqs = [
  {
    q: 'How does Talk2Any work?',
    a: 'Talk2Any is a WebRTC-powered platform where you can join or create audio/video call rooms. Rooms are capped at 4 participants for crystal-clear peer-to-peer performance.',
  },
  {
    q: 'Is Talk2Any completely free to use?',
    a: 'Yes! Talk2Any is free for all users. You can create public or private password-protected rooms anytime.',
  },
  {
    q: 'Why is there a 4 participant limit per room?',
    a: 'Peer-to-peer WebRTC mesh architecture works best in small group sizes (up to 4 participants), delivering low latency, high quality audio/video without lag.',
  },
  {
    q: 'Are my video and voice calls secure?',
    a: 'Yes, all peer-to-peer audio and video media streams are encrypted end-to-end using standard WebRTC SRTP protocols.',
  },
];

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-900">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <FiZap className="w-3.5 h-3.5" />
              <span>Next-Gen WebRTC Platform</span>
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Speak, Study & Connect <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                With Anyone, Anywhere
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
              Join instant 4-person WebRTC voice & video rooms. Practice languages, study with peers, code together, or hang out in a modern glassmorphic environment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Browse Active Rooms</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all"
              >
                Sign In with Google
              </Link>
            </div>
          </motion.div>

          {/* Interactive Live Room Preview Grid */}
          <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="glass-card rounded-3xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  Language Exchange
                </span>
                <span className="text-xs text-slate-400">3/4 Live</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Spanish - English Practice Call</h4>
              <p className="text-xs text-slate-400 mb-4">Intermediate speakers welcome. Friendly feedback!</p>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>WebRTC Audio Active</span>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-5 border border-indigo-500/30 ring-1 ring-indigo-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                  Programming
                </span>
                <span className="text-xs text-indigo-400 font-bold">2/4 Live</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">React 19 & WebRTC Architecture</h4>
              <p className="text-xs text-slate-400 mb-4">Sharing screen, debugging full-stack code.</p>
              <div className="flex items-center space-x-2 text-xs text-indigo-300">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
                <span>Screen Share Enabled</span>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                  Study Room
                </span>
                <span className="text-xs text-slate-400">4/4 Full</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Silent Pomodoro Study Call</h4>
              <p className="text-xs text-slate-400 mb-4">50 min focus, 10 min break. Muted mics.</p>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <FiLock className="w-3 h-3 text-amber-400" />
                <span>Password Protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
            Engineered for Modern Communication
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need for seamless audio, video, real-time messaging, and peer networking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-3xl p-8 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6">
              <FiMic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">WebRTC Crystal Audio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native browser WebRTC peer connection with automatic noise suppression, echo cancellation, and active speaking indicators.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-6">
              <FiVideo className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">HD Video & Screen Share</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Camera controls, full screen toggle, speaker pinning, and 1080p display screen sharing for live pair programming or presentations.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6">
              <FiUsers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Friends & Moderation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add friends, send room invites, manage friend requests, and control rooms with owner kick and mute permissions.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white">Popular Room Categories</h2>
              <p className="text-xs text-slate-400 mt-1">Explore active communities matching your passion</p>
            </div>
            <Link to="/dashboard" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
              <span>View All</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div key={c.name} className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex items-start space-x-4">
                <span className="text-3xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800">{c.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{c.name}</h4>
                  <p className="text-xs text-slate-400 mb-2">{c.desc}</p>
                  <span className="text-[11px] font-semibold text-indigo-400">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white">Loved by Learners & Creators worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed italic mb-6">"{t.text}"</p>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full bg-slate-800 object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.role} • {t.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-900/30 border-t border-slate-900 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left text-sm font-bold text-white flex items-center justify-between cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-indigo-400 font-extrabold text-lg">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
