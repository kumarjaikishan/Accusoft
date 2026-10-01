import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Scale } from 'lucide-react';
import { formatCurrency } from './ledgerHelpers';

const LedgerMetricCards = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {/* Total Payable Card */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 p-3 sm:p-5 shadow-xs transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                Total Payable
                            </span>
                            <span className="text-[10px] sm:text-xs text-emerald-600/80 dark:text-emerald-500 font-medium sm:block hidden">
                                (To Pay)
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 sm:mt-1.5 tracking-tight">
                            {formatCurrency(stats?.totalPayable)}
                        </h2>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300">
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                </div>
            </div>

            {/* Total Receivable Card */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 p-3 sm:p-5 shadow-xs transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                                Total Receivable
                            </span>
                            <span className="text-[10px] sm:text-xs text-rose-600/80 dark:text-rose-500 font-medium sm:block hidden">
                                (To Receive)
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 sm:mt-1.5 tracking-tight">
                            {formatCurrency(stats?.totalReceivable)}
                        </h2>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
                        <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                </div>
            </div>

            {/* Net Balance Card */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/60 p-3 sm:p-5 shadow-xs transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                                Net Balance
                            </span>
                            <span className="text-[10px] sm:text-xs text-cyan-600/80 dark:text-cyan-500 font-medium sm:block hidden">
                                ({stats?.netPayable >= 0 ? 'To Pay' : 'To Receive'})
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 sm:mt-1.5 tracking-tight">
                            {formatCurrency(Math.abs(stats?.netPayable || 0))}
                        </h2>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 dark:text-cyan-300">
                        <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(LedgerMetricCards);
