import React from 'react';
import { Search, LayoutGrid, Table as TableIcon, Plus } from 'lucide-react';

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
    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
                    <select
                        value={balanceFilter}
                        onChange={(e) => setBalanceFilter(e.target.value)}
                        className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                    >
                        <option value="ALL">All Balances</option>
                        <option value="PAYABLE">Payable Only</option>
                        <option value="RECEIVABLE">Receivable Only</option>
                        <option value="ZERO">Settled (0.00)</option>
                    </select>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                    >
                        <option value="name_asc">Name (A → Z)</option>
                        <option value="name_desc">Name (Z → A)</option>
                        <option value="balance_desc">Highest Balance</option>
                        <option value="balance_asc">Lowest Balance</option>
                    </select>
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
