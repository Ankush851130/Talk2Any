import React from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiBookOpen,
  FiPieChart,
  FiX,
  FiCheck,
} from 'react-icons/fi';

const AIGrammarReportModal = ({ isOpen, onClose, report, loading }) => {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-white">Analyzing Spoken English...</h3>
          <p className="text-xs text-slate-400">
            Evaluating grammar, sentence structure, and tenses using AI...
          </p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const {
    grammarScore = 100,
    totalSentences = 0,
    totalMistakes = 0,
    mistakes = [],
    categories = {},
    summary = '',
  } = report;

  // Determine color scheme based on score
  const getScoreColorClass = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/40';
    if (score >= 60) return 'from-amber-500 to-yellow-600 text-amber-400 border-amber-500/40';
    return 'from-rose-500 to-red-600 text-rose-400 border-rose-500/40';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="bg-[#0D111A] border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FiBookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">AI Grammar Report</h2>
              <p className="text-[11px] text-slate-400">Post-Call Spoken English Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close and delete temporary session data"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Top Score Banner & Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Main Score Box */}
            <div className="sm:col-span-1 p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                Grammar Score
              </span>
              <div className="relative flex items-baseline space-x-1 my-1">
                <span className={`text-4xl font-black bg-gradient-to-r ${getScoreColorClass(grammarScore)} bg-clip-text text-transparent`}>
                  {grammarScore}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ 100</span>
              </div>
              <div className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                {grammarScore >= 80 ? 'Excellent' : grammarScore >= 60 ? 'Good' : 'Needs Practice'}
              </div>
            </div>

            {/* Metrics Counters */}
            <div className="sm:col-span-2 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">Sentences</span>
                  <FiBookOpen className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="mt-2 text-2xl font-bold text-white">{totalSentences}</div>
                <span className="text-[10px] text-slate-500">Analyzed in call</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">Mistakes</span>
                  <FiPieChart className="w-4 h-4 text-rose-400" />
                </div>
                <div className="mt-2 text-2xl font-bold text-rose-400">{totalMistakes}</div>
                <span className="text-[10px] text-slate-500">Corrections identified</span>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <FiPieChart className="w-4 h-4 text-indigo-400" />
              <span>Mistake Categories</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400 font-medium">Tenses</span>
                <span className="text-sm font-bold text-indigo-300">{categories.tense || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400 font-medium">Articles</span>
                <span className="text-sm font-bold text-indigo-300">{categories.articles || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400 font-medium">Prepositions</span>
                <span className="text-sm font-bold text-indigo-300">{categories.prepositions || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="block text-[10px] text-slate-400 font-medium">Subject-Verb</span>
                <span className="text-sm font-bold text-indigo-300">{categories.subjectVerbAgreement || 0}</span>
              </div>
            </div>
          </div>

          {/* Detailed Examples & Corrections */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Detailed Corrections ({mistakes.length})</span>
            </h3>

            {mistakes.length === 0 ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                <FiCheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <p className="text-sm font-bold text-emerald-300">No Grammatical Mistakes Found!</p>
                <p className="text-xs text-slate-400">Your spoken English was clear and grammatically sound.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {mistakes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 uppercase">
                        {item.type || 'Grammar'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {/* Original */}
                      <div className="flex items-start space-x-2 text-rose-300 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                        <FiXCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[10px] uppercase text-rose-400 block">Original</span>
                          <span>"{item.original}"</span>
                        </div>
                      </div>

                      {/* Corrected */}
                      <div className="flex items-start space-x-2 text-emerald-300 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                        <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[10px] uppercase text-emerald-400 block">Corrected</span>
                          <span>"{item.corrected}"</span>
                        </div>
                      </div>
                    </div>

                    {item.explanation && (
                      <p className="text-[11px] text-slate-400 italic pt-1 pl-1 border-l-2 border-indigo-500/40">
                        💡 {item.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overall Feedback Summary */}
          {summary && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 space-y-1">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                Overall Feedback
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{summary}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 italic">
            🔒 All temporary transcript and analysis data will be permanently cleared upon closing.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center space-x-1.5"
          >
            <FiCheck className="w-4 h-4" />
            <span>Close & Clear Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGrammarReportModal;
