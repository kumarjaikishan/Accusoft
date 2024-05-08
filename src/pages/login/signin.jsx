import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { setloader, setlogin } from '../../store/login';
import { useSelector, useDispatch } from 'react-redux';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
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
        console.log("api :", useralldetail.apiadress);
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
            dispatch(setloader(true));
            const res = await fetch(`${useralldetail.apiadress}/login`, {
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
            if (res.ok && res.status == 200) {
                dispatch(setlogin(true));
                // console.log(data);
                toast.success(data.message, { autoClose: 1300 });
                setbtnclick(false);
                dispatch(setloader(true));
                localStorage.setItem("token", data.token);
                dispatch(userdata());
                return navigate('/');

            } else if (res.ok && res.status == 201) {
                dispatch(setloader(false));
                setbtnclick(false);
                toast.warn("Kindly Verify Email First", { autoClose: 3300 });
            } else {
                console.log(data);
                toast.warn(data.message ? data.message : "Error Occured", { autoClose: 1500 });
                setbtnclick(false);
                dispatch(setloader(false));
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
            const res = await fetch(`${useralldetail.apiadress}/checkmail`, {
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
                        className='filled'
                        onChange={signhandle}
                        name="email"
                        value={signinp.email}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <MailOutlineIcon />
                            </InputAdornment>,

                        }}
                    />
                  {!forget &&  <TextField
                        label="Password"
                        className='filled'
                        required
                        type={loginpass ? "password" : null}
                        onChange={signhandle}
                        name="password"
                        value={signinp.password}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <VpnKeyIcon />
                            </InputAdornment>,
                            endAdornment: <InputAdornment position="end" style={{ cursor: "pointer" }} onClick={() => loginpass ? setloginpass(false) : setloginpass(true)}>
                                {loginpass ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                            </InputAdornment>
                        }}

                    />}
                      {!forget && <div className='forget'>
                        <span style={{cursor:'pointer'}} onClick={() => setforget(true)}>Forget Password?</span>
                    </div>}

                    {forget && <div className='forget'>
                        <span style={{cursor:'pointer'}} onClick={() => setforget(false)}>SignIn?</span>
                    </div>}
                    
                    {!forget && <LoadingButton
                        loading={btnclick}
                        type='submit'
                        startIcon={<VpnKeyIcon />}
                        loadingPosition="start"
                        variant="contained"
                    >
                        Login
                    </LoadingButton>}
                    {forget && <LoadingButton
                        loading={btnclick}
                        onClick={emailset}
                        startIcon={<VpnKeyIcon />}
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