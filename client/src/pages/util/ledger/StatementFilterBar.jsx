import React from 'react';

const StatementFilterBar = ({
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    onClearFilters,
    recordsCount
}) => {
    const hasActiveFilters = fromDate || toDate || selectedYear !== 'all' || selectedMonth !== 'all';

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 print:hidden">
            <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Year Filter */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                    <span className="font-semibold text-slate-500">Year:</span>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full sm:w-auto px-2.5 py-2 sm:py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none cursor-pointer"
                    >
                        <option value="all">All Years</option>
                        {Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                {/* Month Filter */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                    <span className="font-semibold text-slate-500">Month:</span>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full sm:w-auto px-2.5 py-2 sm:py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none cursor-pointer"
                    >
                        <option value="all">All Months</option>
                        {[
                            'January', 'February', 'March', 'April', 'May', 'June',
                            'July', 'August', 'September', 'October', 'November', 'December'
                        ].map((m, idx) => (
                            <option key={idx} value={idx}>{m}</option>
                        ))}
                    </select>
                </div>

                {/* Date Pickers */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                    <span className="font-semibold text-slate-500">From:</span>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
                    />
                </div>

                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                    <span className="font-semibold text-slate-500">To:</span>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full sm:w-auto px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
                    />
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="px-2 py-1 text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="text-xs text-slate-400 font-medium">
                Showing <strong className="text-slate-700 dark:text-slate-200">{recordsCount}</strong> of {recordsCount} records
            </div>
        </div>
    );
};

export default React.memo(StatementFilterBar);
