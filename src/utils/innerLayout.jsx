import React, { useEffect, useRef, Suspense } from 'react'
import Navbar from '../components/navbar/navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/sidebar/sidebar'
import Preloader from '../preloader'
import { Heart, Globe, Sparkles } from 'lucide-react'

const InnerLayout = ({ sidebarclose, log }) => {
    const location = useLocation();
    const mainRef = useRef(null);

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location.pathname, location.search]);

    return (
        <div className={` ${log.loader ? 'App overflow-hidden' : 'App'}`}>
            <main
                ref={mainRef}
                className={`relative min-h-screen flex flex-col overflow-x-hidden overflow-y-auto transition-all duration-300 bg-slate-50 dark:bg-slate-800 w-full left-0 top-0 pt-[var(--navheightmobile)] lg:pt-[var(--navheight)] print:!pt-0 print:!w-full print:!left-0 print:!bg-white print:!text-black print:!m-0 ${log.narrow
                    ? "lg:w-[calc(100%-var(--sidebarnarrow))] lg:left-[var(--sidebarnarrow)] print:!w-full print:!left-0"
                    : "lg:w-[calc(100%-var(--sidebarwide))] lg:left-[var(--sidebarwide)] max-lg:blur-[2px] max-lg:before:content-[''] max-lg:before:absolute max-lg:before:inset-0 max-lg:before:bg-white/40 dark:max-lg:before:bg-black/40 max-lg:before:z-40 print:max-lg:blur-none print:max-lg:before:hidden print:!w-full print:!left-0"
                    }`}
                onClick={sidebarclose}
            >
                <Navbar />
                
                <div className="flex-1 w-full flex flex-col relative">
                    <Suspense fallback={<Preloader />}>
                        <Outlet />
                    </Suspense>
                </div>

                {/* ---------- MODERN FOOTER ---------- */}
                <footer className="py-2 px-3 sm:px-6 mt-auto print:hidden">
                    <div className="pt-2 pb-1 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                        {/* Brand & Copyright */}
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                            <span>© {new Date().getFullYear()}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">Accusoft</span>
                            <span>• Expense Management</span>
                        </div>

                        {/* Author Tag & Socials */}
                        <div className="flex items-center gap-2.5 sm:gap-4">
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                <span>Made with</span>
                                <Heart size={11} className="text-rose-500 fill-rose-500 animate-pulse inline" />
                                <span>by</span>
                                <a 
                                    href="https://portfolio.battlefiesta.in/" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Jai Kishan
                                </a>
                            </div>

                            <div className="w-px h-3 bg-slate-200 dark:bg-slate-700"></div>

                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                <a 
                                    href="https://github.com/kumarjaikishan" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" 
                                    aria-label="GitHub"
                                    title="GitHub"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                </a>
                                <a 
                                    href="https://www.linkedin.com/in/dev-kishan/" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-slate-400 hover:text-[#0a66c2] transition-colors" 
                                    aria-label="LinkedIn"
                                    title="LinkedIn"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z"/>
                                    </svg>
                                </a>
                                <a 
                                    href="https://portfolio.battlefiesta.in/" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-slate-400 hover:text-indigo-500 transition-colors" 
                                    aria-label="Portfolio"
                                    title="Portfolio"
                                >
                                    <Globe size={15} />
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
            <Sidebar />
        </div>
    )
}

export default InnerLayout
