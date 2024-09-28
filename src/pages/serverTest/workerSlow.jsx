import React from 'react'
import './slow.css';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { IoMdSend } from "react-icons/io";
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
            <div className="slow">
            <h2>Slowdown the Server but handle by Worker Threads</h2>
                <form onSubmit={submit}>
                    <TextField
                        label="Delay (In MilliSecond)"
                        required
                        type='tel'
                        className='filled'
                        onChange={handle}
                        name="delay"
                        value={delay}
                    />
                     <LoadingButton
                        loading={disable}
                        type='submit'
                        startIcon={<IoMdSend />}
                        loadingPosition="start"
                        variant="contained"
                    >
                        Submit
                    </LoadingButton>
                </form>
            </div>
        </>
    )
}

export default SlowWorkerPage;