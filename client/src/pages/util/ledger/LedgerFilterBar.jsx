import React from 'react';
import { Search, LayoutGrid, Table as TableIcon, Plus } from 'lucide-react';
import SelectInput from '../../../components/common/SelectInput';

const LedgerFilterBar = ({
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    balanceFilter,
    setBalanceFilter,
    sortBy,
    setSortBy,
    onAddNew
}) => {
    const balanceOptions = [
        { value: 'ALL', label: 'All Balances' },
        { value: 'PAYABLE', label: 'Payable Only' },
        { value: 'RECEIVABLE', label: 'Receivable Only' },
        { value: 'ZERO', label: 'Settled (0.00)' },
    ];

    const sortOptions = [
        { value: 'name_asc', label: 'Name (A → Z)' },
        { value: 'name_desc', label: 'Name (Z → A)' },
        { value: 'balance_desc', label: 'Highest Balance' },
        { value: 'balance_asc', label: 'Lowest Balance' },
    ];

    return (
        <div className="relative z-20 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 flex-1">
                {/* Search input */}
                <div className="relative flex-1 min-w-[200px] w-full sm:w-auto sm:max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search name, code, phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 sm:py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* View Switch: Card / Table */}
                    <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setViewMode('card')}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                viewMode === 'card'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>Card</span>
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                viewMode === 'table'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            <TableIcon className="w-3.5 h-3.5" />
                            <span>Table</span>
                        </button>
                    </div>

                    {/* Filter Balance Status */}
                    <SelectInput
                        size="sm"
                        value={balanceFilter}
                        onChange={(e) => setBalanceFilter(e.target.value)}
                        options={balanceOptions}
                        className="!h-8 !px-2.5 font-bold min-w-[130px]"
                    />

                    {/* Sort Dropdown */}
                    <SelectInput
                        size="sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        options={sortOptions}
                        className="!h-8 !px-2.5 font-bold min-w-[145px]"
                    />
                </div>
            </div>

            {/* Add Ledger Action */}
            <button
                onClick={onAddNew}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition cursor-pointer shrink-0"
            >
                <Plus className="w-4 h-4" />
                <span>Add Ledger</span>
            </button>
        </div>
    );
};

export default React.memo(LedgerFilterBar);
