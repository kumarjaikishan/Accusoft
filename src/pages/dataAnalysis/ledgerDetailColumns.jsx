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
  },
  {
    name: "₹",
    selector: (row) => `₹${row.amount}`,
    sortable: true,
    right: true,
    width: "70px",
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
  },
  {
    name: "₹",
    selector: (row) => `₹${row.amount}`,
    sortable: true,
    right: true,
    width: "80px",
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

