import React from 'react';
import { Server, Zap, BarChart2, Clock } from 'lucide-react';

const LogStatCards = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Calls</p>
                    <h3 className="text-2xl font-extrabold mt-1">{stats.totalCalls}</h3>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Server size={22} />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Latency</p>
                    <h3 className="text-2xl font-extrabold mt-1">{stats.avgMs} <span className="text-sm font-normal text-gray-500">ms</span></h3>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Zap size={22} />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fastest Call</p>
                    <h3 className="text-2xl font-extrabold mt-1">{stats.minMs} <span className="text-sm font-normal text-gray-500">ms</span></h3>
                </div>
                <div className="p-3 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-xl">
                    <BarChart2 size={22} />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fast Rate (&le;200ms)</p>
                    <h3 className="text-2xl font-extrabold mt-1">
                        {stats.totalCalls ? Math.round((stats.fastCount / stats.totalCalls) * 100) : 0}%
                    </h3>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                    <Clock size={22} />
                </div>
            </div>
        </div>
    );
};

export default LogStatCards;
