import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from './ledgerHelpers';

const LedgerTableView = ({ ledgers, onRowClick, onQuickEntry, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                            <th className="py-3.5 px-5">LEDGER</th>
                            <th className="py-3.5 px-5">BALANCE STATUS</th>
                            <th className="py-3.5 px-5 text-right">NET BALANCE</th>
                            <th className="py-3.5 px-5 text-center">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs sm:text-sm">
                        {ledgers.map((led) => {
                            const isPayable = led.netBalance > 0;
                            const isReceivable = led.netBalance < 0;
                            const initial = (led.name || 'L').charAt(0).toUpperCase();

                            return (
                                <tr
                                    key={led._id}
                                    onClick={() => onRowClick(led._id)}
                                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition cursor-pointer group"
                                >
                                    {/* Ledger Name & Clean Initial Avatar */}
                                    <td className="py-3.5 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm ring-1 ring-emerald-300/40 dark:ring-emerald-700/40 shrink-0">
                                                {initial}
                                            </div>
                                            <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                                                {led.name}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Balance Status */}
                                    <td className="py-3.5 px-5">
                                        <span
                                            className={`px-2.5 py-1 rounded-md text-[10.5px] font-extrabold uppercase ${
                                                isPayable
                                                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                                    : isReceivable
                                                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                                                    : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                                            }`}
                                        >
                                            {isPayable ? 'PAYABLE' : isReceivable ? 'RECEIVABLE' : 'SETTLED'}
                                        </span>
                                    </td>

                                    {/* Net Balance */}
                                    <td className="py-3.5 px-5 text-right">
                                        <span
                                            className={`font-extrabold text-sm sm:text-base ${
                                                isPayable
                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                    : isReceivable
                                                    ? 'text-rose-600 dark:text-rose-400'
                                                    : 'text-slate-500'
                                            }`}
                                        >
                                            {formatCurrency(led.netBalance)}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onRowClick(led._id)}
                                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                                                title="View Statement"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                onClick={(e) => onEdit(led, e)}
                                                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 transition cursor-pointer"
                                                title="Edit Ledger Name"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                onClick={(e) => onDelete(led, e)}
                                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                                                title="Delete Ledger"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(LedgerTableView);
