import React from 'react';
import { Edit2, Trash2, Layers } from 'lucide-react';
import dayjs from 'dayjs';
import { formatCurrency } from './ledgerHelpers';

const StatementTable = ({
    ledger,
    entries,
    paginatedEntries,
    currentPage,
    pageSize,
    setPageSize,
    setCurrentPage,
    totalPages,
    onEditEntry,
    onDeleteEntry
}) => {
    return (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#123e35] text-white text-xs font-bold uppercase tracking-wider">
                            <th className="py-3 px-3.5 w-14">S.NO</th>
                            <th className="py-3 px-3.5 w-28">DATE</th>
                            <th className="py-3 px-4">PARTICULAR</th>
                            <th className="py-3 px-4 text-right">CREDIT (₹)</th>
                            <th className="py-3 px-4 text-right">DEBIT (₹)</th>
                            <th className="py-3 px-4 text-right">BALANCE (₹)</th>
                            <th className="py-3 px-3.5 text-center w-24 print:hidden">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs sm:text-sm">
                        {paginatedEntries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-12 text-center text-slate-400">
                                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No Statement Records</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Click "Add Entry" to record debit or credit vouchers.</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedEntries.map((item, index) => {
                                const serial = (currentPage - 1) * pageSize + index + 1;
                                const isCredit = item.type === 'CREDIT';

                                return (
                                    <tr key={item._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                                        <td className="py-3 px-3.5 text-slate-400 font-mono text-xs">{serial}</td>
                                        <td className="py-3 px-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                                            {dayjs(item.date).format('DD MMM, YYYY')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                {item.particular}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                                            {isCredit ? `+${formatCurrency(item.amount)}` : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                                            {!isCredit ? `-${formatCurrency(item.amount)}` : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-right font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                                            {formatCurrency(item.runningBalance)}
                                        </td>
                                        <td className="py-3 px-3.5 print:hidden">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => onEditEntry(item)}
                                                    className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                                                    title="Edit Entry"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteEntry(item._id)}
                                                    className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                                                    title="Delete Entry"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <span>
                        {entries.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
                        {Math.min(currentPage * pageSize, entries.length)} of {entries.length}
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                        >
                            «
                        </button>
                        <button
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                        >
                            »
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(StatementTable);
