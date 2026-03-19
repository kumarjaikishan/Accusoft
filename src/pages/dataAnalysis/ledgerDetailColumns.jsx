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
    width: "60px",
  },
  {
    name: "Ledger",
    selector: (row) => formatLedger(row),
    width: "140px",
  },
  {
    name: "Amount",
    selector: (row) => `₹ ${row.amount}`,
    sortable: true,
    right: true,
    width: "120px",
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
    width: "140px",
  },
];

const getMobileColumns = () => [
  {
    name: "#",
    selector: (_, i) => i + 1,
    width: "40px",
  },
  {
    name: "Ledger",
    selector: (row) => formatLedger(row),
    width: "90px",
  },
  {
    name: "₹",
    selector: (row) => ` ${row.amount} ₹`,
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

