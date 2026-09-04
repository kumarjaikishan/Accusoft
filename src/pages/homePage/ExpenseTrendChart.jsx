import React, { useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
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

// Register Chart.js elements only when this chunk loads
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

// Plugin for Bar data labels
const barDataLabelsPlugin = {
  id: "barDataLabels",
  afterDatasetsDraw(chart, args, options) {
    const {
      ctx,
      data,
      scales: { x, y },
    } = chart;
    if (!data.datasets?.[0]) return;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const isMobile = window.innerWidth < 640;
    ctx.font = `600 ${isMobile ? "9px" : "10.5px"} sans-serif`;

    const amountFormat = options?.amountFormat || "compact";

    const meta = chart.getDatasetMeta(0);
    meta.data.forEach((bar, index) => {
      const val = data.datasets[0].data[index];
      if (val === undefined || val === null || val <= 0) return;

      let formatted = "";
      if (amountFormat === "full") {
        formatted = `${Math.round(val).toLocaleString("en-IN")}`;
      } else {
        // Compact format: show 1 decimal for thousands (e.g. 11.5k, 17.6k)
        if (val >= 1000) {
          const inK = val / 1000;
          const kFormatted = inK >= 100 ? inK.toFixed(0) : inK.toFixed(1).replace(/\.0$/, '');
          formatted = `${kFormatted}k`;
        } else {
          formatted = `${val}`;
        }
      }

      const { x: barX, y: barY, base } = bar;
      const barHeight = Math.abs(base - barY);
      const textWidth = ctx.measureText(formatted).width;
      const topPadding = isMobile ? 8 : 10;

      if (barHeight > textWidth + topPadding + 10) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.save();
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.translate(barX, barY + topPadding);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(formatted, 0, 0);
        ctx.restore();
      } else {
        ctx.fillStyle = "#64748b";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(formatted, barX, barY - 4);
      }
    });

    ctx.restore();
  },
};

const ExpenseTrendChart = ({ filteredMonths, chartType, mode, isMobileView, amountFormat = "compact" }) => {
  const chartData = useMemo(() => {
    const labels = filteredMonths.map((d) => d.month);
    const values = filteredMonths.map((d) => d.total);

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
        barDataLabels: {
          amountFormat,
        },
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
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          display: true,
          position: "left",
          ticks: {
            color: mode === "dark" ? "#94a3b8" : "#64748b",
            font: { size: isMobileView ? 9 : 10.5, weight: "500" },
            callback: (val) =>
              val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`,
            maxTicksLimit: isMobileView ? 4 : 5,
          },
          grid: {
            color:
              mode === "dark"
                ? "rgba(51, 65, 85, 0.35)"
                : "rgba(226, 232, 240, 0.8)",
            drawBorder: false,
          },
          border: {
            display: false,
            dash: [4, 4],
          },
        },
      },
    }),
    [mode, isMobileView, amountFormat]
  );

  return (
    <div className="h-[210px] sm:h-[270px] lg:h-[300px] w-full pt-1">
      {chartType === "line" && <Line data={chartData} options={chartOptions} />}
      {chartType === "bar" && (
        <Bar data={chartData} options={chartOptions} plugins={[barDataLabelsPlugin]} />
      )}
    </div>
  );
};

export default ExpenseTrendChart;
