import React, { useState, useEffect, useMemo } from "react";
import {
  IndianRupee,
  ShoppingBag,
  Wallet,
  Scale,
  Clock,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { header, setloader } from "../../store/login";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
import { useApi } from "../../utils/useApi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

/* ✅ REQUIRED REGISTRATION */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

/* ✅ CUSTOM PLUGIN FOR IN-BAR DATA LABELS */
const barDataLabelsPlugin = {
  id: "barDataLabels",
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart;
    if (chart.config.type !== "bar") return;

    ctx.save();
    const meta = chart.getDatasetMeta(0);
    meta.data.forEach((bar, index) => {
      const value = data.datasets[0].data[index];
      if (!value || typeof value !== "number") return;

      const { x, y, base, width } = bar;
      const barHeight = base - y;

      if (barHeight < 24 || width < 12) return;

      ctx.save();
      ctx.translate(x, y + (barHeight > 45 ? 12 : barHeight / 2));
      ctx.rotate(-Math.PI / 2);

      const fontSize = width < 20 ? "9px" : "11px";
      ctx.font = `700 ${fontSize} Inter, sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.textAlign = barHeight > 45 ? "right" : "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 3;

      ctx.fillText(value.toLocaleString("en-IN"), 0, 0);
      ctx.restore();
    });
    ctx.restore();
  },
};

const Home = () => {
  const dispatch = useDispatch();
  const { request, loading: apiLoading } = useApi();

  const mode = useSelector((state) => state.theme?.mode || "light");

  const [sums, setSums] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [recent, setRecent] = useState([]);

  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const [monthsToShow, setMonthsToShow] = useState(() => {
    const stored = localStorage.getItem("ShowChartMonth");
    if (stored) return Number(stored);
    return typeof window !== "undefined" && window.innerWidth < 768 ? 6 : 12;
  });

  const [chartType, setChartType] = useState(() => {
    const chartStored = localStorage.getItem("ShowChartType");
    return chartStored && ["bar", "line"].includes(chartStored) ? chartStored : "bar";
  });

  useEffect(() => {
    dispatch(header("Dashboard"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setloader(apiLoading));
  }, [apiLoading, dispatch]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await request({ url: "homesummary", method: "GET" });
        if (cancelled) return;
        setSums(res?.sums || {});
        setMonthlyData(res?.monthlyData || []);
        setRecent(res?.recent || []);
      } catch (error) {
        // Handled by useApi
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMob = window.innerWidth < 768;
      setIsMobileView(isMob);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredMonths = useMemo(
    () => monthlyData.slice(-monthsToShow),
    [monthlyData, monthsToShow]
  );

  /* ================= CHART CONFIGURATION ================= */
  const chartData = useMemo(() => {
    const labels = filteredMonths.map((m) => {
      if (isMobileView && m.month) {
        const parts = m.month.split(" ");
        return parts[0];
      }
      return m.month;
    });

    const values = filteredMonths.map((m) => m.total);

    if (chartType === "line") {
      return {
        labels,
        datasets: [
          {
            label: "Monthly Expenses",
            data: values,
            borderColor: "#6366f1",
            borderWidth: isMobileView ? 2.5 : 3,
            backgroundColor: (context) => {
              const { chart } = context;
              const { ctx, chartArea } = chart;
              if (!chartArea) return "rgba(99, 102, 241, 0.15)";

              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, "rgba(99, 102, 241, 0.35)");
              gradient.addColorStop(0.7, "rgba(6, 182, 212, 0.1)");
              gradient.addColorStop(1, "rgba(6, 182, 212, 0.0)");
              return gradient;
            },
            tension: 0.35,
            fill: true,
            pointBackgroundColor: "#6366f1",
            pointBorderColor: mode === "dark" ? "#0f172a" : "#ffffff",
            pointBorderWidth: 2,
            pointRadius: isMobileView ? 3 : 4,
            pointHoverRadius: 6,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: "Monthly Expenses",
          data: values,
          borderRadius: {
            topLeft: isMobileView ? 6 : 8,
            topRight: isMobileView ? 6 : 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: "bottom",
          maxBarThickness: isMobileView ? 32 : 48,
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "#6366f1";

            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, "#6366f1");
            gradient.addColorStop(1, "#06b6d4");
            return gradient;
          },
        },
      ],
    };
  }, [filteredMonths, chartType, mode, isMobileView]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 14,
          bottom: 0,
          left: isMobileView ? 2 : 0,
          right: isMobileView ? 2 : 0,
        },
      },
      animation: {
        duration: 450,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.95)" : "rgba(30, 41, 59, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#38bdf8",
          padding: 8,
          cornerRadius: 8,
          callbacks: {
            label: (context) => ` ₹ ${context.parsed.y?.toLocaleString("en-IN")}`,
          },
        },
      },
      scales: {
        x: {
          display: true,
          ticks: {
            color: mode === "dark" ? "#94a3b8" : "#64748b",
            font: { size: isMobileView ? 9.5 : 11, weight: "600" },
            maxRotation: 0,
            autoSkip: true,
            autoSkipPadding: 4,
          },
          grid: { display: false },
        },
        y: {
          display: true,
          ticks: {
            display: !isMobileView,
            color: mode === "dark" ? "#94a3b8" : "#64748b",
            font: { size: 10.5, weight: "500" },
            padding: 6,
            maxTicksLimit: 5,
            callback: (val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`,
          },
          grid: { 
            color: mode === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
            drawBorder: false,
          },
        },
      },
    }),
    [mode, isMobileView]
  );

  const fmt = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : n || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-transparent p-2.5 sm:p-4 lg:p-6"
    >
      {/* 1-per-row on small mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[
          {
            amt: sums.todaysum,
            label: "Today",
            subtitle: "Current day spend",
            icon: <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />,
            iconBg: "from-indigo-500 to-purple-500",
            border: 'border-indigo-400'
          },
          {
            amt: sums.weeksum,
            label: "Last Week",
            subtitle: "Past 7 days spend",
            icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />,
            iconBg: "from-yellow-400 to-orange-500",
            border: 'border-yellow-400'
          },
          {
            amt: sums.monthsum,
            label: "Last Month",
            avg: sums.dailyAvg,
            avgLabel: "Daily Avg",
            icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />,
            iconBg: "from-cyan-500 to-blue-500",
            border: 'border-cyan-400',
          },
          {
            amt: sums.yearsum,
            label: "Last Year",
            avg: sums.monthlyAvg,
            avgLabel: "Monthly Avg",
            icon: <Scale className="w-4 h-4 sm:w-5 sm:h-5" />,
            iconBg: "from-emerald-500 to-green-600",
            border: 'border-emerald-400'
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-slate-900 rounded-2xl border-l-4 ${item.border} px-3 py-2 sm:p-4 shadow-sm dark:shadow-none dark:border-white/5 hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
          >
            {/* Top Section */}
            <div className="flex justify-between items-center sm:items-start">
              <div className="min-w-0 pr-1">
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{item.label}</p>
                <h2 className="text-base sm:text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                  ₹ {fmt(item.amt)}
                </h2>
              </div>

              <div
                className={`text-white p-1.5 sm:p-2.5 rounded-xl bg-gradient-to-br ${item.iconBg} shadow-sm shrink-0`}
              >
                {item.icon}
              </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="mt-1.5 sm:mt-3 pt-1 sm:pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {item.avg !== undefined ? (
                <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span className="text-slate-400 dark:text-slate-500 font-medium truncate">{item.avgLabel}:</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                    ₹ {fmt(item.avg)}
                  </span>
                </div>
              ) : (
                <div className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 truncate font-medium">
                  {item.subtitle}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CHART + RECENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* RESPONSIVE CHART CARD */}
        <div className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 lg:col-span-2 flex flex-col justify-between">
          {/* Header & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                Monthly Expense Trend
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Spending overview & pattern
              </p>
            </div>

            {/* Responsive Controls */}
            <div className="flex items-center gap-1.5">
              {/* Month Presets */}
              <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                {[
                  { value: 3, label: "3M" },
                  { value: 6, label: "6M" },
                  { value: 12, label: "12M" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      localStorage.setItem("ShowChartMonth", opt.value);
                      setMonthsToShow(opt.value);
                    }}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold transition cursor-pointer text-[10px] sm:text-xs ${
                      monthsToShow === opt.value
                        ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Chart Type Toggle */}
              <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("ShowChartType", "bar");
                    setChartType("bar");
                  }}
                  className={`p-1 sm:px-2 sm:py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 text-[10px] sm:text-xs ${
                    chartType === "bar"
                      ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                  }`}
                  title="Bar Chart"
                >
                  <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Bar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("ShowChartType", "line");
                    setChartType("line");
                  }}
                  className={`p-1 sm:px-2 sm:py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 text-[10px] sm:text-xs ${
                    chartType === "line"
                      ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                  }`}
                  title="Line Chart"
                >
                  <LineChartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Line</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chart Responsive Canvas Container */}
          <div className="h-[210px] sm:h-[270px] lg:h-[300px] w-full pt-1">
            {chartType === "line" && <Line data={chartData} options={chartOptions} />}
            {chartType === "bar" && <Bar data={chartData} options={chartOptions} plugins={[barDataLabelsPlugin]} />}
          </div>
        </div>

        {/* RECENT SPEND FEED */}
        <div className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
              Recent Spend
            </h3>
          </div>

          {recent.length > 0 ? (
            <div className="space-y-1.5">
              {recent.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start gap-2 p-2 sm:p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 flex flex-wrap items-center gap-1">
                      <span className="text-slate-500 dark:text-slate-400">{dayjs(item.date).format('DD/MM/YY')}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="capitalize font-bold text-slate-800 dark:text-slate-100">{item?.ledger?.ledger}</span>
                    </p>

                    <p className="text-[10.5px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.narration || "No narration"}
                    </p>
                  </div>

                  <div className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 font-mono shrink-0">
                    ₹ {fmt(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
              <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40">
                <Clock className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-xs font-semibold">
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
