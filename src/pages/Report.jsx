import React, { useState } from 'react'
import { useEffect } from 'react';
import './report.css';
import { Navigate } from "react-router-dom";
import { CSVLink } from 'react-csv';
import { useSelector, useDispatch } from 'react-redux';
import { setloader, setnarrow } from '../store/login';
import { toast } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import Button from '@mui/material/Button';

const Report = () => {
    const dispatch = useDispatch();
    const useralldetail = useSelector((state) => state.userexplist);
    useEffect(() => {
        dispatch(setloader(false));
        // console.log(useralldetail.user.name);
    }, [])

    const header = [
        { label: "ledger", key: "ledger.ledger" },
        { label: "amount", key: "amount" },
        { label: "date", key: "date" },
        { label: "narration", key: "narration" }
    ]
    const username = useralldetail.user.name;
    const [issearch, setissearch] = useState(false);
    const [pious, setpious] = useState([]);
    const date = new Date;

    const lastday = () => {
        const date = new Date();
        return new Date(date.setDate(date.getDate() - 1));
    }

    var monthIn2Digit = String(date.getMonth() + 1).padStart(2, '0');
    var dateIn2Digit = String(date.getDate()).padStart(2, '0');

    const today = date.getFullYear() + "-" + monthIn2Digit + "-" + dateIn2Digit;
    const prevMonth = (lastday().getFullYear() + "-" + String(lastday().getMonth()).padStart(2, '0') + "-" + String(lastday().getDate()).padStart(2, '0'));
    const [inp, setinp] = useState({
        from: prevMonth,
        to: today,
        ledger: "all"
    });

    const handler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setinp((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }

    // for handling search
    const search = () => {
        setissearch(true);
        let searchitem;
        if (inp.ledger == "all") {
            searchitem = useralldetail.explist.filter((val, ind) => {
                if (val.date >= inp.from && val.date <= inp.to) {
                    return val;
                }
            })
        } else {
            searchitem = useralldetail.explist.filter((val, ind) => {
                if (val.date >= inp.from && val.date <= inp.to && val.ledger.ledger == inp.ledger) {
                    return val;
                }
            })
        }
        setpious(searchitem);
    }
    const clearsearch = () => {
        setissearch(false);
        setinp({
            from: prevMonth,
            to: today,
            ledger: "all"
        })
    }
    const print = () => {
        dispatch(setnarrow(false))
        setTimeout(() => {
            window.print()
        }, 1);
    }
    const formatDate = (date) => {
        let daten = new Date(date);

        var dateIn2Digit2 = String(daten.getDate()).padStart(2, '0');
        let formatted = dateIn2Digit2 + "-" + daten.toLocaleString('default', { month: 'short' }) + "-" + daten.getFullYear().toString().substr(-2);
        return formatted;
    }

    useEffect(() => {
        search();
        // console.log(yesterday);
    }, [inp])

    return (
        <>
            <div className="report">
                {/* {useralldetail.explist.length > 25 ? <span className='scrol'>
                    <span id="bottom"><a href="#foot"><i title='Go to Bottom' className="fa fa-arrow-down" aria-hidden="true"></i></a></span>
                    <span id="top"><a href="#tavlecontent"><i title='Go to Top' className="fa fa-arrow-up" aria-hidden="true"></i></a></span>
                </span> : null} */}

                <div className="cont">
                    <span>
                        <span>
                            From: <input value={inp.from} onChange={handler} type="date" name="from" id="" />
                        </span>
                        <span>
                            To: <input value={inp.to} onChange={handler} type="date" name="to" id="" />
                        </span>
                        <span>
                            Select Ledger : <select value={inp.ledger} onChange={handler} name="ledger" id="">
                                <option value="all">All</option>
                                {useralldetail.ledgerlist.map((val, ind) => {
                                    return <option key={ind} value={val.ledger}>{val.ledger}</option>
                                })}
                            </select>
                        </span>

                        {issearch ? <button onClick={clearsearch}>Clear</button> : null}
                    </span>
                    <span>
                        <CSVLink data={pious} headers={header} filename={`${username}-Expense Record`}>
                            {/* <button title='Download'>Download csv</button> */}
                            <Button title='Download' size='small' variant="contained" startIcon={<DownloadIcon />}>
                                Csv
                            </Button>
                        </CSVLink>
                        <Button title='print' size='small' variant="contained" onClick={print} startIcon={<PrintIcon />}>
                            Print
                        </Button>
                    </span>
                </div>
                <div className="table" >
                    <h2>Accusoft - {useralldetail.user.name} from {formatDate(inp.from)} to {formatDate(inp.to)} </h2>
                    <table id='tavlecontent'>
                        <thead id='table'>
                            <tr>
                                <th>S.no</th>
                                <th>Ledger</th>
                                <th>Amount</th>
                                <th>Narration</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pious?.map((val, ind) => {
                                let daten = new Date(val.date);

                                var dateIn2Digit2 = String(daten.getDate()).padStart(2, '0');
                                let fde = dateIn2Digit2 + " " + daten.toLocaleString('default', { month: 'short' }) + ", " + daten.getFullYear().toString().substr(-2);
                                return (
                                    <tr key={ind}>
                                        <td>{ind + 1}</td>
                                        <td>{val.ledger.ledger}</td>
                                        <td>{val.amount}</td>
                                        <td>{val.narration}</td>
                                        <td>{fde}</td>
                                    </tr>
                                )
                            })}
                            <tr id='foot'>
                                <td colSpan={2}>Total</td>
                                <td colSpan={1} >
                                    {pious?.reduce((accu, val) => {
                                        return accu = accu + val.amount
                                    }, 0)}
                                </td>
                                <td colSpan={2} ></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Report;