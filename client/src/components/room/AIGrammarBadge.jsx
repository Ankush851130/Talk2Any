import React from 'react';
import { FiCpu } from 'react-icons/fi';

const AIGrammarBadge = ({ isAnalyzing }) => {
  if (!isAnalyzing) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.3)] backdrop-blur-md animate-pulse select-none">
      <FiCpu className="w-4 h-4 text-indigo-400 animate-spin" />
      <span className="text-xs font-semibold text-indigo-200 tracking-wide">
        AI Grammar is analyzing your speech...
      </span>
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
    </div>
  );
};

export default AIGrammarBadge;
