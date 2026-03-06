import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CSVLink } from "react-csv";
import { setnarrow } from "../store/login";
import { MdDownload } from "react-icons/md";
import { IoMdPrint } from "react-icons/io";
import { VscDebugRestart } from "react-icons/vsc";
import { motion } from "framer-motion";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";

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
        { name: "Ledger", selector: (row) => row.ledger.ledger, width: "140px" },
        {
            name: "Amount",
            selector: (row) => `₹ ${row.amount}`,
            sortable: true,
            width: "120px"
        },
        {
            name: "Narration",
            selector: (row) => row.narration,
            grow: 2, // 👈 takes remaining space
            wrap: true, // allows multiline
        },

        {
            name: "Date",
            selector: (row) => formatDate(row.date),
            width: "120px"
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 space-y-8"
        >
            {/* ---------------- FILTER BAR ---------------- */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex flex-col text-sm">
                        <label className="text-gray-500 mb-1">From</label>
                        <input
                            type="date"
                            name="from"
                            value={inputs.from}
                            onChange={handleInputChange}
                            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <div className="flex flex-col text-sm">
                        <label className="text-gray-500 mb-1">To</label>
                        <input
                            type="date"
                            name="to"
                            value={inputs.to}
                            onChange={handleInputChange}
                            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>

                    <div className="flex flex-col text-sm">
                        <label className="text-gray-500 mb-1">Ledger</label>
                        <select
                            name="ledger"
                            value={inputs.ledger}
                            onChange={handleInputChange}
                            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
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
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-sm"
                    >
                        <VscDebugRestart /> Clear
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
                            <MdDownload /> CSV
                        </button>
                    </CSVLink>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm"
                    >
                        <IoMdPrint /> Print
                    </button>
                </div>
            </div>

            {/* ---------------- TOTAL CARD ---------------- */}
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    //   pagination
                    highlightOnHover
                    striped
                    noDataComponent={
                        <div className="py-6 text-gray-500">
                            No Record Found
                        </div>
                    }
                />
            </div>
        </motion.div>
    );
};

export default Report;