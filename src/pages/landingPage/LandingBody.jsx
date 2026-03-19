import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  Calendar,
  BarChart3,
  BookOpen, Star
} from 'lucide-react';
import { Link, useOutletContext } from "react-router-dom";

const Hero = ({ theme, subtextClass }) => {
  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100 dark:border-blue-800">
            <Star className="w-4 h-4 fill-current" />
            Simple Money Management
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1]">
            Know Where Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Money Goes.</span>
          </h1>
          <p className={`text-lg max-w-lg leading-relaxed ${subtextClass}`}>
            Accusoft brings all your spending into one easy-to-use place. See daily totals, monthly trends, and detailed lists of every transaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/dashboard">
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all group shadow-xl shadow-blue-600/20">
                Open Your Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-20 flex justify-center items-center p-4">
            <svg viewBox="0 0 500 500" className="w-full max-w-md h-auto drop-shadow-2xl">
              <circle cx="250" cy="250" r="180" fill={theme === 'light' ? '#DBEAFE' : '#1E3A8A'} fillOpacity="0.3" />
              <path d="M400,250 Q400,350 300,350 Q200,350 200,250 Q200,150 300,150 Q400,150 400,250" fill={theme === 'light' ? '#BFDBFE' : '#3B82F6'} fillOpacity="0.2" />
              <rect x="180" y="280" width="30" height="80" rx="5" fill="#3B82F6" opacity="0.6" />
              <rect x="230" y="240" width="30" height="120" rx="5" fill="#3B82F6" opacity="0.8" />
              <rect x="280" y="200" width="30" height="160" rx="5" fill="#3B82F6" />
              <rect x="330" y="150" width="30" height="210" rx="5" fill="#60A5FA" />
              <path d="M180,300 L230,260 L280,220 L330,170" fill="none" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
              <circle cx="330" cy="170" r="8" fill="#FBBF24" />
              <circle cx="120" cy="180" r="25" fill="#FBBF24" className="animate-bounce" style={{ animationDuration: '3s' }} />
              <text x="115" y="187" fontSize="20" fontWeight="bold" fill="white">$</text>
            </svg>
          </div>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400 rounded-full blur-[120px] opacity-20 -z-10`}></div>
        </div>
      </div>
    </section>
  );
};

const Features = ({ theme, cardClass, subtextClass, mainFeatures }) => {
  return (
    <section id="features" className={`py-24 transition-colors ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3">Simple & Powerful</h2>
          <p className="text-3xl lg:text-5xl font-bold mb-6">Take charge with our Interactive Dashboard.</p>
          <p className={subtextClass}>We built Accusoft to be as easy to use as your favorite social app, but with the power of a professional accounting tool.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((f, i) => (
            <div key={i} className={`p-8 rounded-[2rem] border transition-all duration-300 group ${cardClass} hover:shadow-2xl hover:scale-105`}>
              <div className="mb-6 p-4 rounded-2xl inline-block border border-transparent 
group-hover:border-blue-600 transition-all">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className={`leading-relaxed text-sm ${subtextClass}`}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Reports = ({ theme, cardClass, subtextClass, reportTypes, activeTab, setActiveTab }) => {
  return (
    <section id="reports" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className={`p-8 rounded-[3rem] shadow-2xl transition-colors border ${theme === 'light' ? 'bg-white text-slate-900 border-slate-100' : 'bg-slate-900 text-white border-slate-800'}`}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Live Reporting View</span>
              </div>

              {activeTab === 'daily' && (
                <div className="animate-in fade-in duration-500">
                  <p className="text-xs font-bold opacity-50 mb-1">Today's Spend</p>
                  <h4 className="text-4xl font-bold mb-6">₹84.20</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-sm font-medium">Coffee & Lunch</span>
                      <span className="text-sm font-bold text-red-500">-₹24.20</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-sm font-medium">Grocery Store</span>
                      <span className="text-sm font-bold text-red-500">-₹60.00</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'monthly' && (
                <div className="animate-in fade-in duration-500">
                  <p className="text-xs font-bold opacity-50 mb-1">March Overview</p>
                  <h4 className="text-4xl font-bold mb-6">$2,450.00</h4>
                  <div className="flex items-end gap-2 h-32 mb-4">
                    {[30, 60, 45, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500 rounded-t-lg" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-bold opacity-40">
                    <span>WEEK 1</span><span>WEEK 2</span><span>WEEK 3</span><span>WEEK 4</span>
                  </div>
                </div>
              )}

              {activeTab === 'ledger' && (
                <div className="animate-in fade-in duration-500">
                  <p className="text-xs font-bold opacity-50 mb-4 tracking-tighter uppercase">Full Transaction Ledger</p>
                  <div className="space-y-1">
                    {[
                      { d: 'Mar 15', item: 'Electric Bill', val: '-120.00' },
                      { d: 'Mar 14', item: 'Freelance Pay', val: '+500.00' },
                      { d: 'Mar 12', item: 'Gas Station', val: '-45.50' },
                      { d: 'Mar 10', item: 'Internet', val: '-60.00' },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-3 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                        <span className="opacity-50">{row.d}</span>
                        <span className="font-bold">{row.item}</span>
                        <span className={`text-right font-bold ${row.val.includes('+') ? 'text-green-500' : ''}`}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h2 className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3">Various Reporting Types</h2>
              <h3 className="text-4xl lg:text-5xl font-bold mb-6">See your finances from every angle.</h3>
              <p className={`${subtextClass} text-lg leading-relaxed`}>
                Whether you want a quick check-in or a deep dive, we have the right report for you.
              </p>
            </div>

            <div className="space-y-4">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`w-full text-left p-6 rounded-3xl border transition-all ${activeTab === type.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : `${cardClass} hover:border-blue-400`}`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-2 rounded-lg ${activeTab === type.id ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}`}>
                      {type.icon}
                    </div>
                    <span className="font-bold text-xl">{type.title}</span>
                  </div>
                  <p className={`text-sm ${activeTab === type.id ? 'text-blue-50' : subtextClass}`}>
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

const Achievements = ({ theme, cardClass, subtextClass }) => {
  const sectionRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  const stats = [
    { label: "Registered Users", value: 10, suffix: "+" },
    { label: "Expense Records", value: 2000, suffix: "+" },
    { label: "Ledgers Managed", value: 50, suffix: "+" },
    // { label: "Avg. Monthly Savings", value: 18, suffix: "%" },
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

    const duration = 1400;
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
    <section ref={sectionRef} className={`py-20 px-6 transition-colors ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3">Proven Results</h2>
          <p className="text-3xl lg:text-5xl font-bold mb-5">Built to perform at scale.</p>
          <p className={subtextClass}>
            From first-time trackers to daily power users, teams trust Accusoft to keep every expense organized and visible.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`rounded-3xl border p-7 transition-all duration-300 ${cardClass}`}>
              <p className="text-3xl lg:text-4xl font-extrabold text-blue-600 mb-2">
                {counts[i].toLocaleString()}{stat.suffix}
              </p>
              <p className={`text-sm font-semibold ${subtextClass}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section id="cta" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="bg-blue-600 rounded-[4rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-600/40">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">Start your smarter financial journey today.</h2>
            <p className="text-blue-100 text-xl mb-10 leading-relaxed">
              Join 500+ smart savers who use Accusoft every day. It’s simple, free, and secure.
            </p>
            <Link to="/dashboard">
              <button className="bg-white text-blue-600 px-10 py-5 rounded-3xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
                Get Started for Free
              </button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

const LandingBody = ({ }) => {
  const { theme, ThemeStyles, activeTab, setActiveTab } = useOutletContext();

  const mainFeatures = [
    {
      icon: <LayoutDashboard className="w-6 h-6 text-blue-500" />,
      title: "Interactive Dashboard",
      description: "A single, beautiful screen to control all your money. Everything you need is just one click away."
    },
    {
      icon: <PieChart className="w-6 h-6 text-purple-500" />,
      title: "Visual Spending Stories",
      description: "We turn boring numbers into colorful charts so you can see your spending habits instantly."
    },
    // {
    //   icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
    //   title: "Bank-Level Safety",
    //   description: "Your data is locked away safely. Only you have the key to your financial information."
    // },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Always Fast",
      description: "No waiting around. The app opens instantly and saves your data the moment you type it."
    }
  ];

  const reportTypes = [
    {
      id: 'daily',
      icon: <Calendar className="w-5 h-5" />,
      title: "Daily Tracking",
      description: "See exactly what you spent today. Perfect for staying on top of small daily purchases."
    },
    {
      id: 'monthly',
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Monthly Summaries",
      description: "Compare your spending week by week to see where you can save more for the future."
    },
    {
      id: 'ledger',
      icon: <BookOpen className="w-5 h-5" />,
      title: "Personal Ledger",
      description: "A clean, organized list of every single transaction. It’s like a digital diary for your wallet."
    }
  ];

  return (
    <>
      <main>
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

    </>
  );
};

export default LandingBody;
