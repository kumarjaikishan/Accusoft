import React, { useState, useEffect, useMemo } from "react";
import {
  IndianRupee,
  Zap,
  ShoppingBag,
  Wallet,
  Scale,
  Clock,
  CalendarDays,
  ChartColumnBig,
} from "lucide-react";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { header, setloader } from "../../store/login";
import { motion } from "framer-motion";
import { Bar, Line, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

/* ✅ REQUIRED REGISTRATION (Fixes your error) */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const Home = () => {
  const dispatch = useDispatch();

  const { explist, loading } = useSelector(
    (state) => state.userexplist,
    shallowEqual
  );

  const mode = useSelector((state) => state.theme.mode);

  const [monthsToShow, setMonthsToShow] = useState(12);
  const [chartType, setChartType] = useState("bar");
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    dispatch(header("Dashboard"));
    dispatch(setloader(true));
    if (!loading) dispatch(setloader(false));

    const stored = localStorage.getItem("ShowChartMonth");
    if (stored) setMonthsToShow(Number(stored));
    const chartStored = localStorage.getItem("ShowChartType");
    if (chartStored && ["bar", "line", "doughnut"].includes(chartStored)) {
      setChartType(chartStored);
    }
  }, [loading, dispatch]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const monthOptions = [
    { value: 3, label: "Last 3 months" },
    { value: 6, label: "Last 6 months" },
    { value: 12, label: "Last 12 months" },
  ];

  const chartTypeOptions = [
    { value: "bar", label: "Bar Chart" },
    { value: "line", label: "Line Chart" },
    { value: "doughnut", label: "Doughnut Chart" },
  ];

  /* ================= CHART ================= */
  const chartData = useMemo(
    () => {
      const labels = filteredMonths.map((m) => m.month);
      const values = filteredMonths.map((m) => m.total);
      const palette = ["#6366f1", "#22c55e", "#f59e0b", "#06b6d4", "#ef4444", "#8b5cf6", "#14b8a6", "#f97316"];

      if (chartType === "line") {
        return {
          labels,
          datasets: [
            {
              label: "Expenses",
              data: values,
              borderColor: "#4f46e5",
              backgroundColor: "rgba(79, 70, 229, 0.16)",
              tension: 0.35,
              fill: true,
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ],
        };
      }

      if (chartType === "doughnut") {
        return {
          labels,
          datasets: [
            {
              label: "Expenses",
              data: values,
              borderWidth: 2,
              borderColor: mode === "dark" ? "#0f172a" : "#ffffff",
              backgroundColor: labels.map((_, i) => palette[i % palette.length]),
              hoverOffset: 6,
            },
          ],
        };
      }

      return {
        labels,
        datasets: [
          {
            label: "Expenses",
            data: values,
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
      };
    },
    [filteredMonths, chartType, mode]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: chartType === "doughnut" ? "62%" : undefined,
      layout: {
        padding: {
          left: isMobileView ? 8 : 0,
          right: isMobileView ? 4 : 0,
        },
      },
      animation: {
        duration: 600,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          position: chartType === "doughnut" ? "bottom" : "top",
          labels: { color: mode === "dark" ? "#e5e7eb" : "#374151" },
        },
      },
      scales: {
        x: {
          display: chartType !== "doughnut",
          ticks: {
            color: mode === "dark" ? "#9ca3af" : "#6b7280",
            font: { size: isMobileView ? 10 : 12 },
          },
          grid: { display: false },
        },
        y: {
          display: chartType !== "doughnut",
          ticks: {
            display: !isMobileView,
            color: mode === "dark" ? "#9ca3af" : "#6b7280",
            font: { size: isMobileView ? 10 : 12 },
            padding: isMobileView ? 4 : 8,
            maxTicksLimit: isMobileView ? 5 : 8,
          },
          grid: { color: mode === "dark" ? "#374151" : "#e5e7eb" },
        },
      },
    }),
    [mode, isMobileView, chartType]
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
      className="min-h-screen bg-transparent p-2 lg:p-4 lg:p-6"
    >
      {/* CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {[
          {
            amt: sums.todaysum,
            label: "Today",
            icon: <IndianRupee />,
            iconBg: "from-indigo-500 to-purple-500",
            border: 'border-indigo-400'
          },
          {
            amt: sums.yestersum,
            label: "Yesterday",
            icon: <Zap />,
            iconBg: "from-yellow-400 to-orange-500",
            border: 'border-yellow-400'
          },
          {
            amt: sums.weeksum,
            label: "Last Week",
            icon: <ShoppingBag />,
            iconBg: "from-pink-500 to-rose-500",
            border: 'border-rose-400',
          },
          {
            amt: sums.monthsum,
            label: "Last Month",
            avg: sums.dailyAvg,
            avgLabel: "Daily Avg",
            icon: <Wallet />,
            iconBg: "from-cyan-500 to-blue-500",
            border: 'border-cyan-400',
          },
          {
            amt: sums.yearsum,
            label: "Last Year",
            avg: sums.monthlyAvg,
            avgLabel: "Monthly Avg",
            icon: <Scale />,
            iconBg: "from-emerald-500 to-green-600",
            border: 'border-emerald-400'
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-slate-900 rounded-xl border-l-4 ${item.border} p-5 pb-2 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] dark:shadow-none dark:border-white/5 hover:shadow-lg dark:hover:bg-slate-800 transition-all duration-300`}
          >
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-1">
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
              <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                {item.avgLabel}: ₹ {item.avg}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CHART + RECENT */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 shadow-[0_4px_20px_0_rgba(0,0,0,0.2)] dark:shadow-none border border-slate-200 dark:border-white/5 rounded-xl p-3 sm:p-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h3 className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-200">
              Monthly Expense Overview
            </h3>

            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-[170px]">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-300" />
                <select
                  className="w-full appearance-none rounded-xl border border-slate-300/90 dark:border-white/10 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-100 shadow-sm transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={monthsToShow}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    localStorage.setItem("ShowChartMonth", val);
                    setMonthsToShow(val);
                  }}
                >
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-[170px]">
                <ChartColumnBig className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-300" />
                <select
                  className="w-full appearance-none rounded-xl border border-slate-300/90 dark:border-white/10 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-100 shadow-sm transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={chartType}
                  onChange={(e) => {
                    const val = e.target.value;
                    localStorage.setItem("ShowChartType", val);
                    setChartType(val);
                  }}
                >
                  {chartTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="h-[240px] sm:h-[320px] w-full">
            {chartType === "line" && <Line data={chartData} options={chartOptions} />}
            {chartType === "bar" && <Bar data={chartData} options={chartOptions} />}
            {chartType === "doughnut" && <Doughnut data={chartData} options={chartOptions} />}
          </div>
        </div>

        {/* RECENT */}
        <div className="bg-white dark:bg-slate-900 shadow-[0_4px_20px_0_rgba(0,0,0,0.2)] dark:shadow-none border border-slate-200 dark:border-white/5 rounded-xl p-3 sm:p-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <Clock className="text-lg" />
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Recent Spend
            </h3>
          </div>

          {recentSpend.length > 0 ? (
            <div className="space-y-1">
              {explist.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start gap-2 p-2.5 sm:p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-medium text-gray-800 dark:text-gray-200 flex flex-wrap items-center gap-1">
                      <span className="mr-2">{dayjs(item.date).format('DD/MM/YY')}</span>
                      <span>• </span>
                      <span className=" capitalize"> {item?.ledger?.ledger}</span>
                    </p>

                    <p className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                      {item.narration}
                    </p>

                  </div>

                  <div className="text-xs sm:text-sm min-w-[78px] sm:min-w-[90px] text-end font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                    ₹ {item.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
              <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Clock className="text-2xl text-purple-500 dark:text-purple-400" />
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
