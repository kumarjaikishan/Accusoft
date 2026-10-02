import React, { useMemo } from 'react';
import SelectInput from '../../../components/common/SelectInput';
import DatePicker from '../../../components/common/DatePicker';

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

    const yearOptions = useMemo(() => [
        { value: 'all', label: 'All Years' },
        ...Array.from({ length: 7 }, (_, i) => {
            const y = new Date().getFullYear() - i;
            return { value: String(y), label: String(y) };
        })
    ], []);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthOptions = useMemo(() => [
        { value: 'all', label: 'All Months' },
        ...monthNames.map((m, idx) => ({ value: String(idx), label: m }))
    ], []);

    return (
        <div className="relative z-20 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 print:hidden">
            <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Year Filter */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                    <span className="font-semibold text-slate-500">Year:</span>
                    <SelectInput
                        size="sm"
                        value={String(selectedYear)}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        options={yearOptions}
                        className="!h-8 !px-2.5 font-bold min-w-[105px]"
                    />
                </div>

                {/* Month Filter */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                    <span className="font-semibold text-slate-500">Month:</span>
                    <SelectInput
                        size="sm"
                        value={String(selectedMonth)}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        options={monthOptions}
                        className="!h-8 !px-2.5 font-bold min-w-[125px]"
                    />
                </div>

                {/* Date Pickers */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                    <span className="font-semibold text-slate-500">From:</span>
                    <div className="w-[140px]">
                        <DatePicker
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            placeholder="Start date"
                            className="!py-1.5 !px-2.5 text-xs font-bold !rounded-xl"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                    <span className="font-semibold text-slate-500">To:</span>
                    <div className="w-[140px]">
                        <DatePicker
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            placeholder="End date"
                            className="!py-1.5 !px-2.5 text-xs font-bold !rounded-xl"
                        />
                    </div>
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
