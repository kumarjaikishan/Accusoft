import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setloader } from "../../store/login";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useApi } from "../../utils/useApi";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Datanalysis = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.theme?.mode || "light");
  const { request, loading } = useApi();
  const [showbudget, setshowbudget] = useState(true);

  // Per-ledger totals for the selected month, computed by a Mongo
  // aggregation on the server - not by iterating every expense the user has
  // ever logged in the browser.
  const [ledgerTotals, setLedgerTotals] = useState([]);

  const today = new Date();
  const storedMonth = localStorage.getItem("month");
  const storedYear = localStorage.getItem("year");

  const [inp, setinp] = useState({
    month:
      storedMonth !== null
        ? parseInt(storedMonth, 10)
        : today.getMonth(),
    year:
      storedYear !== null
        ? parseInt(storedYear, 10)
        : today.getFullYear(),
  });

  useEffect(() => {
    dispatch(setloader(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("month", inp.month);
    localStorage.setItem("year", inp.year);
  }, [inp.month, inp.year]);

  useEffect(() => {
    dispatch(setloader(loading));
  }, [loading]);

  const fmt = (n) =>
    typeof n === "number"
      ? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : n;

  /* ---------------- FETCH MONTHLY SUMMARY FROM SERVER ---------------- */

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await request({
          url: `ledgersummary?month=${inp.month}&year=${inp.year}`,
          method: "GET",
        });
        if (!cancelled) setLedgerTotals(res?.items || []);
      } catch (error) {
        if (!cancelled) setLedgerTotals([]);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inp.month, inp.year]);

  const sortedEntries = useMemo(() => {
    const nonTotal = ledgerTotals.filter((e) => e._id !== "Total");
    const total = ledgerTotals.find((e) => e._id === "Total");
    const entries = nonTotal.map((e) => [e._id, e]);
    return total ? [...entries, [total._id, total]] : entries;
  }, [ledgerTotals]);

  const overallTotal = useMemo(
    () => ledgerTotals.find((e) => e._id === "Total")?.totalSum || 0,
    [ledgerTotals]
  );

  const handle = (e) => {
    setinp((prev) => ({
      ...prev,
      [e.target.name]: parseInt(e.target.value, 10),
    }));
  };

  const detail = useCallback((ledgerId) => {
    if (ledgerId === "Total") {
      navigate(
        `/data_analysis/ledgerDetail/all?&ledgerName=All Ledger&month=${inp.month}&year=${inp.year}`
      );
      return;
    }

    const ledgerItem = ledgerTotals.find((e) => e._id === ledgerId);
    if (ledgerItem) {
      navigate(
        `/data_analysis/ledgerDetail/${ledgerId}?&ledgerName=${encodeURIComponent(
          ledgerItem.ledger
        )}&month=${inp.month}&year=${inp.year}`
      );
    } else {
      // fallback to all
      navigate(
        `/data_analysis/ledgerDetail/all?&ledgerName=All Ledger&month=${inp.month}&year=${inp.year}`
      );
    }
  }, [ledgerTotals, inp.month, inp.year, navigate]);

  const monname = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-800 p-4 md:p-6 space-y-8"
    >
      {/* ---------- HEADER ---------- */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-lg text-white flex flex-wrap gap-4 items-center justify-between border border-transparent dark:border-white/10">
        <div className="flex gap-3 flex-wrap">
          <select
            name="month"
            value={inp.month}
            onChange={handle}
            className="px-4 py-2 rounded-xl bg-white/20 dark:bg-black/30 backdrop-blur text-white outline-none"
          >
            {monname.map((m, i) => (
              <option key={i} value={i} className="text-black dark:text-gray-200 dark:bg-slate-800">{m}</option>
            ))}
          </select>

          <select
            name="year"
            value={inp.year}
            onChange={handle}
            className="px-4 py-2 rounded-xl bg-white/20 dark:bg-black/30 backdrop-blur text-white outline-none"
          >
            {[2026, 2025, 2024, 2023, 2022].map((y) => (
              <option key={y} value={y} className="text-black dark:text-gray-200 dark:bg-slate-800">{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setshowbudget(!showbudget)}
          className={`px-5 py-2 rounded-full font-medium transition
          ${showbudget
              ? "bg-white text-indigo-600 dark:bg-slate-700 dark:text-cyan-400"
              : "bg-black/20 text-white dark:bg-white/5 dark:text-gray-300"}`}
        >
          {showbudget ? "Budget ON" : "Budget OFF"}
        </button>
      </div>

      {/* ---------- CARDS / SKELETON LOADING ---------- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="relative bg-white dark:bg-slate-900/60 rounded-2xl shadow-lg dark:shadow-none border border-slate-200 dark:border-white/10 p-6 animate-pulse"
            >
              <div className="space-y-3 pr-20">
                <div className="h-7 w-28 bg-slate-200 dark:bg-slate-700/80 rounded-lg"></div>
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700/60 rounded-md"></div>
                <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700/40 rounded-md mt-2"></div>
              </div>
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700/80"></div>
            </div>
          ))
        ) : (
          sortedEntries.map(([ledgerId, data]) => {
            const total = Number(data.totalSum || 0);
            const budget = Number(data.budget || 0);
            const percentage =
              overallTotal > 0
                ? Math.floor((total / overallTotal) * 100)
                : 0;

            const budgetDiff = total - budget;
            const isOverBudget = budgetDiff > 0;

            return (
              <motion.div
                key={ledgerId}
                whileHover={{ y: -6 }}
                onClick={() => detail(ledgerId)}
                className="relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-none border border-transparent dark:hover:border-slate-500 dark:border-white/10 hover:shadow-2xl transition p-6 cursor-pointer"
              >
                {/* Title & Amount */}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    ₹ {fmt(total)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {data.ledger}
                  </p>

                  {showbudget && (
                    <div className="text-xs mt-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Budget: ₹ {fmt(budget)} /
                      </span>
                      <span
                        className={`ml-1 font-semibold ${isOverBudget ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-emerald-400"
                          }`}
                      >
                        {isOverBudget
                          ? `+ ${fmt(Math.abs(budgetDiff))}`
                          : `- ${fmt(Math.abs(budgetDiff))}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Animated Progress Circle */}
                <div className="absolute top-4 right-4 w-20 h-20">
                  <motion.div
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(${isOverBudget ? (mode === "dark" ? "#f87171" : "#ef4444") : (mode === "dark" ? "#818cf8" : "#6366f1")
                        } ${percentage * 3.6}deg, ${mode === "dark" ? "#334155" : "#e5e7eb"} 0deg)`
                    }}
                  />
                  <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-sm font-semibold dark:text-gray-200">
                    {percentage}%
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default Datanalysis;