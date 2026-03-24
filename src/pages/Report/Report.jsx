import React, { useState, useMemo, useCallback, useEffect, useDeferredValue } from "react";
import { Download, Printer, RefreshCcw } from 'lucide-react';

import { useSelector, useDispatch } from "react-redux";
import { CSVLink } from "react-csv";
import { setnarrow } from "../../store/login";

import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { getReportTableColumns } from "./reportTableColumns";
import { useTableStyles } from "../../components/dataTableStyle";

const Report = () => {
    const dispatch = useDispatch();
    const { user, explist, ledgerlist } = useSelector(
        (state) => state.userexplist
    );
    const [inputs, setInputs] = useState({
        from: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
        ledger: "all",
    });

    const deferredInputs = useDeferredValue(inputs);

    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    /* ---------------- FILTER ---------------- */

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }, []);

    const filteredData = useMemo(() => {
        return explist.filter((item) => {
            const itemDate = dayjs(item.date);
            const inRange = itemDate.isBetween(
                dayjs(deferredInputs.from).startOf("day"),
                dayjs(deferredInputs.to).endOf("day"),
                null,
                "[]"
            );

            return deferredInputs.ledger === "all"
                ? inRange
                : inRange && item.ledger.ledger === deferredInputs.ledger;
        });
    }, [explist, deferredInputs]);

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

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* ---------------- TABLE COLUMNS ---------------- */

    const columns = getReportTableColumns({ isMobile });

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-page p-2 lg:p-4 md:p-6 space-y-8"
        >
            {/* ---------------- FILTER BAR ---------------- */}
            <div className="bg-surface rounded-2xl shadow-lg dark:shadow-none border border-border-subtle p-4 sm:p-6 print:hidden">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 w-full">
                        <div className="flex flex-col text-sm min-w-0">
                            <label className="text-gray-500 dark:text-gray-400 mb-1">From</label>
                            <input
                                type="date"
                                name="from"
                                value={inputs.from}
                                onChange={handleInputChange}
                                className="w-full h-10 border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>

                        <div className="flex flex-col text-sm min-w-0">
                            <label className="text-gray-500 dark:text-gray-400 mb-1">To</label>
                            <input
                                type="date"
                                name="to"
                                value={inputs.to}
                                onChange={handleInputChange}
                                className="w-full h-10 border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>

                        <div className="flex flex-col text-sm min-w-0">
                            <label className="text-gray-500 dark:text-gray-400 mb-1">Ledger</label>
                            <select
                                name="ledger"
                                value={inputs.ledger}
                                onChange={handleInputChange}
                                className="w-full h-10 border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            >
                                <option value="all">All</option>
                                {ledgerlist.map((val) => (
                                    <option key={val._id} value={val.ledger}>
                                        {val.ledger}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={clearSearch}
                                className="w-full h-10 flex items-center justify-center gap-2 px-4 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-lg transition text-sm"
                            >
                                <RefreshCcw size={16} /> Clear
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 sm:flex gap-3 w-full lg:w-auto">
                        <CSVLink
                            data={filteredData}
                            headers={[
                                { label: "Ledger", key: "ledger.ledger" },
                                { label: "Amount", key: "amount" },
                                { label: "Date", key: "date" },
                                { label: "Narration", key: "narration" },
                            ]}
                            filename={`${user?.name}-Expense-Record`}
                            className="w-full sm:w-auto"
                        >
                            <button className="w-full sm:w-auto h-10 flex items-center justify-center gap-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                                <Download size={16} /> CSV
                            </button>
                        </CSVLink>

                        <button
                            onClick={handlePrint}
                            className="w-full sm:w-auto h-10 flex items-center justify-center gap-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
                        >
                            <Printer size={16} /> Print
                        </button>
                    </div>
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
            <div className="bg-surface rounded-xm md:rounded-2xl shadow-md border border-border-subtle overflow-hidden overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    highlightOnHover
                    customStyles={useTableStyles()}
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


