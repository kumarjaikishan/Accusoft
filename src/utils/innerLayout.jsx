import React, { useEffect, useRef, Suspense } from 'react'
import Navbar from '../components/navbar/navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/sidebar/sidebar'
import Preloader from '../preloader'
import { Heart, Github, Linkedin, Globe, RotateCw } from 'lucide-react'
import { useSelector } from 'react-redux'

const InnerLayout = ({ sidebarclose, log }) => {
    const location = useLocation();
    const mainRef = useRef(null);
    const { isRotated } = useSelector((state) => state.theme);

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

                <footer className="py-2  mt-auto print:hidden">
                    <div className=" pt-2 pb-2 pr-2 fill-slate-200 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-end gap-6 text-[13px] font-semibold text-slate-500 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                            Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> by Jai Kishan
                        </div>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 hidden sm:block"></div>
                        <div className="flex items-center gap-4">
                            <a href="https://github.com/dev-kishan" target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors" aria-label="GitHub">
                                <Github size={16} />
                            </a>
                            <a href="https://www.linkedin.com/in/dev-kishan/" target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors" aria-label="LinkedIn">
                                <Linkedin size={16} />
                            </a>
                            <a href="https://portfolio.battlefiesta.in/" target="_blank" rel="noreferrer" title="Portfolio" className="hover:text-indigo-500 transition-colors" aria-label="Portfolio">
                                <Globe size={16} />
                            </a>
                        </div>
                    </div>
                </footer>
            </main>
            <Sidebar />
        </div>
    )
}

export default InnerLayout

