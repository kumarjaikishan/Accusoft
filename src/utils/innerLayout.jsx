import React, { useEffect, useRef, Suspense } from 'react'
import Navbar from '../components/navbar/navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/sidebar/sidebar'
import Preloader from '../preloader'
import { Heart, Github, Linkedin, Globe, Sparkles } from 'lucide-react'

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
                                    <Github size={15} />
                                </a>
                                <a 
                                    href="https://www.linkedin.com/in/dev-kishan/" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-slate-400 hover:text-[#0a66c2] transition-colors" 
                                    aria-label="LinkedIn"
                                    title="LinkedIn"
                                >
                                    <Linkedin size={15} />
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
