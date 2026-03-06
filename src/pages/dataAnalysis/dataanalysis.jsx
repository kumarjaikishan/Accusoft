import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setloader } from "../../store/login";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Datanalysis = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const useralldetail = useSelector((state) => state.userexplist || {});
  const [showbudget, setshowbudget] = useState(true);

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

  const fmt = (n) =>
    typeof n === "number"
      ? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : n;

  /* ---------------- CALCULATION ---------------- */

  const cardarr = useMemo(() => {
    const newLedgerSum = {};
    let allLedgerSum = 0;
    let allLedgerBudgetSum = 0;

    const ledgerlist = useralldetail?.ledgerlist || [];

    ledgerlist.forEach((led) => {
      const budgetNum = Number(led.budget || 0);
      allLedgerBudgetSum += budgetNum;
      newLedgerSum[led._id] = {
        ledger: led.ledger,
        budget: budgetNum,
        totalSum: 0,
      };
    });

    const monthIn2Digit = String(inp.month + 1).padStart(2, "0");
    const startDate = dayjs(`${inp.year}-${monthIn2Digit}-01`);
    const endDate = startDate.endOf("month");

    const explist = useralldetail?.explist || [];

    explist.forEach((entry) => {
      const ledgerId =
        typeof entry?.ledger === "object"
          ? entry.ledger._id
          : entry?.ledger;

      const amountValue = Number(entry.amount);
      const entryDate = dayjs(entry.date);

      if (
        ledgerId &&
        entryDate.isValid() &&
        entryDate.isSameOrAfter(startDate) &&
        entryDate.isSameOrBefore(endDate) &&
        newLedgerSum[ledgerId]
      ) {
        allLedgerSum += amountValue;
        newLedgerSum[ledgerId].totalSum += amountValue;
      }
    });

    newLedgerSum["Total"] = {
      ledger: "Total",
      budget: allLedgerBudgetSum,
      totalSum: allLedgerSum,
    };

    return newLedgerSum;
  }, [useralldetail, inp.month, inp.year]);

  const sortedEntries = useMemo(() => {
    const entries = Object.entries(cardarr || {});
    const nonTotal = entries.filter(([id]) => id !== "Total");
    const total = entries.find(([id]) => id === "Total");
    return total ? [...nonTotal, total] : nonTotal;
  }, [cardarr]);

  const overallTotal = cardarr?.["Total"]?.totalSum || 0;

  const handle = (e) => {
    setinp((prev) => ({
      ...prev,
      [e.target.name]: parseInt(e.target.value, 10),
    }));
  };

  const detail = (ledgerId) => {
    if (ledgerId === "Total") {
      navigate(
        `/data_analysis/ledgerDetail/all?&ledgerName=All Ledger&month=${inp.month}&year=${inp.year}`
      );
      return;
    }

    // find ledger in ledgerlist by _id
    const ledgerItem = (useralldetail?.ledgerlist || []).find((e) => e._id === ledgerId);
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
  };

  const monname = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 md:p-6 space-y-8"
    >
      {/* ---------- HEADER ---------- */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-6 rounded-2xl shadow-lg text-white flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <select
            name="month"
            value={inp.month}
            onChange={handle}
            className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur text-white outline-none"
          >
            {monname.map((m, i) => (
              <option key={i} value={i} className="text-black">{m}</option>
            ))}
          </select>

          <select
            name="year"
            value={inp.year}
            onChange={handle}
            className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur text-white outline-none"
          >
            {[2026, 2025, 2024, 2023, 2022].map((y) => (
              <option key={y} value={y} className="text-black">{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setshowbudget(!showbudget)}
          className={`px-5 py-2 rounded-full font-medium transition
          ${showbudget
              ? "bg-white text-indigo-600"
              : "bg-black/20 text-white"}`}
        >
          {showbudget ? "Budget ON" : "Budget OFF"}
        </button>
      </div>

      {/* ---------- CARDS ---------- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedEntries.map(([ledgerId, data]) => {
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
              className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition p-6 cursor-pointer"
            >
              {/* Title & Amount */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-800">
                  ₹ {fmt(total)}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {data.ledger}
                </p>

                {showbudget && (
                  <div className="text-xs mt-2">
                    <span className="text-gray-500">
                      Budget: ₹ {fmt(budget)} /
                    </span>
                    <span
                      className={`ml-1 font-semibold ${isOverBudget ? "text-red-500" : "text-green-600"
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
                    background: `conic-gradient(${isOverBudget ? "#ef4444" : "#6366f1"
                      } ${percentage * 3.6}deg, #e5e7eb 0deg)`
                  }}
                />
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {percentage}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Datanalysis;