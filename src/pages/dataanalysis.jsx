import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import './dataanalysis.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../store/login';
import { motion } from 'framer-motion';
import { IoSearch } from "react-icons/io5";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Datanalysis = () => {
    const dispatch = useDispatch();
    const useralldetail = useSelector((state) => state.userexplist);
    const navigate = useNavigate();

    const date = new Date();

    // 🔹 Load month/year from localStorage OR fallback to current
    const storedMonth = localStorage.getItem("month");
    const storedYear = localStorage.getItem("year");

    const [inp, setinp] = useState({
        date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getUTCDate(),
        month: storedMonth ? parseInt(storedMonth, 10) : date.getMonth(),
        year: storedYear ? parseInt(storedYear, 10) : date.getFullYear(),
    });

    const [cardarr, setcardarr] = useState({});

    useEffect(() => {
        cal();
        dispatch(setloader(false));

        // 🔹 Save month/year to localStorage whenever it changes
        localStorage.setItem("month", inp.month);
        localStorage.setItem("year", inp.year);
    }, [inp]);

    let ledgerSum = {};

    const cal = () => {
        const newLedgerSum = {};
        useralldetail.ledgerlist.forEach(el => {
            newLedgerSum[el.ledger] = 0;
        });
        newLedgerSum["total"] = 0;

        const monthIn2Digit = String(parseInt(inp.month) + 1).padStart(2, "0");
        const startDate = dayjs(`${inp.year}-${monthIn2Digit}-01`);
        const endDate = startDate.endOf("month");

        useralldetail.explist.forEach(entry => {
            const ledgerName = typeof entry.ledger === "object" ? entry.ledger.ledger : entry.ledger;
            const amountValue = parseFloat(entry.amount);
            const entryDate = dayjs(entry.date);

            if (!isNaN(amountValue) && entryDate.isSameOrAfter(startDate) && entryDate.isSameOrBefore(endDate)) {
                newLedgerSum["total"] += amountValue;
                if (newLedgerSum.hasOwnProperty(ledgerName)) {
                    newLedgerSum[ledgerName] += amountValue;
                } else {
                    newLedgerSum[ledgerName] = amountValue;
                }
            }
        });

        // console.log(newLedgerSum);
        setcardarr({ ...newLedgerSum });
    };



    const monname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const handle = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setinp(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const detail = (ledger) => {
        const ledgerItem = useralldetail?.ledgerlist?.find(e => e.ledger === ledger);
        const ledgerId = ledgerItem?._id;
        if (ledgerId) {
            navigate(`/datanalysis/ledgerDetail/${ledgerId}?&ledgerName=${ledgerItem.ledger}&month=${inp.month}&year=${inp.year}`);
        } else {
            navigate(`/datanalysis/ledgerDetail/all?&ledgerName=All Ledger&month=${inp.month}&year=${inp.year}`);

        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: '100%' }}  // Initial state
                animate={{ opacity: 1, x: 0 }}  // Animation state
                exit={{ opacity: 0, x: '-100%' }}  // Exit animation
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="datanalysis" >
                <div className="cont">
                    <span>
                        <FormControl size='small' className=' select caps' >
                            <InputLabel id="demo-simple-select-label">Month</InputLabel>
                            <Select
                                name="month"
                                labelId="demo-simple-select-label"
                                onChange={handle}
                                value={inp.month}
                                id="demo-simple-select"
                                label="Month"
                            >
                                {monname.map((val, ind) => {
                                    return <MenuItem sx={{ textTransform: "capitalize" }} key={ind} value={ind}>{val}</MenuItem>
                                })}

                            </Select>
                        </FormControl>
                    </span>
                    <span>
                        <FormControl size='small' className='select caps' >
                            <InputLabel id="demo-simple-select-label">Year</InputLabel>
                            <Select
                                name="year"
                                labelId="demo-simple-select-label"
                                onChange={handle}
                                value={inp.year}
                                id="demo-simple-select"
                                label="Year"
                            >
                                <MenuItem value="2021">2021</MenuItem>
                                <MenuItem value="2022">2022</MenuItem>
                                <MenuItem value="2023">2023</MenuItem>
                                <MenuItem value="2024">2024</MenuItem>
                                <MenuItem value="2025">2025</MenuItem>
                            </Select>
                        </FormControl>
                    </span>
                </div>
                <div className="cards">
                    {Object.entries(cardarr).map(([ledger, sum]) => (
                        <div onClick={() => detail(ledger)} className="card" key={ledger} id={ledger}>
                            <div className="data">
                                <div className="amt" >{sum}</div>
                                <div className="day">{ledger}</div>
                            </div>
                            <div className="icon">
                                <div className="cir" style={{ background: `conic-gradient(#034972 ${isNaN(Math.floor((sum / cardarr["total"]) * 100)) ? 0 : Math.floor((sum / cardarr["total"]) * 100) * 3.6}deg,  #afbbcb  10.8deg)` }}>
                                    <div className="per"> {isNaN(Math.floor((sum / cardarr["total"]) * 100)) ? 0 : Math.floor((sum / cardarr["total"]) * 100)} %</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    )
}

export default Datanalysis;
