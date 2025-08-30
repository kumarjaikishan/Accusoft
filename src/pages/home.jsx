import React, { useState, useEffect, useMemo } from 'react';
import './home.css';
import { useSelector, useDispatch } from 'react-redux';
import { header, setloader } from '../store/login';
import { motion } from 'framer-motion';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdElectricBolt } from "react-icons/md";
import { FaShoppingBag, FaGoogleWallet, FaBalanceScaleRight } from "react-icons/fa";
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

dayjs.extend(isBetween);

const Home = () => {
  const dispatch = useDispatch();
  const useralldetail = useSelector((state) => state.userexplist);
  const [monthsToShow, setMonthsToShow] = useState(12);

  useEffect(() => {
    dispatch(header("Dashboard"));
    dispatch(setloader(true));
    if (!useralldetail.loading) dispatch(setloader(false));
  }, [useralldetail]);

  useEffect(() => {
    if (window.innerWidth < 600) {
      setMonthsToShow(5)
    }
  }, [window.innerWidth]);

  const { sums, monthlyData } = useMemo(() => {
    if (!useralldetail?.explist) {
      return {
        sums: { todaysum: 0, yestersum: 0, weeksum: 0, monthsum: 0, yearsum: 0 },
        monthlyData: []
      };
    }

    let todaysum = 0, yestersum = 0, weeksum = 0, monthsum = 0, yearsum = 0;
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');

    // Ranges
    const lastWeekStart = yesterday.subtract(6, 'day');
    const lastWeekEnd = yesterday;

    const lastMonthStart = yesterday.subtract(1, 'month').add(1, 'day');
    const lastMonthEnd = yesterday;

    const lastYearStart = yesterday.subtract(1, 'year').add(1, 'day');
    const lastYearEnd = yesterday;

    // Prepare monthly data
    let monthlyTotals = {};
    for (let i = 0; i < 12; i++) {
      const monthKey = today.subtract(i, 'month').format('YYYY-MM');
      monthlyTotals[monthKey] = 0;
    }

    // Track min/max date for daily span
    let minDate = null;
    let maxDate = null;

    // Track distinct months
    const uniqueMonths = new Set();

    useralldetail?.explist.forEach((val) => {
      const date = dayjs(val.date, "YYYY-MM-DD");

      if (date.isSame(today, 'day')) todaysum += val.amount;
      if (date.isSame(yesterday, 'day')) yestersum += val.amount;
      if (date.isBetween(lastWeekStart, lastWeekEnd, 'day', '[]')) weeksum += val.amount;
      if (date.isBetween(lastMonthStart, lastMonthEnd, 'day', '[]')) monthsum += val.amount;
      if (date.isBetween(lastYearStart, lastYearEnd, 'day', '[]')) yearsum += val.amount;

      const monthKey = date.format('YYYY-MM');
      if (monthlyTotals.hasOwnProperty(monthKey)) {
        monthlyTotals[monthKey] += val.amount;
      }

      // Track span for daily avg
      if (!minDate || date.isBefore(minDate)) minDate = date;
      if (!maxDate || date.isAfter(maxDate)) maxDate = date;

      // Track unique months
      uniqueMonths.add(monthKey);
    });

    // ✅ Calculate day span (inclusive)
    let daySpan = 0;
    if (minDate && maxDate) {
      daySpan = maxDate.diff(minDate, 'day') + 1;
    }
    const dayCount = Math.min(daySpan, 30) || 1;

    // ✅ Calculate month span
    const monthCount = Math.min(uniqueMonths.size, 12) || 1;

    const dailyAvg = Math.floor(monthsum / dayCount);
    const monthlyAvg = Math.floor(yearsum / monthCount);

    // console.log(dailyAvg, monthlyAvg)

    // Convert monthlyTotals to array sorted by date
    const monthlyDataArr = Object.entries(monthlyTotals)
      .sort(([a], [b]) => dayjs(a).diff(dayjs(b)))
      .map(([month, total]) => ({
        month: dayjs(month).format('MMM-YY'),
        total
      }));

    // console.log(monthlyDataArr)
    return {
      sums: { todaysum, yestersum, weeksum, monthsum, yearsum, dailyAvg, monthlyAvg },
      monthlyData: monthlyDataArr
    };
  }, [useralldetail?.explist]);

  const card = [
    { amt: sums.todaysum, day: "Today", icon: <FaIndianRupeeSign /> },
    { amt: sums.yestersum, day: "Yesterday", icon: <MdElectricBolt /> },
    { amt: sums.weeksum, day: "Last Week", icon: <FaShoppingBag /> },
    { amt: sums.monthsum, day: "Last Month", avg: sums.dailyAvg, icon: <FaGoogleWallet /> },
    { amt: sums.yearsum, day: "Last Year", avg: sums.monthlyAvg, icon: <FaBalanceScaleRight /> },
  ];

  const filteredMonths = monthlyData.slice(-monthsToShow);
  // Inside component, before return
  const chartData = useMemo(() => {
    return {
      labels: filteredMonths.map(m => m.month),
      datasets: [{
        label: 'Expenses',
        data: filteredMonths.map(m => m.total),
        borderRadius: 5,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // Prevent crash before chartArea is ready
          if (!chartArea) return '#ccc';

          const colors = [
            ['#ff7eb3', '#ff758c'],
            ['#86a8e7', '#91eae4'],
            ['#f7971e', '#ffd200'],
            ['#00c6ff', '#0072ff'],
            ['#43cea2', '#185a9d'],
            ['#f54ea2', '#ff7676'],
            ['#30cfd0', '#330867'],
            ['#667db6', '#0082c8'],
            ['#ff6a00', '#ee0979'],
            ['#56ab2f', '#a8e063'],
            ['#614385', '#516395'],
            ['#ff7eb3', '#0072ff']
          ];

          const index = context.dataIndex % colors.length;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, colors[index][0]);
          gradient.addColorStop(1, colors[index][1]);
          return gradient;
        }
      }]
    };
  }, [filteredMonths]);


  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="home"
    >
      {/* Cards */}
      <div className='cards'>
        {card.map((val, ind) => (
          <div className="card" key={ind}>
            <div className="data">
              <div className="amt">{val.amt}</div>
              <div className="day">{val.day}</div>
              {val?.avg && (
                <div className="avg">
                  {val.day.includes('Month')
                    ? 'Daily'
                    : val.day.includes('Year')
                      ? 'Monthly'
                      : ''} Avg - {val.avg}
                </div>
              )}
            </div>

            <div className="icon" style={{ color: "white" }}>{val.icon}</div>
          </div>
        ))}
      </div>

      <div className='chart'>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <select
            className="custom-select"
            value={monthsToShow}
            onChange={(e) => setMonthsToShow(Number(e.target.value))}
          >
            <option value={5}>Last 5 months</option>
            <option value={12}>Last 12 months</option>
          </select>

        </div>

        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#222' } }, // optional styling
            },
            scales: {
              x: {
                ticks: { color: '#222' }, // optional styling
                grid: { color: 'rgba(255,255,255,0.1)' }
              },
              y: {
                ticks: { color: '#222' },
                grid: { color: 'rgba(255,255,255,0.1)' }
              }
            },
            backgroundColor: 'transparent'
          }}
        />
      </div>
    </motion.div>
  );
};

export default Home;
