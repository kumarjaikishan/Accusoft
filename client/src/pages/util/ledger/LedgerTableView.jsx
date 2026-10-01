import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../../components/common/DataTable';
import { useTableStyles } from '../../../components/dataTableStyle';
import { formatCurrency } from './ledgerHelpers';

const LedgerTableView = ({ ledgers, onRowClick, onEdit, onDelete }) => {
    const mode = useSelector((state) => state.theme?.mode || 'light');
    const baseTableStyles = useTableStyles();

    const customTableStyles = useMemo(() => ({
        ...baseTableStyles,
        rows: {
            ...baseTableStyles?.rows,
            style: {
                ...baseTableStyles?.rows?.style,
                minHeight: '44px',
            },
        },
        cells: {
            ...baseTableStyles?.cells,
            style: {
                ...baseTableStyles?.cells?.style,
                paddingTop: '6px',
                paddingBottom: '6px',
            },
        },
    }), [baseTableStyles]);

    const columns = useMemo(() => [
        {
            name: 'Ledger',
            selector: (row) => row.name,
            sortable: true,
            grow: 2,
            cell: (row) => {
                const initial = (row.name || 'L').charAt(0).toUpperCase();
                return (
                    <div className="flex items-center gap-2.5 py-1">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs ring-1 ring-emerald-300/40 shrink-0">
                            {initial}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                            {row.name}
                        </span>
                    </div>
                );
            },
        },
        {
            name: 'Status',
            selector: (row) => (row.netBalance > 0 ? 'PAYABLE' : row.netBalance < 0 ? 'RECEIVABLE' : 'SETTLED'),
            sortable: true,
            width: '130px',
            cell: (row) => {
                const isPayable = row.netBalance > 0;
                const isReceivable = row.netBalance < 0;
                return (
                    <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isPayable
                                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60'
                                : isReceivable
                                ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60'
                                : 'text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        {isPayable ? 'PAYABLE' : isReceivable ? 'RECEIVABLE' : 'SETTLED'}
                    </span>
                );
            },
        },
        {
            name: 'Net Balance',
            selector: (row) => row.netBalance,
            sortable: true,
            right: true,
            width: '150px',
            cell: (row) => {
                const isPayable = row.netBalance > 0;
                const isReceivable = row.netBalance < 0;
                return (
                    <span
                        className={`font-extrabold text-xs sm:text-sm ${
                            isPayable
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : isReceivable
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-slate-500'
                        }`}
                    >
                        {formatCurrency(row.netBalance)}
                    </span>
                );
            },
        },
        {
            name: 'Actions',
            center: true,
            width: '120px',
            cell: (row) => (
                <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onRowClick(row)}
                        className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                        title="View Statement"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => onEdit(row, e)}
                        className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 transition cursor-pointer"
                        title="Edit Ledger Name"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => onDelete(row, e)}
                        className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                        title="Delete Ledger"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ], [onRowClick, onEdit, onDelete]);

    return (
        <div className="bg-surface rounded-xl shadow-md border border-border-subtle overflow-hidden relative">
            <DataTable
                columns={columns}
                data={ledgers}
                theme={mode === 'dark' ? 'dark' : 'default'}
                pagination
                paginationPerPage={15}
                paginationRowsPerPageOptions={[10, 15, 25, 50]}
                highlightOnHover
                pointerOnHover
                onRowClicked={(row) => onRowClick(row)}
                customStyles={customTableStyles}
                noDataComponent={
                    <div className="py-12 text-center text-content bg-surface">
                        <div className="text-4xl mb-2 opacity-20">📂</div>
                        <p className="font-medium text-xs sm:text-sm">No ledger accounts found</p>
                        <p className="text-xs text-slate-400 mt-0.5">Click "Add Ledger" to create your first account</p>
                    </div>
                }
            />
        </div>
    );
};

export default React.memo(LedgerTableView);
