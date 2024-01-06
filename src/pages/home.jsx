import React, { useState } from 'react'
import { useEffect } from 'react';
import './home.css';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { header, setloader } from '../store/login';
import {  toast } from 'react-toastify';
import { userdata } from '../store/api'

const calculateLedgerSum = (data) => {
  const log = useSelector((state) => state.login);
  if (!log.islogin) {
    return navigate('/login');
  }
  // console.time('chatgpt home')
  let totalSum = 0;
  let todaySum = 0;
  let yesterdaySum = 0;
  let lastWeekSum = 0;
  let lastMonthSum = 0;
  let lastYearSum = 0;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  // console.log("chatgpt last week",lastWeek);

  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);

  data.forEach(entry => {
    const { ledger, amount, date } = entry;
    const amountValue = parseFloat(amount);
    const entryDate = new Date(date);

    if (!isNaN(amountValue)) {
      totalSum += amountValue;

      if (entryDate.toDateString() === today.toDateString()) {
        todaySum += amountValue;
      }

      if (entryDate.toDateString() === yesterday.toDateString()) {
        yesterdaySum += amountValue;
      }

      if (entryDate >= lastWeek) {
        lastWeekSum += amountValue;
      }

      if (entryDate >= lastMonth) {
        lastMonthSum += amountValue;
      }

      if (entryDate >= lastYear) {
        lastYearSum += amountValue;
      }
    }
  });

  // console.timeEnd('chatgpt home')
  return { totalSum, todaySum, yesterdaySum, lastWeekSum, lastMonthSum, lastYearSum };
};

const Home = () => {
  const dispatch = useDispatch();
 
  const useralldetail = useSelector((state) => state.userexplist);
  useEffect(() => {
    // repeat(1000000);
    dispatch(header("Dashboard"))
    dispatch(setloader(true));
    const fvf= async()=>{
      await dispatch(userdata());
      dispatch(setloader(false));
    }
    fvf();
  }, [])

  const { totalSum, todaySum, yesterdaySum, lastWeekSum, lastMonthSum, lastYearSum } = calculateLedgerSum(useralldetail.explist);

  const card = [{
    amt: todaySum,
    day: "Today",
    icon: <i className="fa fa-inr" aria-hidden="true"></i>,
    back: 'radial-gradient( circle 759px at -6.7% 50%, rgba(80,131,73,1) 0%, rgba(140,209,131,1) 26.2%, rgba(178,231,170,1) 50.6%, rgba(144,213,135,1) 74.1%, rgba(75,118,69,1) 100.3% )'
  }, {
    amt: yesterdaySum,
    day: "Yesterday",
    icon: <i className="fa fa-bolt" aria-hidden="true"></i>,
    back: 'radial-gradient( circle 597px at 93% 9.8%, rgba(255,61,89,1) 1.7%, rgba(252,251,44,1) 97% )'
  }, {
    amt: lastWeekSum,
    day: "Last Week",
    icon: <i className="fa fa-shopping-bag" aria-hidden="true"></i>,
    back: 'linear-gradient( 179.4deg, rgba(33,150,243,1) 1.8%, rgba(22,255,245,0.60) 97.1% )'
  }, {
    amt: lastMonthSum,
    day: "Last Month",
    icon: <i className="fa fa-google-wallet" aria-hidden="true"></i>,
    back: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)'
  }, {
    amt: lastYearSum,
    day: "Last Year",
    icon: <i className="fa fa-balance-scale" aria-hidden="true"></i>,
    back: 'linear-gradient(90deg, #1CB5E0 0%, #000851 100%)'
  }, {
    amt: totalSum,
    day: "Total",
    icon: <i className="fa fa-university" aria-hidden="true"></i>,
    back: 'linear-gradient( 109.6deg, rgba(39,142,255,1) 11.2%, rgba(98,113,255,0.78) 100.2% )'
  }]

  return (
    <>
      <div className="home">

        {card && card.map((val, ind) => {
          return (
            <div className="card" key={ind} style={{ background: val.back, color: "white" }}>
              <div className="data">
                <div className="amt">{val.amt}</div>
                <div className="day">{val.day}</div>
              </div>
              <div className="icon" style={{ color: "white" }}>{val.icon}</div>
            </div>
          )
        })}


      </div>
    </>
  )
}


export default Home