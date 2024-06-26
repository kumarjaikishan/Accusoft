import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Person4Icon from '@mui/icons-material/Person4';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { setloader, setlogin } from '../../store/login';
import { useSelector, useDispatch } from 'react-redux';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { toast } from 'react-toastify';

const Signup = ({ setlog }) => {
    const dispatch = useDispatch();
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

    const submit = async (e) => {
        e.preventDefault();
        // console.log(signinp);
        setbtnclick(true);

        const { name, email, phone, password, cpassword } = signinp;
        if (!name || !email || !phone || !password) {
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
            dispatch(setloader(true));
            const res = await fetch(`${useralldetail.apiadress}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, phone, password
                })
            })
            const datae = await res.json();
            // console.log(datae);
            if (res.ok) {
                // setsigninp(init);
                toast.success("Signup Successful,verify your Email", { autoClose: 3300 })
                setbtnclick(false);
                setlog(true)
                dispatch(setloader(false));
            } else {
                dispatch(setloader(false));
                setbtnclick(false);
                toast.warn(datae.message, { autoClose: 8300 })
            }

            // console.log(datae);
        } catch (error) {
            dispatch(setloader(false));
            setbtnclick(false);
            toast.warn(error.message, { autoClose: 5600 })
            console.log(error);
        }

    }

    return (
        <>
            <div className="singup">
                <form onSubmit={submit}>
                    <TextField
                        label="Name"
                        required
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
                        label="Email"
                        required
                        className='filled'
                        onChange={signhandle}
                        name="email"
                        type='email'
                        value={signinp.email}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <MailOutlineIcon />
                            </InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Phone"
                        required
                        color={signinp.phone.length == 10 ? "primary" : "warning"}
                        className='filled'
                        onChange={signhandle}
                        name="phone"
                        type='tel'
                        inputProps={{ minLength: 10, maxLength: 10 }}
                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                        value={signinp.phone}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <LocalPhoneIcon />
                            </InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Password"
                        className='filled'
                        required
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
                        label="Confirm Password"
                        className='filled'
                        color={signinp.password == signinp.cpassword ? "primary" : "warning"}
                        required
                        onChange={signhandle}
                        name="cpassword"
                        value={signinp.cpassword}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <VpnKeyIcon />
                            </InputAdornment>,
                        }}
                    />
                    <button type='submit' disabled={btnclick} style={btnclick ? { background: "#cccccc", color: "#666666" } : { background: "rgb(3, 73, 114)", color: "white" }} >Signup</button>
                </form>
            </div>
        </>
    )
}

export default Signup