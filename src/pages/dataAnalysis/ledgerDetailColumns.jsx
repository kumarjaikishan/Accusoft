import React from "react";
import dayjs from "dayjs";

const formatLedger = (row) =>
  row.ledger?.ledger
    ? row.ledger.ledger.charAt(0).toUpperCase() + row.ledger.ledger.slice(1)
    : "-";

const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

const getDesktopColumns = () => [
  {
    name: "#",
    selector: (_, i) => i + 1,
    width: "40px",
  },
  {
    name: "Ledger",
    selector: (row) => row.ledger?.ledger,
    cell: (row) => <div className="capitalize text-content font-medium text-xs">{row.ledger?.ledger}</div>,
    width: "90px",
    footer: () => <span className="uppercase text-[11px] font-black tracking-wider text-slate-500 dark:text-slate-400">Total:</span>,
  },
  {
    name: "₹",
    selector: (row) => `₹${row.amount}`,
    sortable: true,
    right: true,
    width: "70px",
    footer: ({ displayData }) => {
      const total = displayData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      return <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">₹{total.toLocaleString()}</span>;
    },
  },
  {
    name: "Narration",
    selector: (row) => row.narration || "-",
    grow: 2,
    wrap: true,
  },
  {
    name: "Date",
    selector: (row) => formatDate(row.date),
    width: "100px",
  },
];

const getMobileColumns = () => [
  {
    name: "#",
    selector: (_, i) => i + 1,
    width: "35px",
  },
  {
    name: "Ledger",
    selector: (row) => row.ledger?.ledger,
    cell: (row) => <div className="capitalize text-content font-medium text-xs">{row.ledger?.ledger}</div>,
    width: "90px",
    footer: () => <span className="uppercase text-[10px] font-black tracking-wider text-slate-500 dark:text-slate-400">Total:</span>,
  },
  {
    name: "₹",
    selector: (row) => `₹${row.amount}`,
    sortable: true,
    right: true,
    width: "80px",
    footer: ({ displayData }) => {
      const total = displayData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      return <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">₹{total.toLocaleString()}</span>;
    },
  },
  {
    name: "Narration",
    selector: (row) => row.narration || "-",
    //  width: "100px",
    grow: 2,
    // wrap: true,
  },
  {
    name: "Date",
    selector: (row) => <span className="text-[11px]">{dayjs(row.date).format('DD MMM, YYYY')}</span>,
    width: "100px",
  },
];

export const getLedgerDetailColumns = ({ isMobile }) =>
  isMobile ? getMobileColumns() : getDesktopColumns();

