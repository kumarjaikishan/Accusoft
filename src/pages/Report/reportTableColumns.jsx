import React from "react";
import dayjs from "dayjs";

const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

const getDesktopColumns = () => [
  { name: "#", selector: (_, i) => i + 1, width: "60px" },
  {
    name: "Ledger",
    selector: (row) => row.ledger.ledger,
    sortable: true,
    width: "140px",
    cell: (row) => <span className="capitalize text-content font-medium">{row.ledger.ledger}</span>,
  },
  {
    name: "Amount",
    selector: (row) => row.amount,
    sortable: true,
    width: "120px",
    cell: (row) => <span className="font-mono font-semibold text-content">₹ {row.amount}</span>,
  },
  {
    name: "Narration",
    selector: (row) => row.narration,
    grow: 2,
    wrap: true,
  },
  {
    name: "Date",
    selector: (row) => formatDate(row.date),
    sortable: true,
    width: "120px",
  },
];

const getMobileColumns = () => [
  {
    name: "#",
    selector: (_, i) => i + 1,
    width: "55px",
    cell: (_, i) => <span className="text-xs">{i + 1}</span>,
  },
  {
    name: "Ledger",
    selector: (row) => row.ledger.ledger,
    sortable: true,
    width: "90px",
    cell: (row) => <span className="capitalize text-[11px] ">{row.ledger.ledger}</span>,
  },
  {
    name: "₹",
    selector: (row) => row.amount,
    sortable: true,
    width: "70px",
    cell: (row) => <span className="text-xs font-semibold">₹ {row.amount}</span>,
  },
  {
    name: "Narration",
    selector: (row) => row.narration || "-",
    cell: (row) => <div className=" min-w-[250px]">
      {row.narration}
    </div>,
  },
  {
    name: "Date",
    selector: (row) => formatDate(row.date),
    width: "96px",
    cell: (row) => <span className="text-[11px]">{dayjs(row.date).format("DD MMM YY")}</span>,
  },
];

export const getReportTableColumns = ({ isMobile }) =>
  isMobile ? getMobileColumns() : getDesktopColumns();

