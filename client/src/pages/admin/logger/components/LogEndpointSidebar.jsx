import React from 'react';
import { Server } from 'lucide-react';
import MethodBadge from './badges/MethodBadge';

const LogEndpointSidebar = ({
    filteredGroupedEndpoints,
    activeKey,
    setActiveKey,
    totalLogsCount
}) => {
    return (
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Endpoints</h3>
                <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                    {filteredGroupedEndpoints.length}
                </span>
            </div>

            <div className="space-y-1.5 max-h-125 overflow-y-auto pr-1">
                <button
                    onClick={() => setActiveKey('ALL')}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                        activeKey === 'ALL'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-gray-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Server size={16} />
                        <span className="font-semibold text-sm">All Endpoints</span>
                    </div>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            activeKey === 'ALL' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        {totalLogsCount}
                    </span>
                </button>

                {filteredGroupedEndpoints.map((group) => {
                    const isActive = activeKey === group.key;
                    return (
                        <button
                            key={group.key}
                            onClick={() => setActiveKey(group.key)}
                            className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                                isActive
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                    : 'bg-slate-50 dark:bg-slate-800/60 border-gray-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <MethodBadge method={group.method} />
                                    <span className="font-mono text-xs font-semibold truncate block" title={group.endpoint}>
                                        /{group.endpoint}
                                    </span>
                                </div>
                                <div className={`text-[11px] ${isActive ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                    Avg: {group.avgMs} ms
                                </div>
                            </div>
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {group.count}
                            </span>
                        </button>
                    );
                })}

                {filteredGroupedEndpoints.length === 0 && (
                    <p className="text-xs text-center py-6 text-gray-400">No matching endpoints found</p>
                )}
            </div>
        </div>
    );
};

export default LogEndpointSidebar;
