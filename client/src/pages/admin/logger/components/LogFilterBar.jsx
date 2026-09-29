import React from 'react';
import { Search, Filter } from 'lucide-react';

const METHODS = ['ALL', 'GET', 'POST', 'PUT', 'DELETE'];

const LogFilterBar = ({ search, setSearch, selectedMethod, setSelectedMethod }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search endpoint path..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2 flex items-center gap-1">
                    <Filter size={13} /> Method:
                </span>
                {METHODS.map((m) => (
                    <button
                        key={m}
                        onClick={() => setSelectedMethod(m)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                            selectedMethod === m
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LogFilterBar;
