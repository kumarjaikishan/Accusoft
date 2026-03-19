import React, { useEffect, useState } from 'react'
import { Mail, Eye, EyeOff, Key, LogIn } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { setloader, setlogin } from '../../store/login';
import { useSelector, useDispatch } from 'react-redux';
import { userdata } from '../../store/api'
import { toast } from 'react-toastify';
import { useApi } from '../../utils/useApi';
import { useForm } from '../../utils/useForm';

const Signin = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const init = {
        email: "",
        password: ""
    }
    useEffect(() => {
        dispatch(setloader(false));
    }, [])

    const { fields, handlechange } = useForm(init)
    const { request, loading } = useApi();
    const [loginpass, setloginpass] = useState(true);
    const [btnclick, setbtnclick] = useState(false);

    useEffect(() => {
        dispatch(setloader(loading));
    }, [loading])

    const submit = async (e) => {
        e.preventDefault();
        setbtnclick(true);
        const { email, password } = fields;

        if (!email || !password) {
            toast.warn("All fields are Required", { autoClose: 1100 });
            setbtnclick(false);
            return;
        }
        try {
            const res = await request({
                url: 'login',
                method: 'POST',
                body: { email, password },
            });
            // console.log(res)

            if (res?.message == 'Email sent, check your inbox') {
                setbtnclick(false);
                toast.warn("Kindly Verify Email First", { autoClose: 3300 });

                return swal({
                    title: 'Kindly Verify Email First',
                    text: 'Please verify your email first to proceed. Check your spam/junk folder if you don’t see the email.',
                    icon: 'warning',
                })
            }

            toast.success(res.message, { autoClose: 1300 });
            setbtnclick(false);
            localStorage.setItem("token", res.token);
            dispatch(userdata());
            navigate('/dashboard');
            dispatch(setlogin(true));

        } catch (error) {
            setbtnclick(false);
        }
    }

    const [forget, setforget] = useState(false);

    const emailset = async () => {
        const email = fields.email;
        // console.log(email);
        if (email == "") {
            return toast.warn("Email can't be empty", { autoClose: 2100 })
        }
        try {
            setbtnclick(true)
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}checkmail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })
            const data = await res.json();
            console.log(data);
            setbtnclick(false)

            if (!res.ok) {
                return toast.warn(data.message, { autoClose: 2100 });
            }
            setforget(false);
            toast.success(data.message, { autoClose: 2100 })
        } catch (error) {
            toast.warn(error.message, { autoClose: 2100 });
            setbtnclick(false)
            console.log(error);
        }
    }

    return (
        <>
            <div className="w-full h-full" id='forme'>
                <form onSubmit={submit} className="w-full h-full relative flex flex-col justify-around items-center gap-4 py-4">
                    <TextField
                        label="Email"
                        required
                        type='email'
                        size='small'
                        className='!w-[80%] max-sm:!w-[93%] !text-[rgb(43,38,38)]'
                        onChange={handlechange}
                        name="email"
                        value={fields.email}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Mail style={{ color: "var(--maincolor)" }} />
                            </InputAdornment>,

                        }}
                    />
                    {!forget && <TextField
                        label="Password"
                        className='!w-[80%] max-sm:!w-[93%] !text-[rgb(43,38,38)]'
                        required
                        size='small'
                        type={loginpass ? "password" : null}
                        onChange={handlechange}
                        name="password"
                        value={fields.password}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Key style={{ color: "var(--maincolor)" }} />
                            </InputAdornment>,
                            endAdornment: <InputAdornment position="end" style={{ cursor: "pointer", color: "var(--maincolor)" }} onClick={() => loginpass ? setloginpass(false) : setloginpass(true)}>
                                {loginpass ? <Eye /> : <EyeOff />}
                            </InputAdornment>
                        }}

                    />}
                    {!forget && <div className='forget'>
                        <span style={{ cursor: 'pointer' }} onClick={() => setforget(true)}>Forgot Password?</span>
                    </div>}

                    {forget && <div className='forget'>
                        <span style={{ cursor: 'pointer' }} onClick={() => setforget(false)}>SignIn?</span>
                    </div>}

                    {!forget && <button 
                        type="submit" 
                        disabled={btnclick} 
                        className="border-none outline-none cursor-pointer text-[1.2em] font-semibold tracking-[1px] px-[16px] py-[8px] transition-[0.1s] text-center rounded-[15px] hover:opacity-90 max-sm:mb-4 flex gap-2 items-center justify-center font-sans shadow-sm" 
                        style={btnclick ? { background: "#cccccc", color: "#666666" } : { background: "var(--maincolor)", color: "white" }}
                    >
                        <LogIn /> {btnclick ? "Loading..." : "Login"}
                    </button>}
                    {forget && <button 
                        type="button" 
                        disabled={btnclick} 
                        onClick={emailset} 
                        className="border-none outline-none cursor-pointer text-[1.2em] font-semibold tracking-[1px] px-[16px] py-[8px] transition-[0.1s] text-center rounded-[15px] hover:opacity-90 max-sm:mb-4 flex gap-2 items-center justify-center font-sans shadow-sm" 
                        style={btnclick ? { background: "#cccccc", color: "#666666" } : { background: "var(--maincolor)", color: "white" }}
                    >
                        <Key /> {btnclick ? "Sending..." : "Email sent"}
                    </button>}

                </form>
            </div>
        </>
    )
}

export default Signin;