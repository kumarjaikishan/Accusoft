import React from 'react';
import { Activity, Play, RefreshCw, Download, Trash2 } from 'lucide-react';

const LoggerHeader = ({ onRunTestCall, onLoadLogs, onExportJSON, onClearLogs, testLoading }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm">
            <div>
                <div className="flex items-center gap-2">
                    <Activity className="text-indigo-600 dark:text-indigo-400" size={24} />
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">API Performance Logs</h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Real-time diagnostic metrics, request execution times, and endpoint telemetry.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                    onClick={onRunTestCall}
                    disabled={testLoading}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                    <Play size={13} className={testLoading ? 'animate-spin' : ''} />
                    <span>Ping Test API</span>
                </button>
                <button
                    onClick={onLoadLogs}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-white/10 transition whitespace-nowrap cursor-pointer"
                >
                    <RefreshCw size={13} />
                    <span>Refresh</span>
                </button>
                <button
                    onClick={onExportJSON}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-white/10 transition whitespace-nowrap cursor-pointer"
                >
                    <Download size={13} />
                    <span>Export</span>
                </button>
                <button
                    onClick={onClearLogs}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 transition whitespace-nowrap cursor-pointer"
                >
                    <Trash2 size={13} />
                    <span>Reset Logs</span>
                </button>
            </div>
        </div>
    );
};

export default LoggerHeader;
