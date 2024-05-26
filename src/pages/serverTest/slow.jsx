import React from 'react'
import './slow.css';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';

const SlowPage = () => {
    const useralldetail = useSelector((state) => state.userexplist);
    const [delay, setdelay] = useState(0);
    const [disable,setdisable]= useState(false);
    const handle = (e) => {
        setdelay(e.target.value)
    }
    const submit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            setdisable(true)
            const res = await fetch(`${useralldetail.apiadress}/stillslow`, {
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

                <h2>Slowdown the whole Server</h2>
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
                        startIcon={<SendIcon />}
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

export default SlowPage;