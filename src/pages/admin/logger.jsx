
import dayjs from 'dayjs';
import './logger.css'
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';

const Logger = () => {
    const [logs, setLogs] = useState({});
    const [selectedLogs, setselectedLogs] = useState(null);
    const [whichactive, setwhichactive] = useState(null);

    useEffect(() => {
        let prev = JSON.parse(localStorage.getItem('apiLogs')) || [];
        kya(prev)
    }, [])

    const kya = (data) => {
        let result = {}
        data.forEach(e => {
            result[`${e.endpoint}_${e.method}`] = (result[`${e.endpoint}_${e.method}`] || []).concat(e)
        });
        // console.log(result)
        setLogs(result)
    }
    const handlelogs = (val) => {
        // console.log(val)
        setwhichactive(val)
        setselectedLogs(logs[val])
    }

    return (
        <div className='logs'>
            <div>
                <h2>Api Performance Logs</h2>
                <Button
                    variant='outlined'
                    onClick={() => localStorage.clear('apiLogs')}> Reset</Button>
            </div>

            <div className="body">
                <div className='loghead' >
                    {Object.keys(logs).map((val, ind) => {
                        return <div
                            className={whichactive == val ? 'active' : ''}
                            onClick={() => handlelogs(val)}
                            key={val}>{val}</div>
                    })}
                </div>
                {selectedLogs &&
                    <div className='logdetail'>
                        {selectedLogs?.map((v, i) => {
                            return <div key={i} className='row'>

                                <div>{dayjs(v.date1).format('hh:mm A DD/MM/YY')}</div>
                                <div>{v.time}</div>
                            </div>
                        })}
                    </div>
                }
            </div>
        </div>
    )
}

export default Logger
