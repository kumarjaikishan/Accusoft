import React from 'react'
import Navbar from '../components/navbar/navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/sidebar'
import Preloader from '../preloader'

const InnerLayout = ({ sidebarclose, log }) => {

    return (
        <div className={` ${log.loader ? 'App overflow-hidden' : 'App'}`}>
            <main
                className={`relative min-h-screen flex flex-col overflow-x-hidden overflow-y-auto transition-all duration-300 bg-slate-50 dark:bg-slate-800 w-full left-0 top-0 pt-[var(--navheightmobile)] lg:pt-[var(--navheight)] print:!pt-0 print:!w-full print:!left-0 print:!bg-white print:!text-black print:!m-0 ${log.narrow
                    ? "lg:w-[calc(100%-var(--sidebarnarrow))] lg:left-[var(--sidebarnarrow)] print:!w-full print:!left-0"
                    : "lg:w-[calc(100%-var(--sidebarwide))] lg:left-[var(--sidebarwide)] max-lg:blur-[2px] max-lg:before:content-[''] max-lg:before:absolute max-lg:before:inset-0 max-lg:before:bg-black/40 max-lg:before:z-40 print:max-lg:blur-none print:max-lg:before:hidden print:!w-full print:!left-0"
                    }`}
                onClick={sidebarclose}
            >
                <Navbar />
                
                <div className="flex-1 w-full flex flex-col">
                    <Outlet />
                </div>

                <footer className="mt-auto bg-white dark:bg-slate-900 py-4 px-6 text-sm text-gray-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-white/5 print:hidden">
                    <span>
                        © {new Date().getFullYear()} Accusoft. All rights reserved.
                    </span>

                    <span className="mt-1 sm:mt-0">
                        Designed & Developed by <span className="font-medium text-indigo-500 dark:text-indigo-400">Jai Kishan</span>
                    </span>

                </footer>
            </main>
            <Sidebar />
        </div>
    )
}

export default InnerLayout
