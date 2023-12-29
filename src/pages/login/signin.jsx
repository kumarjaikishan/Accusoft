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

    const submit = async () => {
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
            const data = await res.json();
            if (res.ok) {
                dispatch(setlogin(true));
                // console.log(data);
                toast.success("Login Successfully", { autoClose: 1300 });
                setbtnclick(false);
                dispatch(setloader(false));
                localStorage.setItem("token", data.token);
                dispatch(userdata());
                return navigate('/');
            }
            else {
                console.log(data);
                toast.warn("No user found",{autoClose: 1500});
                setbtnclick(false);
                dispatch(setloader(false));
            }

        } catch (error) {
            console.log(error);
            toast.warn("Something Went Wrong",{ autoClose: 1500 });
            setbtnclick(false);
            dispatch(setloader(false));
        }
    }


    return (
        <>

            <div className="logine" id='forme'>
                <TextField
                    label="Email*"
                    size="small"
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
                <TextField
                    label="Password*"
                    className='filled'
                    size="small"
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

                />
                <button disabled={btnclick} style={btnclick ? { background: "#cccccc", color: "#666666" } : { background: "#0984e3", color: "white" }} onClick={submit}>Login</button>

            </div>
        </>
    )
}

export default Signin;