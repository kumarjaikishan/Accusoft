import React from 'react';
import { ArrowLeft, Plus, Download, Printer } from 'lucide-react';

const StatementHeader = ({ ledger, entriesCount, onBack, onAddEntry, onExportCSV, onPrint }) => {
    const initial = (ledger?.name || 'L').charAt(0).toUpperCase();

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:border-none print:shadow-none">
            {/* Left: Avatar initial + Name + Txns */}
            <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-lg ring-2 ring-emerald-300/40 shrink-0">
                    {initial}
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        {ledger?.name || 'Ledger Detail'}
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Total Transactions: <strong className="text-slate-600 dark:text-slate-300">{entriesCount}</strong>
                    </p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-2 print:hidden w-full md:w-auto">
                <button
                    onClick={onBack}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <button
                    onClick={onAddEntry}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Entry</span>
                </button>

                <button
                    onClick={onExportCSV}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                </button>

                <button
                    onClick={onPrint}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    title="Print Statement"
                >
                    <Printer className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default React.memo(StatementHeader);
