import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IoMailOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdKey } from "react-icons/md";
import { MdLogin } from "react-icons/md";
import { setloader, setlogin } from '../../store/login';
import { useSelector, useDispatch } from 'react-redux';
import { userdata } from '../../store/api'
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';

const Signin = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const useralldetail = useSelector((state) => state.userexplist);
    const init = {
        email: "",
        password: ""
    }
    useEffect(() => {
        dispatch(setloader(false));
    }, [])


    const [signinp, setsigninp] = useState(init);
    const [loginpass, setloginpass] = useState(true);
    const [btnclick, setbtnclick] = useState(false);

    const signhandle = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setsigninp({
            ...signinp, [name]: value
        })
    }

    const submit = async (e) => {
        e.preventDefault();
        setbtnclick(true);
        const { email, password } = signinp;

        if (!email || !password) {
            toast.warn("All fields are Required", { autoClose: 1100 });
            setbtnclick(false);
            return;
        }
        try {
            // dispatch(setloader(true));
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            })
            // console.log(res);
            const data = await res.json();
            dispatch(setloader(false));
            if (res.ok && res.status == 200) {
                // console.log(data);
                toast.success(data.message, { autoClose: 1300 });
                setbtnclick(false);
                dispatch(setloader(true));
                localStorage.setItem("token", data.token);
                dispatch(userdata());
                return navigate('/');

            } else if (res.ok && res.status == 201) {
                setbtnclick(false);
                toast.warn("Kindly Verify Email First", { autoClose: 3300 });
            } else {
                console.log(data);
                toast.warn(data.message ? data.message : "Error Occured", { autoClose: 1500 });
                setbtnclick(false);
            }

        } catch (error) {
            console.log(error);
            toast.warn(error.message, { autoClose: 1500 });
            setbtnclick(false);
            dispatch(setloader(false));
        }
    }
    const [forget, setforget] = useState(false);
    const emailset = async () => {
        const email = signinp.email;
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
            <div className="logine" id='forme'>
                <form onSubmit={submit}>
                    <TextField
                        label="Email"
                        required
                        type='email'
                        size='small'
                        className='filled'
                        onChange={signhandle}
                        name="email"
                        value={signinp.email}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <IoMailOutline />
                            </InputAdornment>,

                        }}
                    />
                    {!forget && <TextField
                        label="Password"
                        className='filled'
                        required
                         size='small'
                        type={loginpass ? "password" : null}
                        onChange={signhandle}
                        name="password"
                        value={signinp.password}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <MdKey />
                            </InputAdornment>,
                            endAdornment: <InputAdornment position="end" style={{ cursor: "pointer" }} onClick={() => loginpass ? setloginpass(false) : setloginpass(true)}>
                                {loginpass ? <IoEyeOutline /> : <IoEyeOffOutline />}
                            </InputAdornment>
                        }}

                    />}
                    {!forget && <div className='forget'>
                        <span style={{ cursor: 'pointer' }} onClick={() => setforget(true)}>Forget Password?</span>
                    </div>}

                    {forget && <div className='forget'>
                        <span style={{ cursor: 'pointer' }} onClick={() => setforget(false)}>SignIn?</span>
                    </div>}

                    {!forget && <LoadingButton
                        loading={btnclick}
                        type='submit'
                        size='small'
                        startIcon={<MdLogin />}
                        loadingPosition="start"
                        variant="contained"
                    >
                        Login
                    </LoadingButton>}
                    {forget && <LoadingButton
                        loading={btnclick}
                        onClick={emailset}
                        startIcon={<MdKey />}
                        loadingPosition="start"
                        variant="contained"
                    >
                        Email sent
                    </LoadingButton>}

                </form>
            </div>
        </>
    )
}

export default Signin;