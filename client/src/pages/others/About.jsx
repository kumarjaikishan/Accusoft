import React from "react";
import { Leaf, Target, Users, Zap, Shield, Sparkles, ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "Clarity over Clutter",
      desc: "We believe expense tracking shouldn't require an accounting degree. We craft intuitive software that turns raw transaction receipts into simple, beautiful insights."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: "Real-Time Speed",
      desc: "Fast interfaces keep you in control. Whether logging a daily coffee or exporting full audit sheets, Accusoft executes without lag."
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      title: "Uncompromising Privacy",
      desc: "Your financial numbers are yours alone. We never monetize personal spending logs or trade financial histories with third parties."
    }
  ];

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Bar */}
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-4">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
              Our Story & Mission
            </span>
            <span className="text-xs text-slate-400 font-medium">About Accusoft</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Simplifying money management for everyone.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Accusoft was built to address a common pain point: traditional bookkeeping tools are either too cumbersome for everyday individuals, or too barebones for accurate ledger analysis.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Our Core Principles</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <div 
                key={i}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 w-fit">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-1">{v.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creator Attribution */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Crafted with Care</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Engineered by <span className="font-bold text-slate-800 dark:text-slate-200">Jai Kishan</span> as part of the Accusoft suite for fast, modern personal expense tracking.
            </p>
          </div>

          <a 
            href="https://portfolio.battlefiesta.in/" 
            target="_blank" 
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition shrink-0"
          >
            Visit Portfolio →
          </a>
        </div>

      </div>
    </div>
  );
};

export default About;
