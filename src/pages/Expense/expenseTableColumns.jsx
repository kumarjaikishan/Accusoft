import React from 'react';
import dayjs from 'dayjs';
import { Pencil, Trash2 } from 'lucide-react';

const getDesktopColumns = ({ setDataForEdit, deleteExpense, paginationContext }) => [
  {
    name: 'S.No',
    cell: (row, index) => (paginationContext.currentPage - 1) * paginationContext.rowsPerPage + index + 1,
    width: '70px',
  },
  {
    name: 'Ledger',
    selector: (row) => row.ledger?.ledger,
    sortable: true,
    width: '140px',
    cell: (row) => <span className="capitalize text-content font-medium">{row.ledger?.ledger}</span>,
  },
  {
    name: 'Amt',
    selector: (row) => row.amount,
    sortable: true,
    width: '100px',
    cell: (row) => <span className="font-mono font-semibold text-content">₹{row.amount}</span>,
  },
  {
    name: 'Narration',
    selector: (row) => row.narration,
    wrap: true,
  },
  {
    name: 'Date',
    selector: (row) => dayjs(row.date).format('DD MMM, YYYY'),
    sortable: true,
    width: '120px',
  },
  {
    name: 'Action',
    cell: (row) => (
      <div className="flex items-center gap-2">
        <button
          title="Edit"
          onClick={() => setDataForEdit(row)}
          className="p-1.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
        >
          <Pencil size={18} />
        </button>
        <button
          title="Delete"
          onClick={() => deleteExpense(row._id)}
          className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <Trash2 size={18} />
        </button>
      </div>
    ),
    ignoreRowClick: true,
    width: '100px',
  },
];

const getMobileColumns = ({ setDataForEdit, deleteExpense, paginationContext }) => [

  {
    name: 'Ledger',
    selector: (row) => row.ledger?.ledger,
    sortable: true,
    width: '120px',
    cell: (row) => <span className="capitalize text-content font-medium text-xs">{row.ledger?.ledger}</span>,
  },
  {
    name: '₹',
    selector: (row) => row.amount,
    sortable: true,
    width: '70px',
    cell: (row) => <span className="font-mono font-semibold text-content text-xs"> {row.amount}</span>,
  },
  {
    name: 'Narration',
    selector: (row) => row.narration,
    cell: (row) => <span className="text-[11px]">{row.narration}</span>,
    width: '250px',
    wrap: true,
  },
  {
    name: 'Date',
    selector: (row) => dayjs(row.date).format('DD MMM, YYYY'),
    sortable: true,
    width: '90px',
    cell: (row) => <span className="text-[10px]">{dayjs(row.date).format('DD MMM, YYYY')}</span>,
  },
  {
    name: 'Action',
    width: '80px',
    cell: (row) => (
      <div className="flex items-center gap-1">
        <button
          title="Edit"
          onClick={() => setDataForEdit(row)}
          className="p-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
        >
          <Pencil size={14} />
        </button>
        <button
          title="Delete"
          onClick={() => deleteExpense(row._id)}
          className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ),
    ignoreRowClick: true,
  },
];

export const getExpenseTableColumns = ({ isMobile, setDataForEdit, deleteExpense, paginationContext }) =>
  isMobile ? getMobileColumns({ setDataForEdit, deleteExpense, paginationContext }) : getDesktopColumns({ setDataForEdit, deleteExpense, paginationContext });
