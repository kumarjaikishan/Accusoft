import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from './ledgerHelpers';

const LedgerCardView = ({ ledgers, onCardClick, onQuickEntry, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ledgers.map((led) => {
                const isPayable = led.netBalance > 0;
                const isReceivable = led.netBalance < 0;
                const initial = (led.name || 'L').charAt(0).toUpperCase();

                return (
                    <div
                        key={led._id}
                        onClick={() => onCardClick(led)}
                        className="group relative rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-4.5 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between space-y-3"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-base ring-1 ring-emerald-300/40 shrink-0">
                                    {initial}
                                </div>
                                <span
                                    className={`text-[10.5px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                        isPayable
                                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                                            : isReceivable
                                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-600'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {isPayable ? 'Payable' : isReceivable ? 'Receivable' : 'Settled'}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition">
                                    {led.name}
                                </h3>
                                <p className="text-[11px] text-slate-400">
                                    {led.transactionCount || 0} Transactions
                                </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-[10.5px] font-bold uppercase text-slate-400">Net Balance</span>
                                <div className="mt-0.5">
                                    <span
                                        className={`text-lg font-extrabold ${
                                            isPayable
                                                ? 'text-emerald-700 dark:text-emerald-400'
                                                : isReceivable
                                                ? 'text-rose-600 dark:text-rose-400'
                                                : 'text-slate-500'
                                        }`}
                                    >
                                        {formatCurrency(led.netBalance)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => onEdit(led, e)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                                    title="Edit Ledger Name"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => onDelete(led, e)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                    title="Delete Ledger"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default React.memo(LedgerCardView);
