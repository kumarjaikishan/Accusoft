
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
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
        <div className='w-full h-full text-center text-gray-800 dark:text-gray-200 p-4'>
            <div className="py-4">
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Api Performance Logs</h2>
                <Button
                    variant='outlined'
                    onClick={() => localStorage.clear('apiLogs')}> Reset</Button>
            </div>

            <div className="flex gap-[20px] p-[10px] max-sm:flex-col">
                <div className='rounded-[5px] w-[200px] text-left max-sm:w-full max-sm:flex max-sm:flex-wrap max-sm:gap-2' >
                    {Object.keys(logs).map((val, ind) => {
                        return <div
                            className={`border border-gray-200 dark:border-white/10 mb-[10px] p-[5px] rounded-[5px] cursor-pointer transition ${whichactive == val ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            onClick={() => handlelogs(val)}
                            key={val}>{val}</div>
                    })}
                </div>
                {selectedLogs &&
                    <div className='flex-1 p-3 rounded-xl border border-gray-200 dark:border-white/10 text-left overflow-x-auto bg-white dark:bg-slate-900 shadow-sm dark:shadow-none'>
                        {selectedLogs?.map((v, i) => {
                            return <div key={i} className='flex gap-[20px] mb-2 p-2 rounded-lg border border-gray-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800 max-sm:text-sm shadow-sm'>

                                <div className="min-w-[150px] font-semibold">{dayjs(v.date1).format('hh:mm A DD/MM/YY')}</div>
                                <div className="flex-1">{v.time}</div>
                            </div>
                        })}
                    </div>
                }
            </div>
        </div>
    )
}

export default Logger
