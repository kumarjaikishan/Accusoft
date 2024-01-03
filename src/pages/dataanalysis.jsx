import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import './dataanalysis.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const Datanalysis = () => {
    let navigate = useNavigate();
    const log = useSelector((state) => state.login);
    const useralldetail = useSelector((state) => state.userexplist);

    const date = new Date;
    const today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getUTCDate();
    //    console.log(date.getFullYear());
    const [inp, setinp] = useState({
        date: today,
        month: date.getMonth(),
        year: date.getFullYear()
    })

    const [cardarr, setcardarr] = useState({});

    useEffect(() => {
        if (!log.islogin) {
            toast.warn("You Are not Logged In", { autoClose: 1300 });
            return navigate('/login');
        }
        cal();
        // repeat(10000);
    }, [inp])


    let ledgerSum = {};

    const cal = () => {
        // console.time('chatgpt')
        useralldetail.ledgerlist.forEach(element => {
            ledgerSum[element.ledger] = 0;
        })
        ledgerSum["total"] = 0;
        let monthIn2Digit = String(parseInt(inp.month) + 1).padStart(2, '0');
        const startdate = inp.year + "-" + monthIn2Digit + "-01";
        const enddate = inp.year + "-" + monthIn2Digit + "-31";

        useralldetail.explist.forEach(entry => {
            let { ledger, amount, date } = entry;
            ledger = ledger.ledger;  // ledger here in object form that's why
            const amountValue = parseFloat(amount);

            if (!isNaN(amountValue)) {
                if (date >= startdate && date <= enddate) {
                    ledgerSum["total"] += amountValue;
                    if (ledgerSum.hasOwnProperty(ledger)) {
                        ledgerSum[ledger] += amountValue;
                    } else {
                        ledgerSum[ledger] = amountValue;
                    }
                }
            }
        });
        // console.log(ledgerSum);
        setcardarr(ledgerSum)
        // console.timeEnd('chatgpt')
        // return { ledgerSum, totalsum };
    }

    const monname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const handle = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setinp((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }


    return (
        <>
            <div className="datanalysis" >
                <div className="cont">
                    <span>
                        Month :  <select onChange={handle} name="month" value={inp.month} id="">
                            {monname.map((val, ind) => {
                                return <option key={ind} value={ind}>{val}</option>
                            })}
                        </select>
                    </span>
                    <span>
                        Year :  <select onChange={handle} name="year" value={inp.year} id="">
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </span>
                </div>
                <div className="cards">
                    {Object.entries(cardarr).map(([ledger, sum]) => (

                        <div className="card" key={ledger} id={ledger}>
                            <div className="data">
                                <div className="amt" >{sum}</div>
                                <div className="day">{ledger}</div>
                            </div>
                            <div className="icon">
                                <div className="cir" style={{ background: `conic-gradient(#fc5c65 ${isNaN(Math.floor((sum / cardarr["total"]) * 100)) ? 0 : Math.floor((sum / cardarr["total"]) * 100) * 3.6}deg,  #7f8fa6  10.8deg)` }}>
                                    <div className="per"> {isNaN(Math.floor((sum / cardarr["total"]) * 100)) ? 0 : Math.floor((sum / cardarr["total"]) * 100)} %</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Datanalysis;