import React from "react";
import dayjs from "dayjs";

const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

const getDesktopColumns = ({ paginationContext }) => [
  { 
    name: "#", 
    cell: (row, i) => (paginationContext.currentPage - 1) * paginationContext.rowsPerPage + i + 1, 
    width: "40px" 
  },
  {
    name: "Ledger",
    selector: (row) => row.ledger.ledger,
    sortable: true,
    width: "100px",
    cell: (row) => <span className="capitalize text-content font-medium">{row.ledger.ledger}</span>,
  },
  {
    name: "₹",
    selector: (row) => row.amount,
    sortable: true,
    width: "80px",
    cell: (row) => <span className="font-mono font-semibold text-content">₹{row.amount}</span>,
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
    width: "110px",
  },
];

const getMobileColumns = ({ paginationContext }) => [
  {
    name: "#",
    cell: (_, i) => <span className="text-xs">{(paginationContext.currentPage - 1) * paginationContext.rowsPerPage + i + 1}</span>,
    width: "40px",
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
    width: "65px",
    cell: (row) => <span className="text-xs font-semibold">₹{row.amount}</span>,
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

export const getReportTableColumns = ({ isMobile, paginationContext }) =>
  isMobile ? getMobileColumns({ paginationContext }) : getDesktopColumns({ paginationContext });

