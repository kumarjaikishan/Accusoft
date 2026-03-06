import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { header, setloader } from "../../store/login";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdElectricBolt } from "react-icons/md";
import {
  FaShoppingBag,
  FaGoogleWallet,
  FaBalanceScaleRight,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

/* ✅ REQUIRED REGISTRATION (Fixes your error) */
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Home = () => {
  const dispatch = useDispatch();

  const { explist, loading } = useSelector(
    (state) => state.userexplist,
    shallowEqual
  );

  const [monthsToShow, setMonthsToShow] = useState(12);

  useEffect(() => {
    dispatch(header("Dashboard"));
    dispatch(setloader(true));
    if (!loading) dispatch(setloader(false));

    const stored = localStorage.getItem("ShowChartMonth");
    if (stored) setMonthsToShow(Number(stored));
  }, [loading, dispatch]);

  /* ================= MAIN CALCULATION ================= */
  const { sums, monthlyData } = useMemo(() => {
    if (!explist?.length) return { sums: {}, monthlyData: [] };

    let todaysum = 0,
      yestersum = 0,
      weeksum = 0,
      monthsum = 0,
      yearsum = 0;

    const today = dayjs();
    const yesterday = today.subtract(1, "day");

    let minDate = null;
    let maxDate = null;
    const uniqueMonths = new Set();

    explist.forEach((val) => {
      const date = dayjs(val.date);

      if (date.isSame(today, "day")) todaysum += val.amount;
      if (date.isSame(yesterday, "day")) yestersum += val.amount;
      if (date.isBetween(yesterday.subtract(6, "day"), yesterday, "day", "[]"))
        weeksum += val.amount;
      if (date.isBetween(yesterday.subtract(1, "month"), yesterday, "day", "[]"))
        monthsum += val.amount;
      if (date.isBetween(yesterday.subtract(1, "year"), yesterday, "day", "[]"))
        yearsum += val.amount;

      if (!minDate || date.isBefore(minDate)) minDate = date;
      if (!maxDate || date.isAfter(maxDate)) maxDate = date;

      uniqueMonths.add(date.format("YYYY-MM"));
    });

    const daySpan =
      minDate && maxDate ? maxDate.diff(minDate, "day") + 1 : 1;

    const dailyAvg = Math.floor(monthsum / Math.min(daySpan, 30));
    const monthlyAvg = Math.floor(yearsum / Math.min(uniqueMonths.size, 12));

    const monthlyTotals = {};
    for (let i = 0; i < 12; i++) {
      monthlyTotals[today.subtract(i, "month").format("YYYY-MM")] = 0;
    }

    explist.forEach((val) => {
      const key = dayjs(val.date).format("YYYY-MM");
      if (monthlyTotals[key] !== undefined)
        monthlyTotals[key] += val.amount;
    });

    const monthlyDataArr = Object.entries(monthlyTotals)
      .sort(([a], [b]) => dayjs(a).diff(dayjs(b)))
      .map(([month, total]) => ({
        month: dayjs(month).format("MMM YY"),
        total,
      }));

    return {
      sums: {
        todaysum,
        yestersum,
        weeksum,
        monthsum,
        yearsum,
        dailyAvg,
        monthlyAvg,
      },
      monthlyData: monthlyDataArr,
    };
  }, [explist]);

  const filteredMonths = useMemo(
    () => monthlyData.slice(-monthsToShow),
    [monthlyData, monthsToShow]
  );

  /* ================= CHART ================= */
  const chartData = useMemo(
    () => ({
      labels: filteredMonths.map((m) => m.month),
      datasets: [
        {
          label: "Expenses",
          data: filteredMonths.map((m) => m.total),
          borderRadius: 8,
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "#6366f1";

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, "#6366f1");
            gradient.addColorStop(1, "#06b6d4");
            return gradient;
          },
        },
      ],
    }),
    [filteredMonths]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          labels: { color: "#374151" },
        },
      },
      scales: {
        x: {
          ticks: { color: "#6b7280" },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#6b7280" },
          grid: { color: "#e5e7eb" },
        },
      },
    }),
    []
  );

  /* ================= DUMMY RECENT ================= */
  const recentSpend = useMemo(
    () => [
      { title: "Amazon Purchase dsfdsfd sdfdsf fsdfsdfds sdfsd fsdfsdf", category: "Shopping", amount: 2499 },
      { title: "Electricity Bill", category: "Utilities", amount: 1800 },
      { title: "Swiggy Order", category: "Food", amount: 650 },
      { title: "Netflix", category: "Subscription", amount: 499 },
      { title: "Uber Ride", category: "Travel", amount: 320 },
    ],
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100 p-6"
    >
      {/* CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {[
          {
            amt: sums.todaysum,
            label: "Today",
            icon: <FaIndianRupeeSign />,
            iconBg: "from-indigo-500 to-purple-500",
            border: 'border-indigo-400'
          },
          {
            amt: sums.yestersum,
            label: "Yesterday",
            icon: <MdElectricBolt />,
            iconBg: "from-yellow-400 to-orange-500",
            border: 'border-yellow-400'
          },
          {
            amt: sums.weeksum,
            label: "Last Week",
            icon: <FaShoppingBag />,
            iconBg: "from-pink-500 to-rose-500",
            border: 'border-rose-400',
          },
          {
            amt: sums.monthsum,
            label: "Last Month",
            avg: sums.dailyAvg,
            avgLabel: "Daily Avg",
            icon: <FaGoogleWallet />,
            iconBg: "from-cyan-500 to-blue-500",
            border: 'border-cyan-400',
          },
          {
            amt: sums.yearsum,
            label: "Last Year",
            avg: sums.monthlyAvg,
            avgLabel: "Monthly Avg",
            icon: <FaBalanceScaleRight />,
            iconBg: "from-emerald-500 to-green-600",
            border: 'border-emerald-400'
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl border-l-4 ${item.border} p-5 pb-2 shadow-sm hover:shadow-md transition-all duration-300`}
          >
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h2 className="text-xl font-semibold text-gray-800 mt-1">
                  ₹ {item.amt || 0}
                </h2>
              </div>

              <div
                className={`text-white text-lg p-3 rounded-xl bg-gradient-to-br ${item.iconBg}`}
              >
                {item.icon}
              </div>
            </div>

            {/* Average Badge */}
            {item.avg !== undefined && (
              <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600">
                {item.avgLabel}: ₹ {item.avg}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CHART + RECENT */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">
              Monthly Expense Overview
            </h3>

            <div className="relative inline-block">
              <select
                className="appearance-none bg-white border border-gray-300 
    rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-700
    shadow-sm hover:border-indigo-400
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    transition-all duration-200 cursor-pointer"
                value={monthsToShow}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  localStorage.setItem("ShowChartMonth", val);
                  setMonthsToShow(val);
                }}
              >
                <option value={5}>Last 5 months</option>
                <option value={12}>Last 12 months</option>
              </select>

            </div>
          </div>

          <div className="h-[320px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* RECENT */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FiClock className="text-lg" />
            </div>
            <h3 className="font-semibold text-gray-700">
              Recent Spend
            </h3>
          </div>

          {recentSpend.length > 0 ? (
            <div className="space-y-1">
              {explist.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex  justify-between  gap-2 p-3 rounded-lg hover:bg-gray-200 transition"
                >
                  <div className="min-w-0 flex-1 ">
                    <p className="text-xs font-medium text-gray-800">
                      <span className="mr-2">{dayjs(item.date).format('DD/MM/YY')}</span>
                      <span>• </span>
                      <span className=" capitalize"> {item?.ledger?.ledger}</span>
                    </p>

                    <p className="text-xs font-medium text-gray-500 truncate">
                      {item.narration}
                    </p>

                  </div>

                  <div className="text-sm  w-15 text-end font-semibold text-indigo-600">
                    ₹ {item.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-purple-100">
                <FiClock className="text-2xl text-purple-500" />
              </div>
              <p className="text-sm font-medium">
                No recent transactions
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;