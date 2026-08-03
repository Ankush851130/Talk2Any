import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

const AVAILABLE_LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic'];

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();

  const [bio, setBio] = useState(user?.bio || '');
  const [country, setCountry] = useState(user?.country || 'Global');
  const [spoken, setSpoken] = useState(user?.languages?.spoken || ['English']);
  const [learning, setLearning] = useState(user?.languages?.learning || []);
  const [interests, setInterests] = useState((user?.interests || []).join(', '));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const toggleSpokenLanguage = (lang) => {
    setSpoken((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleLearningLanguage = (lang) => {
    setLearning((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formattedInterests = interests
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const res = await updateUser({
      bio,
      country,
      languages: { spoken, learning },
      interests: formattedInterests,
    });

    setLoading(false);
    if (res.success) {
      setMessage('Profile updated!');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1000);
    } else {
      setMessage(res.message || 'Failed to update profile');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold text-center">
            {message}
          </div>
        )}

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Bio
          </label>
          <textarea
            rows={3}
            maxLength={200}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others what you are studying or practicing..."
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. United States, India, Germany"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Spoken Languages */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Languages You Speak
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_LANGUAGES.map((lang) => (
              <button
                type="button"
                key={lang}
                onClick={() => toggleSpokenLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  spoken.includes(lang)
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Languages */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Languages You Are Learning
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_LANGUAGES.map((lang) => (
              <button
                type="button"
                key={lang}
                onClick={() => toggleLearningLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  learning.includes(lang)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Interests (Comma Separated)
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g. Coding, Anime, AI, Gaming, Travel"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          {loading ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
