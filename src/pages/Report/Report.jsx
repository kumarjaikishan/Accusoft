import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
    Download,
    Printer,
    RotateCcw,
    Calendar,
    Layers,
    Filter
} from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { setnarrow, setloader } from "../../store/login";
import { motion } from "framer-motion";
import { downloadCSV } from "../../utils/csvExport";
import DataTable from "../../components/common/DataTable";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { getReportTableColumns } from "./reportTableColumns";
import { useTableStyles } from "../../components/dataTableStyle";
import { useApi } from "../../utils/useApi";

const Report = () => {
    const dispatch = useDispatch();
    const { user, ledgerlist } = useSelector(
        (state) => state.userexplist
    );
    const { request, loading } = useApi();

    const initialInputs = useMemo(() => ({
        from: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
        ledger: "all",
    }), []);

    const [inputs, setInputs] = useState(initialInputs);
    const [appliedInputs, setAppliedInputs] = useState(initialInputs);

    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [filteredData, setFilteredData] = useState([]);
    const [sumAmount, setSumAmount] = useState(0);

    /* ---------------- FILTER HANDLERS ---------------- */
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleBlur = useCallback(() => {
        setAppliedInputs((prev) => {
            if (prev.from === inputs.from && prev.to === inputs.to && prev.ledger === inputs.ledger) {
                return prev;
            }
            return inputs;
        });
    }, [inputs]);

    const handleSelectChange = useCallback((e) => {
        const { name, value } = e.target;
        setInputs((prev) => {
            const updated = { ...prev, [name]: value };
            setAppliedInputs(updated);
            return updated;
        });
    }, []);

    // Quick Date Range Presets
    const setPresetRange = useCallback((preset) => {
        let from, to = dayjs().format("YYYY-MM-DD");
        if (preset === "thisMonth") {
            from = dayjs().startOf("month").format("YYYY-MM-DD");
            to = dayjs().endOf("month").format("YYYY-MM-DD");
        } else if (preset === "last30Days") {
            from = dayjs().subtract(30, "day").format("YYYY-MM-DD");
        } else if (preset === "last90Days") {
            from = dayjs().subtract(90, "day").format("YYYY-MM-DD");
        } else if (preset === "thisYear") {
            from = dayjs().startOf("year").format("YYYY-MM-DD");
        }
        const updated = { ...inputs, from, to };
        setInputs(updated);
        setAppliedInputs(updated);
    }, [inputs]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const params = new URLSearchParams({
                    from: appliedInputs.from,
                    to: appliedInputs.to,
                });
                if (appliedInputs.ledger && appliedInputs.ledger !== "all") {
                    params.set("ledger", appliedInputs.ledger);
                }
                const res = await request({ url: `explistrange?${params.toString()}`, method: "GET" });
                if (cancelled) return;
                setFilteredData(res?.items || []);
                setSumAmount(res?.sumAmount || 0);
            } catch (error) {
                if (!cancelled) {
                    setFilteredData([]);
                    setSumAmount(0);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [appliedInputs.from, appliedInputs.to, appliedInputs.ledger]);

    useEffect(() => {
        setCurrentPage(1);
    }, [appliedInputs]);

    const clearSearch = useCallback(() => {
        const resetState = {
            from: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
            to: dayjs().format("YYYY-MM-DD"),
            ledger: "all",
        };
        setInputs(resetState);
        setAppliedInputs(resetState);
    }, []);

    const handlePrint = useCallback(() => {
        dispatch(setnarrow(true));
        setTimeout(() => window.print(), 200);
    }, [dispatch]);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        dispatch(setloader(loading));
    }, [loading, dispatch]);

    const fmt = (n) =>
        typeof n === "number"
            ? n.toLocaleString("en-IN", { maximumFractionDigits: 2 })
            : n;

    const columns = getReportTableColumns({
        isMobile,
        paginationContext: { currentPage, rowsPerPage }
    });

    const TableSkeleton = () => (
        <div className="w-full p-4 space-y-3 bg-white dark:bg-slate-900 animate-pulse">
            {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
            ))}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] p-3 sm:p-5 space-y-3.5 transition-colors duration-300 font-sans text-slate-700 dark:text-slate-200"
        >
            {/* ---------------- FILTER & PRESETS BAR ---------------- */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-4 print:hidden space-y-3">
                {/* Top Row: Presets & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    {/* Left: Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-slate-400 dark:text-slate-500 font-semibold mr-1 flex items-center gap-1">
                            <Filter className="w-3.5 h-3.5" /> Presets:
                        </span>
                        <button
                            type="button"
                            onClick={() => setPresetRange("thisMonth")}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-medium transition cursor-pointer"
                        >
                            This Month
                        </button>
                        <button
                            type="button"
                            onClick={() => setPresetRange("last30Days")}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-medium transition cursor-pointer"
                        >
                            Last 30 Days
                        </button>
                        <button
                            type="button"
                            onClick={() => setPresetRange("last90Days")}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-medium transition cursor-pointer"
                        >
                            Last Quarter
                        </button>
                        <button
                            type="button"
                            onClick={() => setPresetRange("thisYear")}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-medium transition cursor-pointer"
                        >
                            This Year
                        </button>
                    </div>

                    {/* Right: Export & Print Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                downloadCSV(
                                    filteredData,
                                    [
                                        { label: "Ledger", key: "ledger.ledger" },
                                        { label: "Amount", key: "amount" },
                                        { label: "Date", key: "date" },
                                        { label: "Narration", key: "narration" },
                                    ],
                                    `${user?.name || 'Expense'}-Report`
                                )
                            }
                            className="h-8 px-3 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm text-xs font-bold transition cursor-pointer"
                        >
                            <Download size={13} /> Export CSV
                        </button>

                        <button
                            onClick={handlePrint}
                            className="h-8 px-3 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm text-xs font-bold transition cursor-pointer"
                        >
                            <Printer size={13} /> Print
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Detailed Date Range & Category Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                    {/* From Date */}
                    <div className="flex flex-col text-xs">
                        <label className="text-slate-500 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-500" /> Start Date
                        </label>
                        <input
                            type="date"
                            name="from"
                            value={inputs.from}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                            className="w-full h-9 border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-medium"
                        />
                    </div>

                    {/* To Date */}
                    <div className="flex flex-col text-xs">
                        <label className="text-slate-500 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-500" /> End Date
                        </label>
                        <input
                            type="date"
                            name="to"
                            value={inputs.to}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                            className="w-full h-9 border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-medium"
                        />
                    </div>

                    {/* Ledger Selector */}
                    <div className="flex flex-col text-xs">
                        <label className="text-slate-500 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-indigo-500" /> Category
                        </label>
                        <select
                            name="ledger"
                            value={inputs.ledger}
                            onChange={handleSelectChange}
                            className="w-full h-9 border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-medium cursor-pointer"
                        >
                            <option value="all">All Categories</option>
                            {ledgerlist.map((val) => (
                                <option key={val._id} value={val.ledger}>
                                    {val.ledger}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-end">
                        <button
                            onClick={clearSearch}
                            className="w-full h-9 flex items-center justify-center gap-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition text-xs font-semibold cursor-pointer"
                        >
                            <RotateCcw size={13} /> Reset Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------------- DATA TABLE CONTAINER ---------------- */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    highlightOnHover
                    pagination
                    paginationDefaultPage={currentPage}
                    onChangePage={page => setCurrentPage(page)}
                    onChangeRowsPerPage={num => {
                        setRowsPerPage(num);
                        setCurrentPage(1);
                    }}
                    customStyles={useTableStyles()}
                    progressPending={loading}
                    progressComponent={<TableSkeleton />}
                    noDataComponent={
                        <div className="py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                            <div className="text-4xl mb-2 opacity-30">📂</div>
                            <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No expense records found</p>
                            <p className="text-xs text-slate-400 mt-0.5">Try widening your date range or choosing 'All Categories'</p>
                        </div>
                    }
                />
            </div>
        </motion.div>
    );
};

export default Report;
