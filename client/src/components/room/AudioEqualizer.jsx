import React from 'react';

const AudioEqualizer = ({ isSpeaking = true, size = 'md', className = '' }) => {
  if (!isSpeaking) return null;

  const sizeClasses = {
    sm: {
      container: 'h-3.5 gap-[1.5px]',
      bar: 'w-[2.5px] rounded-full',
    },
    md: {
      container: 'h-5 gap-[2.5px]',
      bar: 'w-[3.5px] rounded-full',
    },
    lg: {
      container: 'h-7 gap-[3.5px]',
      bar: 'w-[5px] rounded-full',
    },
  };

  const { container, bar } = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex items-end justify-center ${container} ${className}`}
      title="Speaking..."
    >
      <span className={`${bar} bg-emerald-400 animate-eq-1 shadow-[0_0_8px_rgba(52,211,153,0.8)]`} />
      <span className={`${bar} bg-emerald-400 animate-eq-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]`} />
      <span className={`${bar} bg-emerald-400 animate-eq-3 shadow-[0_0_8px_rgba(52,211,153,0.8)]`} />
      <span className={`${bar} bg-emerald-400 animate-eq-4 shadow-[0_0_8px_rgba(52,211,153,0.8)]`} />
    </div>
  );
};

export default AudioEqualizer;
