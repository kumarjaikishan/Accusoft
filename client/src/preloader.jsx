import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const LOADING_STEPS = [
  'Initializing workspace...',
  'Securing financial ledger...',
  'Syncing accounts & analytics...',
  'Preparing your dashboard...'
];

const Preloader = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const themeMode = useSelector((state) => state.theme?.mode) || localStorage.getItem('theme') || 'light';
  const isDark = themeMode === 'dark';

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`preloader-overlay ${isDark ? 'dark bg-[#0f172a]' : 'bg-[#f1f5f9]'}`}>
      {/* Subtle Ambient Background Glows (Clean Blue / Indigo only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-linear-to-tr from-blue-500/20 via-indigo-400/15 to-transparent blur-3xl animate-accu-aurora" />
        <div className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-linear-to-br from-cyan-500/15 via-blue-400/10 to-transparent blur-3xl animate-accu-aurora [animation-delay:2s]" />
      </div>

      <div className="preloader-container px-4">
        {/* Floating Brand Logo - Clean, No Border, No Background */}
        <div className="relative flex items-center justify-center">
          {/* Subtle Sonar Ripple Rings (Clean Blue / Cyan) */}
          <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-blue-500/20 dark:border-blue-400/15 pointer-events-none animate-accu-sonar" />
          <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-cyan-500/20 dark:border-cyan-400/15 pointer-events-none animate-accu-sonar [animation-delay:1.4s]" />

          {/* Pure Floating Logo (No Card, No Box, No Border) */}
          <div className="relative z-10 animate-accu-float">
            <div className="relative flex items-center justify-center">
              {/* Accusoft 3D Logo Image without any border or background */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.webp"
                  alt="Accusoft Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,112,243,0.25)] dark:drop-shadow-[0_12px_24px_rgba(0,112,243,0.35)] select-none"
                />

                {/* Shimmer Specular Sweep */}
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 dark:via-white/20 to-transparent pointer-events-none animate-accu-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Name & Typography */}
        <div className="mt-6 text-center space-y-2 flex flex-col items-center transition-all duration-300">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
              <span className="text-[#0B1B3D] dark:text-white">Accu</span>
              <span className="text-[#0070F3] dark:text-[#2E90FA]">soft</span>
            </span>
          </div>

          {/* Feature Pill Subtitle */}
          <div className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-slate-500 dark:text-slate-400 select-none">
            <span>ACCOUNTS</span>
            <span className="text-[#0070F3] dark:text-[#2E90FA] font-black">•</span>
            <span>EXPENSES</span>
            <span className="text-[#0070F3] dark:text-[#2E90FA] font-black">•</span>
            <span>INVENTORY</span>
            <span className="text-[#0070F3] dark:text-[#2E90FA] font-black">•</span>
            <span>REPORTS</span>
          </div>

          {/* Indeterminate Gradient Loading Bar */}
          <div className="w-44 sm:w-52 h-1.5 bg-slate-200/90 dark:bg-slate-800 rounded-full overflow-hidden mt-3.5 relative">
            <div className="absolute top-0 bottom-0 w-20 rounded-full bg-linear-to-r from-blue-600 via-cyan-400 to-indigo-600 shadow-xs shadow-blue-400/50 animate-accu-indeterminate" />
          </div>

          {/* Dynamic Status Text */}
          <div className="h-5 flex items-center justify-center mt-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-opacity duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span>{LOADING_STEPS[stepIndex]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
