import React, { useState } from 'react';
import Modal from '../common/Modal';
import { roomApi } from '../../services/roomApi';
import { FiLock, FiGlobe, FiTag, FiBarChart2 } from 'react-icons/fi';

const categories = ['Study', 'Programming', 'Gaming', 'Music', 'Language Exchange', 'Interview Practice', 'General'];
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic'];
const levels = ['Any Level', 'Beginner', 'Upper Beginner', 'Intermediate', 'Upper Intermediate', 'Advanced'];

const RoomCreateModal = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [selectedLanguages, setSelectedLanguages] = useState(['English']);
  const [level, setLevel] = useState('Any Level');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleLanguage = (lang) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
      }
    } else {
      if (selectedLanguages.length < 2) {
        setSelectedLanguages([...selectedLanguages, lang]);
      } else {
        setSelectedLanguages([selectedLanguages[0], lang]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedLanguages.length === 0) return setError('Select at least 1 language');

    setLoading(true);
    setError(null);

    try {
      const res = await roomApi.createRoom({
        title,
        category,
        language: selectedLanguages.join(', '),
        level,
        maxParticipants: 4,
        isPrivate,
        password: isPrivate ? password : '',
      });

      if (res.success) {
        setTitle('');
        setSelectedLanguages(['English']);
        setLevel('Any Level');
        setPassword('');
        setIsPrivate(false);
        onClose();
        if (onCreated) onCreated(res.room);
      }
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Talk Room">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Title / Custom Topic */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Custom Topic <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Daily English Speaking Practice or React Dev Q&A (Optional)"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Grid: Category & Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <FiTag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <FiBarChart2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Level</span>
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Language Selection (Select up to 2) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
              <FiGlobe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Languages (Select up to 2) *</span>
            </label>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {selectedLanguages.length}/2 selected
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl">
            {languages.map((l) => {
              const isSelected = selectedLanguages.includes(l);
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => toggleLanguage(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 border border-emerald-400/30'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {isSelected && <span className="text-emerald-200 font-bold text-xs">✓</span>}
                  <span>{l}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Password Protection */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiLock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Private Password Room</span>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {isPrivate && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set room password"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          )}
        </div>

        {/* Max Capacity Notice */}
        <p className="text-[11px] text-slate-400 text-center">
          ⚡ Maximum capacity is automatically set to <span className="text-indigo-400 font-bold">4 participants</span> for high quality WebRTC mesh audio & video calls.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          {loading ? 'Creating Room...' : 'Launch Room Now'}
        </button>
      </form>
    </Modal>
  );
};

export default RoomCreateModal;
