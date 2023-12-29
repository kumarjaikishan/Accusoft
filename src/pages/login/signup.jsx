import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Person4Icon from '@mui/icons-material/Person4';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useSelector, useDispatch } from 'react-redux';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { toast } from 'react-toastify';

const Signup = ({setlog}) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const init = {
        name: "",
        email: "",
        phone: "",
        password: "",
        cpassword: "",
        ledger: ["general", "other"]
    }
    const [btnclick, setbtnclick] = useState(false);
    const [signinp, setsigninp] = useState(init);
    const [signuppass, setsignuppass] = useState(true);
    const signhandle = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setsigninp({
            ...signinp, [name]: value
        })
    }

    const submit = async (event) => {
        // console.log(signinp);
        setbtnclick(true);
        const today = new Date;
        const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getUTCDate();
        const { name, email, phone, password, cpassword } = signinp;
        if (!name || !email || !phone || !password ) {
            toast.warn("All Fields are Required", { autoClose: 1300 })
            setbtnclick(false);
            return;
        }
        if (password != cpassword) {
            toast.warn("Password does not match", { autoClose: 1300 })
            setbtnclick(false);
            return;
        }
        if (phone.length < 10) {
            toast.warn("Mobile Should be 10 Digits", { autoClose: 1300 })
            setbtnclick(false);
            return;
        }

        try {
            const res = await fetch(`${useralldetail.apiadress}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, phone, password, date
                })
            })
            const datae = await res.json();
            console.log(datae);
            if (res.ok) {
                // setsigninp(init);
                toast.success("Signup Successful", { autoClose: 1300 })
                setbtnclick(false);
                // setlog(true)
            } else {
                setbtnclick(false);
                toast.warn("else wala went wrong", { autoClose: 1300 })
            }

            // console.log(datae);
        } catch (error) {
            setbtnclick(false);
            toast.warn("Something went wrong catch", { autoClose: 1600 })
            console.log(error);
        }

    }

    return (
        <>
            <div className="singup">
                <TextField
                    label="Name*"
                    size="small"
                    className='filled'
                    onChange={signhandle}
                    name="name"
                    value={signinp.name}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <Person4Icon />
                        </InputAdornment>,
                    }}
                />
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
                    label="Phone*"
                    size="small"
                    color={signinp.phone.length == 10 ? "primary" : "warning"}
                    className='filled'
                    onChange={signhandle}
                    name="phone"
                    onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                    value={signinp.phone}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <LocalPhoneIcon />
                        </InputAdornment>,
                    }}
                />
                <TextField
                    label="Password*"
                    className='filled'
                    size="small"
                    onChange={signhandle}
                    name="password"
                    type={signuppass ? "password" : null}
                    value={signinp.password}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <VpnKeyIcon />
                        </InputAdornment>,
                        endAdornment: <InputAdornment position="end" style={{ cursor: "pointer" }} onClick={() => signuppass ? setsignuppass(false) : setsignuppass(true)}>
                            {signuppass ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                        </InputAdornment>
                    }}
                />
                <TextField
                    label="Confirm Password*"
                    className='filled'
                    color={signinp.password == signinp.cpassword ? "primary" : "warning"}
                    size="small"
                    onChange={signhandle}
                    name="cpassword"
                    value={signinp.cpassword}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <VpnKeyIcon />
                        </InputAdornment>,
                    }}
                />
                <button disabled={btnclick} style={btnclick ? { background: "#cccccc", color: "#666666" } : { background: "#0984e3", color: "white" }} onClick={() => submit()}>Signup</button>
            </div>
        </>
    )
}

export default Signup