import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  PieChart,
  Zap,
  ArrowRight,
  Calendar,
  BarChart3,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Link, useOutletContext } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

/* ================= 1. HERO SECTION WITH MOBILE-AWARE PARALLAX ================= */
const Hero = ({ theme, subtextClass }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 50]);
  const y2 = useTransform(scrollY, [0, 500], [0, -40]);

  return (
    <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Ambient background glows */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-10 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute top-40 right-4 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-400/15 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" 
      />

      <div className="container mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-4 sm:space-y-6 text-center lg:text-left"
        >
          {/* Chip */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 dark:text-indigo-400 fill-current" />
            Next-Gen Expense Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.12] text-slate-900 dark:text-white">
            Master your spending. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-400">
              Grow your future.
            </span>
          </h1>

          <p className={`text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed ${subtextClass}`}>
            Accusoft simplifies ledger tracking, monthly analytics, and real-time budget forecasting with an ultra-fast, intuitive interface.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-1">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all cursor-pointer">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer">
                Explore Demo
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </Link>
          </div>

          {/* Trust bullet points */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 pt-2 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Instant Setup</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Zero Spreadsheets</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>100% Privacy</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Responsive Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mt-2 lg:mt-0"
        >
          {/* Main Glass Card Preview */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
            {/* Window header */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono">accusoft.app/dashboard</span>
            </div>

            {/* Mock Stat Header */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate block">Total Spent (Month)</span>
                <div className="text-base sm:text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5 truncate">₹ 24,850</div>
                <span className="text-[9px] sm:text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5 truncate">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> 12% below budget
                </span>
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 truncate block">Daily Average</span>
                <div className="text-base sm:text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5 truncate">₹ 828</div>
                <span className="text-[9px] sm:text-[10px] text-indigo-500 font-bold mt-0.5 block truncate">Active Ledgers: 8</span>
              </div>
            </div>

            {/* Mock Visual Trend Bars */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Monthly Distribution</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[10px] sm:text-xs">12-Month Trend</span>
              </div>
              <div className="flex items-end gap-1.5 sm:gap-2 h-20 sm:h-28 pt-2 px-0.5">
                {[
                  { m: 'Jan', h: '45%' },
                  { m: 'Feb', h: '60%' },
                  { m: 'Mar', h: '85%' },
                  { m: 'Apr', h: '40%' },
                  { m: 'May', h: '70%' },
                  { m: 'Jun', h: '95%' },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div 
                      className="w-full rounded-t-md sm:rounded-t-lg bg-gradient-to-t from-cyan-500 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ height: bar.h }}
                    />
                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400">{bar.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Parallax Badges (visible from sm up) */}
          <motion.div 
            style={{ y: y1 }}
            className="absolute -top-3 -left-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 p-2 sm:p-3 rounded-2xl shadow-lg flex items-center gap-2.5 backdrop-blur-md hidden sm:flex"
          >
            <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Smart Auto-Ledger</p>
              <p className="text-[10px] text-slate-400">All categories synced</p>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: y2 }}
            className="absolute -bottom-3 -right-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 p-2 sm:p-3 rounded-2xl shadow-lg flex items-center gap-2.5 backdrop-blur-md hidden sm:flex"
          >
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Budget Health: 92%</p>
              <p className="text-[10px] text-slate-400">Optimal savings zone</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ================= 2. CORE FEATURES (RESPONSIVE GRID) ================= */
const Features = ({ theme, cardClass, subtextClass, mainFeatures }) => {
  return (
    <section id="features" className="py-14 sm:py-20 lg:py-28 px-4 sm:px-6 relative">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <span className="text-[10.5px] sm:text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
            Engineered For Speed & Simplicity
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything you need to master your money.
          </h2>
          <p className={`text-xs sm:text-sm sm:text-base leading-relaxed ${subtextClass}`}>
            Designed from scratch to replace bloated accounting software with a responsive, delightful experience.
          </p>
        </div>

        {/* 1 col on mobile, 2 col on tablet, 3 col on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {mainFeatures.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${cardClass} shadow-xs hover:shadow-lg hover:border-indigo-500/40 flex flex-col justify-between`}
            >
              <div>
                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl inline-block bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                  {f.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-1.5">{f.title}</h3>
                <p className={`leading-relaxed text-xs sm:text-sm ${subtextClass}`}>
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ================= 3. RESPONSIVE REPORTS SECTION ================= */
const Reports = ({ theme, cardClass, subtextClass, reportTypes, activeTab, setActiveTab }) => {
  return (
    <section id="reports" className="py-14 sm:py-20 lg:py-28 relative overflow-hidden bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Interactive Live View Sandbox */}
          <div className="order-2 lg:order-1">
            <div className={`p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-lg transition-all border ${theme === 'light' ? 'bg-white text-slate-900 border-slate-200/80' : 'bg-slate-900 text-white border-slate-800'}`}>
              <div className="flex justify-between items-center mb-4 sm:mb-6 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-widest text-indigo-500 font-mono">
                  Live View: {activeTab.toUpperCase()}
                </span>
              </div>

              {activeTab === 'daily' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase">Today's Total Spend</span>
                    <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-0.5">₹ 1,480.00</h4>
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-xs font-semibold">
                      <span className="truncate pr-2">Groceries & Supermarket</span>
                      <span className="text-rose-500 font-mono font-bold shrink-0">-₹ 850.00</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-xs font-semibold">
                      <span className="truncate pr-2">Fuel & Transportation</span>
                      <span className="text-rose-500 font-mono font-bold shrink-0">-₹ 630.00</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'monthly' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase">Monthly Allocation & Target</span>
                    <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-0.5">₹ 28,400.00</h4>
                  </div>
                  <div className="flex items-end gap-2 sm:gap-3 h-24 sm:h-32 pt-3 pb-1">
                    {[
                      { l: 'W1', h: '35%' },
                      { l: 'W2', h: '65%' },
                      { l: 'W3', h: '50%' },
                      { l: 'W4', h: '80%' },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div className="w-full bg-indigo-600 rounded-t-md sm:rounded-t-lg transition-all" style={{ height: bar.h }} />
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">{bar.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ledger' && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase">Searchable Ledger Registry</span>
                  <div className="space-y-1 pt-1">
                    {[
                      { d: '28 Aug', item: 'Office Internet Fiber', val: '-₹ 1,199.00' },
                      { d: '27 Aug', item: 'Consulting Invoice #104', val: '+₹ 15,000.00' },
                      { d: '25 Aug', item: 'Hardware Cloud Hosting', val: '-₹ 2,450.00' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-slate-400 font-mono text-[10px] sm:text-xs mr-2">{row.d}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 truncate flex-1">{row.item}</span>
                        <span className={`font-mono font-bold shrink-0 ${row.val.includes('+') ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
                          {row.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Tab Selectors */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            <div>
              <span className="text-[10.5px] sm:text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
                Multi-Dimensional Reporting
              </span>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 mb-2 sm:mb-3">
                Gain clarity from every perspective.
              </h3>
              <p className={`${subtextClass} text-xs sm:text-sm sm:text-base leading-relaxed`}>
                Switch between high-level macro summaries and granular transaction entries with a single click.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`w-full text-left p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                    activeTab === type.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : `${cardClass} hover:border-indigo-400`
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 mb-1">
                    <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 ${activeTab === type.id ? 'bg-white/20' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600'}`}>
                      {type.icon}
                    </div>
                    <span className="font-bold text-sm sm:text-base">{type.title}</span>
                  </div>
                  <p className={`text-[11px] sm:text-xs pl-8 sm:pl-10 ${activeTab === type.id ? 'text-indigo-100' : subtextClass}`}>
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================= 4. RESPONSIVE ACHIEVEMENTS ================= */
const Achievements = ({ theme, cardClass, subtextClass }) => {
  const sectionRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);

  const stats = [
    { label: "Active Trackers", value: 120, suffix: "+" },
    { label: "Expenses Recorded", value: 3700, suffix: "+" },
    { label: "Ledgers Categorized", value: 50, suffix: "+" },
  ];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 1200;
    const start = performance.now();
    let rafId = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts(stats.map((s) => Math.floor(s.value * eased)));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted]);

  return (
    <section id="stats" ref={sectionRef} className="py-14 sm:py-20 lg:py-28 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[10.5px] sm:text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
            Real-World Impact
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Built for reliability and speed.
          </h2>
          <p className={`text-xs sm:text-sm ${subtextClass}`}>
            Empowering individuals and teams to keep financial records accurate and effortless every day.
          </p>
        </div>

        {/* 1 col on mobile, 3 col on tablet/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6">
          {stats.map((stat, i) => (
            <div 
              key={stat.label} 
              className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-7 text-center transition-all ${cardClass} shadow-xs`}
            >
              <div className="text-2xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-1 font-mono">
                {counts[i].toLocaleString()}{stat.suffix}
              </div>
              <p className={`text-[10.5px] sm:text-xs font-bold uppercase tracking-wider ${subtextClass}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ================= 5. RESPONSIVE CTA ================= */
const CTA = () => {
  return (
    <section id="cta" className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-3xl sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 text-center relative overflow-hidden shadow-xl shadow-indigo-600/30 text-white">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready to take control of your expenses?
            </h2>
            <p className="text-indigo-100 text-xs sm:text-base leading-relaxed">
              Start managing your daily ledgers and generating professional reports in less than two minutes.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <button className="bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm hover:scale-105 transition-all cursor-pointer shadow-md">
                  Get Started for Free
                </button>
              </Link>
            </div>
          </div>

          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

/* ================= MAIN LANDING COMPONENT ================= */
const LandingBody = () => {
  const { theme, ThemeStyles, activeTab, setActiveTab } = useOutletContext();

  const mainFeatures = [
    {
      icon: <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "Interactive Dashboard",
      description: "A centralized command center showing today, week, month, and annual spending summaries in real-time."
    },
    {
      icon: <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />,
      title: "Visual Breakdown & Trends",
      description: "Dynamic interactive charts converting raw expense records into actionable visual spending insights."
    },
    {
      icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />,
      title: "Categorized Ledger Management",
      description: "Custom ledgers with automatic monthly aggregates, per-category budgets, and transaction drills."
    },
    {
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />,
      title: "Ultra-Fast Search & Export",
      description: "Instant date range filtering, print-ready sheets, and 1-click CSV exports for accounting."
    },
    {
      icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />,
      title: "Secure Cloud Storage",
      description: "Protected authenticated sessions with role-based admin controls and real-time MongoDB aggregations."
    },
    {
      icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />,
      title: "Dark Mode & Theme Colors",
      description: "Custom brand color palettes and auto-detecting dark mode for comfortable day and night usage."
    }
  ];

  const reportTypes = [
    {
      id: 'daily',
      icon: <Calendar className="w-4 h-4" />,
      title: "Daily Spending Pulse",
      description: "Track small day-to-day expenditures with instant category logging."
    },
    {
      id: 'monthly',
      icon: <BarChart3 className="w-4 h-4" />,
      title: "Monthly Budget Health",
      description: "Compare weekly allocations against set category budgets to prevent overspending."
    },
    {
      id: 'ledger',
      icon: <BookOpen className="w-4 h-4" />,
      title: "Transaction Ledger Registry",
      description: "Complete searchable historical ledger archive with exportable audit records."
    }
  ];

  return (
    <main className="space-y-4 sm:space-y-8">
      <Hero theme={theme} subtextClass={ThemeStyles.subtext} />

      <Features
        theme={theme}
        cardClass={ThemeStyles.card}
        subtextClass={ThemeStyles.subtext}
        mainFeatures={mainFeatures}
      />

      <Reports
        theme={theme}
        cardClass={ThemeStyles.card}
        subtextClass={ThemeStyles.subtext}
        reportTypes={reportTypes}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Achievements
        theme={theme}
        cardClass={ThemeStyles.card}
        subtextClass={ThemeStyles.subtext}
      />

      <CTA />
    </main>
  );
};

export default LandingBody;
