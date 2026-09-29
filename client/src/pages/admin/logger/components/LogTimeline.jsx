import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Activity } from 'lucide-react';
import MethodBadge from './badges/MethodBadge';
import StatusBadge from './badges/StatusBadge';
import LatencyBadge from './badges/LatencyBadge';

dayjs.extend(relativeTime);

const LogTimeline = ({ displayedLogs, activeKey, maxLogLatency, onRunTestCall, testLoading }) => {
    return (
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-white/5">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Log Execution Timeline
                    </h3>
                    <p className="text-xs text-gray-400">
                        {activeKey === 'ALL' ? 'Showing all endpoints' : `Filter: ${activeKey}`}
                    </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {displayedLogs.length} entries
                </span>
            </div>

            <div className="space-y-3 max-h-150 overflow-y-auto pr-1">
                {displayedLogs.map((log) => {
                    const percentage = Math.min(100, Math.max(5, (log.durationMs / maxLogLatency) * 100));

                    return (
                        <div
                            key={log.id}
                            className="p-3.5 rounded-xl border border-gray-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition shadow-2xs space-y-2.5 animate-in fade-in duration-150"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <MethodBadge method={log.method} />
                                    <span className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200">
                                        /{log.endpoint}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <StatusBadge status={log.status} success={log.success} />
                                    <LatencyBadge timeStr={log.time} durationMs={log.durationMs} />
                                </div>
                            </div>

                            {/* Relative latency visualization bar */}
                            <div className="w-full bg-gray-200 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        log.durationMs > 500
                                            ? 'bg-rose-500'
                                            : log.durationMs > 200
                                            ? 'bg-amber-500'
                                            : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>{dayjs(log.timestamp).fromNow()}</span>
                                <span className="font-mono">{dayjs(log.timestamp).format('hh:mm:ss A · DD/MM/YYYY')}</span>
                            </div>

                            {log.error && (
                                <div className="text-xs p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono">
                                    Error: {log.error}
                                </div>
                            )}
                        </div>
                    );
                })}

                {displayedLogs.length === 0 && (
                    <div className="text-center py-12 space-y-3">
                        <Activity size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
                        <h4 className="text-base font-semibold text-gray-600 dark:text-gray-300">No API logs recorded yet</h4>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto">
                            API calls made using the application will automatically log their execution time and response status here.
                        </p>
                        <button
                            onClick={onRunTestCall}
                            disabled={testLoading}
                            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
                        >
                            Run Test API Call
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogTimeline;
