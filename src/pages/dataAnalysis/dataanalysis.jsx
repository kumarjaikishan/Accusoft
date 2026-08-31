import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setloader } from "../../store/login";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  PieChart as PieIcon, 
  AlertTriangle,
  CheckCircle2,
  MousePointerClick
} from "lucide-react";
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

  // Per-ledger totals for the selected month
  const [ledgerTotals, setLedgerTotals] = useState([]);

  const today = new Date();
  const storedMonth = localStorage.getItem("month");
  const storedYear = localStorage.getItem("year");

  const [inp, setinp] = useState({
    month: storedMonth !== null ? parseInt(storedMonth, 10) : today.getMonth(),
    year: storedYear !== null ? parseInt(storedYear, 10) : today.getFullYear(),
  });

  useEffect(() => {
    dispatch(setloader(false));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("month", inp.month);
    localStorage.setItem("year", inp.year);
  }, [inp.month, inp.year]);

  useEffect(() => {
    dispatch(setloader(loading));
  }, [loading, dispatch]);

  const fmt = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN", { maximumFractionDigits: 2 })
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
  }, [inp.month, inp.year]);

  const nonTotalEntries = useMemo(() => {
    return ledgerTotals.filter((e) => e._id !== "Total");
  }, [ledgerTotals]);

  const totalItem = useMemo(() => {
    return ledgerTotals.find((e) => e._id === "Total");
  }, [ledgerTotals]);

  const overallTotal = useMemo(
    () => totalItem?.totalSum || 0,
    [totalItem]
  );

  const overallBudget = useMemo(() => {
    return nonTotalEntries.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);
  }, [nonTotalEntries]);

  // Merge all entries with Total at the end using the exact same card schema
  const sortedEntries = useMemo(() => {
    const entries = nonTotalEntries.map((e) => [e._id, e]);
    if (totalItem) {
      return [...entries, ["Total", { ...totalItem, ledger: "Total", budget: overallBudget }]];
    }
    return entries;
  }, [nonTotalEntries, totalItem, overallBudget]);

  const handle = (e) => {
    setinp((prev) => ({
      ...prev,
      [e.target.name]: parseInt(e.target.value, 10),
    }));
  };

  const detail = useCallback(
    (ledgerId) => {
      if (ledgerId === "Total") {
        navigate(
          `/data_analysis/ledgerDetail/all?&ledgerName=All Categories&month=${inp.month}&year=${inp.year}`
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
        navigate(
          `/data_analysis/ledgerDetail/all?&ledgerName=All Categories&month=${inp.month}&year=${inp.year}`
        );
      }
    },
    [ledgerTotals, inp.month, inp.year, navigate]
  );

  const monname = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] p-3 sm:p-5 space-y-3.5 transition-colors duration-300 font-sans text-slate-700 dark:text-slate-200"
    >
      {/* ---------- MODERN HERO BAR & CONTROLS ---------- */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Title & Description */}
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
                <PieIcon className="w-4 h-4" />
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Monthly Breakdown
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Spending distribution & budget analytics for{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {monname[inp.month]} {inp.year}
              </span>
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Total Metric Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Total:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">₹ {fmt(overallTotal)}</span>
              {showbudget && overallBudget > 0 && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Budget:</span>
                  <span className="font-bold text-slate-600 dark:text-slate-300">₹ {fmt(overallBudget)}</span>
                </>
              )}
            </div>

            {/* Date Dropdowns */}
            <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <select
                name="month"
                value={inp.month}
                onChange={handle}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none shadow-sm cursor-pointer border border-transparent focus:border-indigo-500"
              >
                {monname.map((m, i) => (
                  <option key={i} value={i} className="text-slate-700 dark:text-slate-200 dark:bg-slate-900">
                    {m}
                  </option>
                ))}
              </select>

              <select
                name="year"
                value={inp.year}
                onChange={handle}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none shadow-sm cursor-pointer border border-transparent focus:border-indigo-500"
              >
                {[2026, 2025, 2024, 2023, 2022].map((y) => (
                  <option key={y} value={y} className="text-slate-700 dark:text-slate-200 dark:bg-slate-900">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Modern Budget Toggle Switch */}
            <button
              onClick={() => setshowbudget(!showbudget)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer border ${
                showbudget
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  showbudget ? "bg-emerald-300 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{showbudget ? "Budget On" : "Budget Off"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------- HELPER HINT ---------- */}
      <div className="flex items-center gap-1.5 px-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
        <MousePointerClick className="w-3.5 h-3.5 text-indigo-500/80" />
        <span>Tap any card below to view detailed breakdown & transactions</span>
      </div>

      {/* ---------- UNIFORM CARDS GRID ---------- */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="relative bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 animate-pulse"
            >
              <div className="space-y-1.5 pr-14">
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-1.5 w-28 bg-slate-100 dark:bg-slate-800/60 rounded-md mt-2" />
              </div>
              <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          ))
        ) : (
          sortedEntries.map(([ledgerId, data]) => {
            const isAllTotal = ledgerId === "Total";
            const total = Number(data.totalSum || 0);
            const budget = Number(data.budget || 0);
            const spendPercentage =
              isAllTotal
                ? 100
                : overallTotal > 0
                ? Math.round((total / overallTotal) * 100)
                : 0;

            const budgetPercent =
              budget > 0 ? Math.round((total / budget) * 100) : 0;
            const remainingBudget = budget - total;
            const isOverBudget = remainingBudget < 0;

            return (
              <motion.div
                key={ledgerId}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                onClick={() => detail(ledgerId)}
                className="group relative overflow-hidden rounded-2xl p-3.5 transition-all duration-150 cursor-pointer border bg-white/95 dark:bg-slate-900/85 hover:bg-white dark:hover:bg-slate-900 border-slate-200/80 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-indigo-500/40 dark:hover:border-indigo-500/40 text-slate-700 dark:text-slate-200"
              >
                {/* Top Section: Title & Prominent Circular Gauge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 pr-1">
                    <h3 className="text-sm sm:text-base font-bold capitalize tracking-tight truncate text-slate-800 dark:text-slate-100">
                      {data.ledger}
                    </h3>
                    <div className="mt-0.5">
                      <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                        ₹ {fmt(total)}
                      </span>
                    </div>
                  </div>

                  {/* Circular Percentage Gauge */}
                  <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#6366f1 ${
                          spendPercentage * 3.6
                        }deg, ${
                          mode === "dark" ? "#1e293b" : "#e2e8f0"
                        } 0deg)`,
                      }}
                    />
                    <div className="absolute inset-1 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 shadow-inner">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {spendPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Budget Health Section (Only when Budget is ON) */}
                {showbudget && (
                  <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                    {budget > 0 ? (
                      <>
                        <div className="flex items-center justify-between text-[10.5px] font-medium">
                          <span className="text-slate-500 dark:text-slate-400 truncate">
                            Budget: ₹{fmt(budget)}
                          </span>
                          <span
                            className={`flex items-center gap-0.5 font-semibold shrink-0 ${
                              isOverBudget
                                ? "text-rose-500 dark:text-rose-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {isOverBudget ? (
                              <>
                                <AlertTriangle className="w-2.5 h-2.5" />
                                ₹{fmt(Math.abs(remainingBudget))} over
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                ₹{fmt(remainingBudget)} left
                              </>
                            )}
                          </span>
                        </div>

                        {/* Linear Progress Bar */}
                        <div className="w-full h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(budgetPercent, 100)}%`,
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isOverBudget
                                ? "bg-rose-500"
                                : budgetPercent > 80
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                        <span>No budget set</span>
                        <span className="text-[9.5px] text-indigo-500 dark:text-indigo-400">
                          Set in Expenses
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default Datanalysis;