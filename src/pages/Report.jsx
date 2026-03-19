import React, { useState, useMemo, useCallback } from "react";
import { Download, Printer, RefreshCcw } from 'lucide-react';

import { useSelector, useDispatch } from "react-redux";
import { CSVLink } from "react-csv";
import { setnarrow } from "../store/login";

import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";

const Report = () => {
    const dispatch = useDispatch();
    const { user, explist, ledgerlist } = useSelector(
        (state) => state.userexplist
    );
    const mode = useSelector((state) => state.theme?.mode || "light");

    const [inputs, setInputs] = useState({
        from: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
        ledger: "all",
    });

    /* ---------------- FILTER ---------------- */

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }, []);

    const filteredData = useMemo(() => {
        return explist.filter((item) => {
            const itemDate = dayjs(item.date);
            const inRange = itemDate.isBetween(
                dayjs(inputs.from).startOf("day"),
                dayjs(inputs.to).endOf("day"),
                null,
                "[]"
            );

            return inputs.ledger === "all"
                ? inRange
                : inRange && item.ledger.ledger === inputs.ledger;
        });
    }, [explist, inputs]);

    const totalAmount = useMemo(
        () =>
            filteredData.reduce((acc, val) => acc + Number(val.amount), 0),
        [filteredData]
    );

    const clearSearch = useCallback(() => {
        setInputs({
            from: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
            to: dayjs().format("YYYY-MM-DD"),
            ledger: "all",
        });
    }, []);

    const handlePrint = useCallback(() => {
        dispatch(setnarrow(true));
        setTimeout(() => window.print(), 200);
    }, [dispatch]);

    const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

    /* ---------------- TABLE COLUMNS ---------------- */

    const columns = [
        { name: "#", selector: (_, i) => i + 1, width: "60px" },
        {
            name: "Ledger",
            selector: (row) => row.ledger.ledger,
            sortable: true,
            width: "140px",
            cell: row => <span className="capitalize text-content font-medium">{row.ledger.ledger}</span>
        },
        {
            name: "Amount",
            selector: (row) => row.amount,
            sortable: true,
            width: "120px",
            cell: row => <span className="font-mono font-semibold text-content">₹{row.amount}</span>
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

    const customDataTableStyles = {
        table: { style: { backgroundColor: 'transparent' } },
        header: { style: { display: 'none' } },
        headRow: {
            style: {
                backgroundColor: 'var(--theme-page)',
                color: 'var(--theme-content)',
                borderBottom: '1px solid var(--theme-border)',
                minHeight: '48px',
            },
        },
        headCells: {
            style: {
                fontWeight: '700',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            },
        },
        rows: {
            style: {
                backgroundColor: 'var(--theme-surface)',
                color: 'var(--theme-content)',
                minHeight: '45px',
                '&:not(:last-child)': {
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: 'var(--theme-border)',
                },
            },
            highlightOnHoverStyle: {
                backgroundColor: 'var(--theme-page)',
                borderBottomColor: 'var(--theme-content)',
                outline: '1px solid var(--theme-border)',
            },
        },
        pagination: {
            style: {
                backgroundColor: 'var(--theme-surface)',
                color: 'var(--theme-content)',
                borderTop: '1px solid var(--theme-border)',
                marginTop: '0px',
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-page p-4 md:p-6 space-y-8"
        >
            {/* ---------------- FILTER BAR ---------------- */}
            <div className="bg-surface rounded-2xl shadow-lg dark:shadow-none border border-border-subtle p-6 flex flex-wrap gap-4 items-center justify-between print:hidden">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex flex-col text-sm">
                        <label className="text-gray-500 dark:text-gray-400 mb-1">From</label>
                        <input
                            type="date"
                            name="from"
                            value={inputs.from}
                            onChange={handleInputChange}
                            className="border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <div className="flex flex-col text-sm">
                        <label className="text-gray-500 dark:text-gray-400 mb-1">To</label>
                        <input
                            type="date"
                            name="to"
                            value={inputs.to}
                            onChange={handleInputChange}
                            className="border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <div className="flex flex-col text-sm">
                        <label className="text-gray-500 dark:text-gray-400 mb-1">Ledger</label>
                        <select
                            name="ledger"
                            value={inputs.ledger}
                            onChange={handleInputChange}
                            className="border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                            <option value="all">All</option>
                            {ledgerlist.map((val) => (
                                <option key={val._id} value={val.ledger}>
                                    {val.ledger}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={clearSearch}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-lg transition text-sm"
                    >
                        <RefreshCcw /> Clear
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <CSVLink
                        data={filteredData}
                        headers={[
                            { label: "Ledger", key: "ledger.ledger" },
                            { label: "Amount", key: "amount" },
                            { label: "Date", key: "date" },
                            { label: "Narration", key: "narration" },
                        ]}
                        filename={`${user?.name}-Expense-Record`}
                    >
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                            <Download /> CSV
                        </button>
                    </CSVLink>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
                    >
                        <Printer /> Print
                    </button>
                </div>
            </div>

            {/* ---------------- TOTAL CARD ---------------- */}
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 print:!from-indigo-600 print:!to-cyan-500 print:!text-white dark:from-slate-800 dark:to-slate-900 border border-transparent dark:border-white/10 text-white rounded-2xl p-6 shadow-lg dark:shadow-none flex justify-between items-center">
                <div>
                    <p className="text-sm opacity-80">
                        Report from {formatDate(inputs.from)} to{" "}
                        {formatDate(inputs.to)}
                    </p>
                    <h2 className="text-3xl font-bold mt-1">
                        ₹ {totalAmount.toLocaleString()}
                    </h2>
                </div>
                <div className="text-sm opacity-80">
                    {filteredData.length} Records
                </div>
            </div>

            {/* ---------------- DATA TABLE ---------------- */}
            <div className="bg-surface rounded-2xl shadow-md border border-border-subtle overflow-hidden overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={filteredData}

                    highlightOnHover
                    customStyles={customDataTableStyles}
                    noDataComponent={
                        <div className="py-12 text-center text-content bg-surface">
                            <div className="text-4xl mb-2 opacity-20">📂</div>
                            <p className="font-medium">No expense records found</p>
                        </div>
                    }
                />
            </div>
        </motion.div>
    );
};

export default Report;