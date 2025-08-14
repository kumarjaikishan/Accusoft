import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSVLink } from 'react-csv';
import './report.css';
import { setloader, setnarrow } from '../store/login';
import { MdDownload } from "react-icons/md";
import { IoMdPrint } from "react-icons/io";
import { VscDebugRestart } from "react-icons/vsc";
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';

const Report = () => {
    const dispatch = useDispatch();
    const { user, explist, ledgerlist } = useSelector(state => state.userexplist);

    const [isSearch, setIsSearch] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [inputs, setInputs] = useState({
        from: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        to: dayjs().format('YYYY-MM-DD'),
        ledger: 'all'
    });

    useEffect(() => {
        dispatch(setloader(false));
        handleSearch();
    }, []);

    const header = [
        { label: "Ledger", key: "ledger.ledger" },
        { label: "Amount", key: "amount" },
        { label: "Date", key: "date" },
        { label: "Narration", key: "narration" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setIsSearch(true);
        const { from, to, ledger } = inputs;

        const filtered = explist.filter(item => {
            const itemDate = dayjs(item.date);
            const inRange = itemDate.isBetween(dayjs(from).startOf('day'), dayjs(to).endOf('day'), null, '[]');
            return ledger === 'all' ? inRange : inRange && item.ledger.ledger === ledger;
        });

        setFilteredData(filtered);
    };

    const clearSearch = () => {
        setIsSearch(false);
        setInputs({
            from: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
            to: dayjs().format('YYYY-MM-DD'),
            ledger: 'all'
        });
        setFilteredData([]);
    };

    const handlePrint = () => {
        dispatch(setnarrow(true));
        setTimeout(() => window.print(), 1);
    };

    const formatDate = (date) => dayjs(date).format('DD-MMM-YY');

    useEffect(() => {
        handleSearch();
    }, [inputs]);

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="report"
        >
            <div className="cont">
                <span>
                    <span>
                        From: <input type="date" name="from" value={inputs.from} onChange={handleInputChange} />
                    </span>
                    <span>
                        To: <input type="date" name="to" value={inputs.to} onChange={handleInputChange} />
                    </span>
                    <FormControl className='ledger caps mui' size='small'>
                        <InputLabel>Ledger</InputLabel>
                        <Select name="ledger" label="Ledger" value={inputs.ledger} onChange={handleInputChange}>
                            <MenuItem value="all">All</MenuItem>
                            {ledgerlist.map((val, idx) => (
                                <MenuItem key={idx} value={val.ledger}>{val.ledger}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        className='muibtn'
                        disabled={!isSearch}
                        variant="contained"
                        onClick={clearSearch}
                        startIcon={<VscDebugRestart />}
                    >
                        Clear
                    </Button>
                </span>

                <span>
                    <CSVLink data={filteredData} headers={header} filename={`${user?.name}-Expense-Record`}>
                        <Button className='muibtn' size='small' variant="contained" startIcon={<MdDownload />}>
                            CSV
                        </Button>
                    </CSVLink>
                    <Button className='muibtn' size='small' variant="contained" onClick={handlePrint} startIcon={<IoMdPrint />}>
                        Print
                    </Button>
                </span>
            </div>

            <div className="table" id='printarea'>
                <div className='head'><b>Accusoft - {user?.name}</b> (Report from {formatDate(inputs.from)} to {formatDate(inputs.to)})</div>
                <table id='tavlecontent'>
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Ledger</th>
                            <th>Amount</th>
                            <th>Narration</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr><td colSpan={5}><b>No Record Found</b></td></tr>
                        ) : (
                            filteredData.map((val, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{val.ledger.ledger}</td>
                                    <td>{val.amount}</td>
                                    <td>{val.narration}</td>
                                    <td>{formatDate(val.date)}</td>
                                </tr>
                            ))
                        )}
                        {filteredData.length > 0 && (
                            <tr>
                                <td colSpan={2}><b>Total</b></td>
                                <td>{filteredData.reduce((acc, val) => acc + val.amount, 0)}</td>
                                <td colSpan={2}></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default Report;
