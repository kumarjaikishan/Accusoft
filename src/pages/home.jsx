import React, { useState } from 'react'
import { useEffect } from 'react';
import './home.css';
import { useSelector, useDispatch } from 'react-redux';
import { header, setloader } from '../store/login';
import { motion } from 'framer-motion';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdElectricBolt } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { FaGoogleWallet } from "react-icons/fa";
import { FaBalanceScaleRight } from "react-icons/fa";
import { FaUniversity } from "react-icons/fa";
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const Home = () => {
  const dispatch = useDispatch();
  const useralldetail = useSelector((state) => state.userexplist);
  useEffect(() => {
    dispatch(header("Dashboard"))
    dispatch(setloader(true));
    useralldetail.explist && load();
    !useralldetail.loading && dispatch(setloader(false));

  }, [useralldetail])


  const a = new Date();

  const lastday = () => {
    const date = new Date();
    return new Date(date.setDate(date.getDate() - 1));
  }
  const endOfWeek = () => {
    const date = new Date();
    var lastday = date.getDate() - (date.getDay() - 1) - 6;
    // console.log("mine last week",new Date(date.setDate(lastday)) );
    return new Date(date.setDate(lastday));
  }
  const endOfMonth = () => {
    const date = new Date();
    return new Date(date.setMonth(date.getMonth() - 1));
  }
  const endOfyear = () => {
    const date = new Date();
    return new Date(date.setYear(date.getFullYear() - 1));
  }

  const today = (a.getFullYear() + "-" + String(a.getMonth() + 1).padStart(2, '0') + "-" + String(a.getDate()).padStart(2, '0'));
  const yesterday = (lastday().getFullYear() + "-" + String(lastday().getMonth() + 1).padStart(2, '0') + "-" + String(lastday().getDate()).padStart(2, '0'));
  const lastweek = (endOfWeek().getFullYear() + "-" + String(endOfWeek().getMonth() + 1).padStart(2, '0') + "-" + String(endOfWeek().getDate()).padStart(2, '0'));
  const lastmonth = (endOfMonth().getFullYear() + "-" + String(endOfMonth().getMonth() + 1).padStart(2, '0') + "-" + String(endOfMonth().getDate()).padStart(2, '0'));
  const lastyear = ((endOfyear().getFullYear()) + "-" + String(endOfyear().getMonth() + 1).padStart(2, '0') + "-" + String(endOfyear().getDate()).padStart(2, '0'));

  const [arr, setarr] = useState([]);
  let todaysum = 0;
  let yestersum = 0;
  let weeksum = 0;
  let monthsum = 0;
  let yearsum = 0;
  // let totalsum = 0;

  const load = () => {
    // console.log(useralldetail.explist);
    useralldetail.explist.map((val, ind) => {
      if (val.date == today) {
        todaysum = todaysum + val.amount
      }
      if (val.date == yesterday) {
        yestersum = yestersum + val.amount
      }
      if (val.date >= lastweek && val.date <= today) {
        weeksum = weeksum + val.amount
      }
      if (val.date >= lastmonth && val.date <= today) {
        monthsum = monthsum + val.amount
      }
      if (val.date >= lastyear && val.date <= today) {
        yearsum = yearsum + val.amount
      }

      // totalsum = totalsum + val.amount
    })
    setarr({
      todaysum: todaysum,
      yestersum: yestersum,
      weeksum: weeksum,
      monthsum: monthsum,
      yearsum: yearsum,
      // totalsum: totalsum
    })
    // console.log(totalsum);
    // dispatch(setloader(false));
    // console.timeEnd('mine home')
  }
  const card = [{
    amt: arr.todaysum,
    day: "Today",
    icon: <FaIndianRupeeSign />,
  }, {
    amt: arr.yestersum,
    day: "Yesterday",
    icon: <MdElectricBolt />,
  }, {
    amt: arr.weeksum,
    day: "Last Week",
    icon: <FaShoppingBag />,
  }, {
    amt: arr.monthsum,
    day: "Last Month",
    icon: <FaGoogleWallet />,
  }, {
    amt: arr.yearsum,
    day: "Last Year",
    icon: <FaBalanceScaleRight />,
  },
    //  {
    //   amt: arr.totalsum,
    //   day: "Total",
    //   icon:<FaUniversity/> ,
    // }
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: '100%' }}  // Initial state
        animate={{ opacity: 1, x: 0 }}  // Animation state
        exit={{ opacity: 0, x: '-100%' }}  // Exit animation
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="home">

        <div className='cards'>
          {card && card.map((val, ind) => {
            return (
              <div className="card" key={ind} >
                <div className="data">
                  <div className="amt">{val.amt}</div>
                  <div className="day">{val.day}</div>
                </div>
                <div className="icon" style={{ color: "white" }}>{val.icon}</div>
              </div>
            )
          })}
        </div>


        <div className='chart'>
          <Bar
            data={{
              labels: ['a', 'b'],
              datasets: [{
                label: 'Expenses',
                data: [200, 500]
              }]
            }}
          />
        </div>

      </motion.div>
    </>
  )
}

export default Home