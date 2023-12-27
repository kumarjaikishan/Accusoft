import React, { useState } from 'react'
import { useEffect } from 'react';
import './home.css';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { header, setloader } from '../store/login';
import { toast } from 'react-toastify';

const Home = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const log = useSelector((state) => state.login);
  const useralldetail = useSelector((state) => state.userexplist);
  useEffect(() => {
    if (!log.islogin) {
      // toast.warn("You Are not Logged In", { autoClose: 1300 });
      return navigate('/login');
    }
    dispatch(setloader(true));
    dispatch(header("Dashboard"))
  }, [])
  useEffect(() => {

    useralldetail.explist && load();
    useralldetail.explist &&  dispatch(setloader(false));;
    // repeat(100000)
  }, [useralldetail])

  // const tempobject = {
  //   "userid": "63aa962f68dc4f69b0f23e5e",
  //   "ledger": "ration",
  //   "date": "2023-12-22",
  //   "amount": "784",
  //   "narration": "Rajma-64, Badam-30 & Shampoo-20"
  // }
  // const tempdata = [
  //   {
  //     "userid": "63aa962f68dc4f69b0f23e5e",
  //     "ledger": "ration",
  //     "date": "2022-08-02",
  //     "amount": "114",
  //     "narration": "Rajma-64, Badam-30 & Shampoo-20"
  //   },
  //   {
  //     "userid": "63aa962f68dc4f69b0f23e5e",
  //     "ledger": "ration",
  //     "date": "2022-08-05",
  //     "amount": "84",
  //     "narration": "Rajma-64, Badam-30 & Shampoo-20"
  //   },
  //   {
  //     "userid": "63aa962f68dc4f69b0f23e5e",
  //     "ledger": "ration",
  //     "date": "2022-09-02",
  //     "amount": "784",
  //     "narration": "Rajma-64, Badam-30 & Shampoo-20"
  //   }
  // ]
  // const repeat = (number)=>{
  //   for (let i = 0; i < number; i++) {
  //     tempdata.push(tempobject)
  //   }
  //   console.log("ab call hua hai",tempdata.length);
  //   // console.log(tempdata);
  //   load(tempdata)
  //   // console.log("array length check",tempdata.length);
  // }

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
  let totalsum = 0;

  const load = () => {
    // console.time('mine home')
    // console.log(log.explist[0]);
    // data.map((val, ind) => {
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

      totalsum = totalsum + val.amount
    })
    setarr({
      todaysum: todaysum,
      yestersum: yestersum,
      weeksum: weeksum,
      monthsum: monthsum,
      yearsum: yearsum,
      totalsum: totalsum
    })
    // console.log(totalsum);
    // dispatch(setloader(false));
    // console.timeEnd('mine home')
  }
  const card = [{
    amt: arr.todaysum,
    day: "Today",
    icon: <i className="fa fa-inr" aria-hidden="true"></i>,
    back: 'radial-gradient( circle 759px at -6.7% 50%, rgba(80,131,73,1) 0%, rgba(140,209,131,1) 26.2%, rgba(178,231,170,1) 50.6%, rgba(144,213,135,1) 74.1%, rgba(75,118,69,1) 100.3% )'
  }, {
    amt: arr.yestersum,
    day: "Yesterday",
    icon: <i className="fa fa-bolt" aria-hidden="true"></i>,
    back: 'radial-gradient( circle 597px at 93% 9.8%, rgba(255,61,89,1) 1.7%, rgba(252,251,44,1) 97% )'
  }, {
    amt: arr.weeksum,
    day: "Last Week",
    icon: <i className="fa fa-shopping-bag" aria-hidden="true"></i>,
    back: 'linear-gradient( 179.4deg, rgba(33,150,243,1) 1.8%, rgba(22,255,245,0.60) 97.1% )'
  }, {
    amt: arr.monthsum,
    day: "Last Month",
    icon: <i className="fa fa-google-wallet" aria-hidden="true"></i>,
    back: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)'
  }, {
    amt: arr.yearsum,
    day: "Last Year",
    icon: <i className="fa fa-balance-scale" aria-hidden="true"></i>,
    back: 'linear-gradient(90deg, #1CB5E0 0%, #000851 100%)'
  }, {
    amt: arr.totalsum,
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