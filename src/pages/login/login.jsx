import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, Zap, ArrowLeft, CheckCircle, Sparkles, Moon, Sun } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toggleTheme } from '../../store/themeSlice';
import Signin from './signin';
import Signup from './signup';

const Login = () => {
    const [isLoginTab, setIsLoginTab] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logindata = useSelector((state) => state.login);
    const themeMode = useSelector((state) => state.theme?.mode || 'light');

    useEffect(() => {
        if (logindata.islogin) {
            navigate('/dashboard');
        }
    }, [logindata.islogin, navigate]);

    const benefits = [
        {
            icon: <Zap className="w-4 h-4 text-amber-400" />,
            title: "Instant Logging",
            desc: "Smart receipt & multi-ledger analytics"
        },
        {
            icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
            title: "Bank-Grade Security",
            desc: "Encrypted logs with strict data privacy"
        },
        {
            icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
            title: "Automated Reports",
            desc: "One-click exportable PDF/Excel statements"
        }
    ];

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white relative">
            
            {/* Top Minimal Floating Bar (Back to Home & Theme Toggle) */}
            <header className="w-full px-5 py-2.5 sm:px-8 sm:py-3 flex items-center justify-between z-20 shrink-0">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                >
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700/80 group-hover:-translate-x-0.5 transition-transform">
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                    <span>Back to Home</span>
                </Link>

                <button
                    onClick={() => dispatch(toggleTheme())}
                    aria-label="Toggle theme"
                    className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-amber-400 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                    {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </button>
            </header>

            {/* Main Center Area: Fixed to viewport height */}
            <main className="flex-1 flex items-center justify-center px-4 py-2 sm:px-6 relative overflow-y-auto lg:overflow-hidden">
                {/* Dynamic Ambient Background Glows */}
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-cyan-500/15 dark:bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] my-auto min-h-[480px] max-h-[92vh] flex-shrink-0">
                    
                    {/* Left Showcase Hero Panel (Desktop) */}
                    <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-7 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white relative overflow-hidden">
                        {/* Mesh texture */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

                        {/* Brand Top */}
                        <div className="relative z-10">
                            <Link to="/" className="inline-flex items-center gap-2.5 group">
                                <div className="p-2 bg-indigo-600 rounded-xl shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                                    <Wallet className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-extrabold tracking-tight text-white">Accusoft</span>
                            </Link>
                            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                                Next-gen financial analytics, smart multi-ledger accounting, and effortless expense management.
                            </p>
                        </div>

                        {/* Middle Value Props */}
                        <div className="relative z-10 my-4 space-y-3">
                            {benefits.map((item, idx) => (
                                <div 
                                    key={idx}
                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md"
                                >
                                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-white/10 shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white tracking-wide">{item.title}</h4>
                                        <p className="text-[11px] text-slate-300 leading-tight">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Trust Badge */}
                        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                <CheckCircle className="w-3.5 h-3.5" /> 100% Free & Secure
                            </span>
                            <span>v2.0 Modern</span>
                        </div>
                    </div>

                    {/* Right Form Panel: Fixed constant dimensions */}
                    <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between overflow-hidden">
                        {/* Mobile Brand Logo */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-2">
                            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-md">
                                <Wallet className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Accusoft</span>
                        </div>

                        {/* Header & Toggle */}
                        <div className="text-center max-w-sm mx-auto w-full mb-2">
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white h-7 flex items-center justify-center">
                                {isLoginTab ? "Welcome back" : "Create account"}
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 h-4 flex items-center justify-center">
                                {isLoginTab 
                                    ? "Enter your credentials to access your dashboard"
                                    : "Join thousands of users tracking expenses"
                                }
                            </p>

                            {/* Segmented Switcher */}
                            <div className="mt-3 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center relative border border-slate-200 dark:border-slate-700/60 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setIsLoginTab(true)}
                                    className={`relative flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 z-10 cursor-pointer ${
                                        isLoginTab 
                                            ? "text-white shadow-sm shadow-indigo-500/20" 
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                >
                                    {isLoginTab && (
                                        <motion.div
                                            layoutId="activeTabPill"
                                            className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-sm"
                                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                        />
                                    )}
                                    Sign In
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsLoginTab(false)}
                                    className={`relative flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 z-10 cursor-pointer ${
                                        !isLoginTab 
                                            ? "text-white shadow-sm shadow-indigo-500/20" 
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                >
                                    {!isLoginTab && (
                                        <motion.div
                                            layoutId="activeTabPill"
                                            className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-sm"
                                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                        />
                                    )}
                                    Register
                                </button>
                            </div>
                        </div>

                        {/* Sliding Carousel (0% Height Shift, Smooth Left-Right Slide) */}
                        <div className="relative w-full max-w-sm mx-auto overflow-hidden h-[290px]">
                            <div 
                                className="w-[200%] h-full flex transition-transform duration-300 ease-in-out"
                                style={{ transform: isLoginTab ? 'translateX(0%)' : 'translateX(-50%)' }}
                            >
                                <div className="w-1/2 h-full pr-1.5 flex flex-col justify-between">
                                    <Signin />
                                </div>
                                <div className="w-1/2 h-full pl-1.5 flex flex-col justify-between">
                                    <Signup setlog={setIsLoginTab} />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default Login;
