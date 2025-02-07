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

const Datanalysis = () => {
    const dispatch = useDispatch();
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
        cal();
        dispatch(setloader(false))
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

                        <div className="card" key={ledger} id={ledger}>
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
