import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Edit2, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import DataTable from '../../../components/common/DataTable';
import { useTableStyles } from '../../../components/dataTableStyle';
import { formatCurrency } from './ledgerHelpers';

const StatementTable = ({
    entries,
    onEditEntry,
    onDeleteEntry
}) => {
    const mode = useSelector((state) => state.theme?.mode || 'light');
    const baseTableStyles = useTableStyles();

    const customTableStyles = useMemo(() => ({
        ...baseTableStyles,
        rows: {
            ...baseTableStyles?.rows,
            style: {
                ...baseTableStyles?.rows?.style,
                minHeight: '40px',
            },
        },
        cells: {
            ...baseTableStyles?.cells,
            style: {
                ...baseTableStyles?.cells?.style,
                paddingTop: '6px',
                paddingBottom: '6px',
                fontSize: '11.5px',
            },
        },
    }), [baseTableStyles]);

    const columns = useMemo(() => [
        {
            name: 'S.No',
            cell: (row, index) => index + 1,
            width: '65px',
            center: true,
        },
        {
            name: 'Date',
            selector: (row) => row.date,
            sortable: true,
            width: '115px',
            cell: (row) => (
                <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px] whitespace-nowrap">
                    {dayjs(row.date).format('DD MMM, YYYY')}
                </span>
            ),
        },
        {
            name: 'Particular',
            selector: (row) => row.particular,
            sortable: true,
            grow: 2,
            cell: (row) => (
                <span className="font-medium text-slate-800 dark:text-slate-200 text-[11.5px]">
                    {row.particular}
                </span>
            ),
        },
        {
            name: 'Credit (₹)',
            selector: (row) => (row.type === 'CREDIT' ? row.amount : 0),
            sortable: true,
            right: true,
            width: '130px',
            cell: (row) => (
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap text-[11.5px]">
                    {row.type === 'CREDIT' ? `+${formatCurrency(row.amount)}` : '-'}
                </span>
            ),
        },
        {
            name: 'Debit (₹)',
            selector: (row) => (row.type === 'DEBIT' ? row.amount : 0),
            sortable: true,
            right: true,
            width: '130px',
            cell: (row) => (
                <span className="font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap text-[11.5px]">
                    {row.type === 'DEBIT' ? `-${formatCurrency(row.amount)}` : '-'}
                </span>
            ),
        },
        {
            name: 'Balance (₹)',
            selector: (row) => row.runningBalance,
            sortable: true,
            right: true,
            width: '140px',
            cell: (row) => (
                <span className="font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap text-[11.5px]">
                    {formatCurrency(row.runningBalance)}
                </span>
            ),
        },
        {
            name: 'Actions',
            center: true,
            width: '90px',
            cell: (row) => (
                <div className="flex items-center justify-center gap-1.5 print:hidden" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onEditEntry(row)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                        title="Edit Entry"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onDeleteEntry(row._id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                        title="Delete Entry"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ], [onEditEntry, onDeleteEntry]);

    return (
        <div className="bg-surface rounded-xl shadow-md border border-border-subtle overflow-hidden relative">
            <DataTable
                columns={columns}
                data={entries}
                theme={mode === 'dark' ? 'dark' : 'default'}
                pagination
                paginationPerPage={15}
                paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
                highlightOnHover
                customStyles={customTableStyles}
                noDataComponent={
                    <div className="py-12 text-center text-content bg-surface">
                        <div className="text-4xl mb-2 opacity-20">📂</div>
                        <p className="font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300">No Statement Records</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Entry" to record debit or credit vouchers.</p>
                    </div>
                }
            />
        </div>
    );
};

export default React.memo(StatementTable);
