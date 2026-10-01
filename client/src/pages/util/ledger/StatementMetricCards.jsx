import React from 'react';
import { formatCurrency } from './ledgerHelpers';

const StatementMetricCards = ({ summary }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
            {/* Total Credit */}
            <div className="rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/90 border border-dashed border-emerald-300 dark:border-emerald-800/80 p-2.5 sm:p-4 text-center shadow-xs">
                <p className="text-[11px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400">Total Credit (Payable Cr)</p>
                <h3 className="text-xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 sm:mt-1 tracking-tight">
                    {formatCurrency(summary?.totalCredit)}
                </h3>
            </div>

            {/* Total Debit */}
            <div className="rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/90 border border-dashed border-rose-300 dark:border-rose-800/80 p-2.5 sm:p-4 text-center shadow-xs">
                <p className="text-[11px] sm:text-xs font-bold text-rose-600 dark:text-rose-400">Total Debit (Payment Dr)</p>
                <h3 className="text-xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-0.5 sm:mt-1 tracking-tight">
                    {formatCurrency(summary?.totalDebit)}
                </h3>
            </div>

            {/* Net Balance */}
            <div className="rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/90 border border-dashed border-slate-300 dark:border-slate-700 p-2.5 sm:p-4 text-center shadow-xs">
                <p className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
                    Net Balance {summary?.netBalance >= 0 ? '(Payable)' : '(Receivable)'}
                </p>
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 sm:mt-1 tracking-tight">
                    {formatCurrency(summary?.netBalance)}
                </h3>
            </div>
        </div>
    );
};

export default React.memo(StatementMetricCards);
