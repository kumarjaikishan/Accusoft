import { useEffect, useState } from 'react';
import './ledgerDetail.css';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import { MdAddBox } from 'react-icons/md';

const VoucherDetail = () => {
    const [exp, setexp] = useState([]);
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate =  useNavigate()

    const ledgerName = searchParams.get("ledgerName");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const { explist } = useSelector((state) => state.userexplist);

    useEffect(() => {
        if (explist) {

            const filtered = explist.filter(e => {
                const d = dayjs(e.date); // parse expense date
                return (
                    e.ledger._id === id
                    && d.month() === Number(month)
                    && d.year() === Number(year)
                );
            });
            setexp(filtered);
        }
    }, [explist, id, month, year]);
    const formatDate = (date) => dayjs(date).format('DD-MMM-YY');

    return (
        <>
            <div className='ledgerdetail'>
                <div className='header'>
                    <div>
                        <span className='title'>Ledger:</span> {ledgerName}
                        <span className='title'>Month:</span> {dayjs(month).format('MMMM')}
                        <span className='title'>Year:</span> {dayjs(year).format('YYYY')}
                    </div>
                    <Button size='small' onClick={() => navigate('/datanalysis')}  variant="contained">Return</Button>

                </div>
                <div className="table" id='printarea'>
                    <div className='head'>{ledgerName}</div>
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
                            {exp.length === 0 ? (
                                <tr><td colSpan={5}><b>No Record Found</b></td></tr>
                            ) : (
                                exp.map((val, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{val.ledger.ledger}</td>
                                        <td>{val.amount}</td>
                                        <td>{val.narration}</td>
                                        <td>{formatDate(val.date)}</td>
                                    </tr>
                                ))
                            )}
                            {exp.length > 0 && (
                                <tr>
                                    <td colSpan={2}><b>Total</b></td>
                                    <td>{exp.reduce((acc, val) => acc + val.amount, 0)}</td>
                                    <td colSpan={2}></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default VoucherDetail;