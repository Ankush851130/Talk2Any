import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-400 dark:text-indigo-400 border border-slate-700/50 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <FiSun className="w-5 h-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <FiMoon className="w-5 h-5 text-indigo-400 transition-transform rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
