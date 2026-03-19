import React from 'react'
import { Send } from 'lucide-react';

import { useState } from 'react';
import TextField from '@mui/material/TextField';

import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';

const SlowWorkerPage = () => {
    const useralldetail = useSelector((state) => state.userexplist);
    const [delay, setdelay] = useState(0)
    const handle = (e) => {
        setdelay(e.target.value)
    }
    const [disable,setdisable]= useState(false);
    const submit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            setdisable(true)
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}slow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    delay
                })
            })
            // console.log(res);
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                toast.success(data.message, { autoClose: 1300 });
            } else {
                toast.warn(data.message ? data.message : "Error Occured", { autoClose: 1500 });
            }
            setdisable(false)
        } catch (error) {
            setdisable(false)
            console.log(error);
            toast.warn(error.message, { autoClose: 1500 });
        }
    }
    return (
        <>
            <div className="w-full h-[calc(100vh-var(--navheight))] gap-[1.2rem] flex justify-center items-center flex-col">
            <h2>Slowdown the Server but handle by Worker Threads</h2>
                <form className="w-[200px] h-[100px] gap-[1.2rem] flex flex-col" onSubmit={submit}>
                    <TextField
                        label="Delay (In MilliSecond)"
                        required
                        type='tel'
                        className='filled'
                        onChange={handle}
                        name="delay"
                        value={delay}
                    />
                     <button
                        type="submit"
                        disabled={disable}
                        className="w-full bg-[var(--maincolor)] hover:bg-[var(--maincolor)]/90 text-white font-bold py-2 px-4 rounded transition-opacity disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-wide shadow-md"
                    >
                        {disable ? "Submitting..." : <><Send /> Submit</>}
                    </button>
                </form>
            </div>
        </>
    )
}

export default SlowWorkerPage;