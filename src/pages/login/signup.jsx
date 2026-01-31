import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IoMailOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdKey } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { FaUserAstronaut } from "react-icons/fa";
import { setloader, setlogin } from '../../store/login';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useForm } from '../../utils/useForm';

const Signup = ({ setlog }) => {
    const dispatch = useDispatch();

    const init = {
        name: "",
        email: "",
        phone: "",
        password: "",
        cpassword: "",
        ledger: ["general", "other"]
    }
    const { fields, handlechange, reset } = useForm(init)
    const [btnclick, setbtnclick] = useState(false);
    const [signuppass, setsignuppass] = useState(true);

    const submit = async (e) => {
        e.preventDefault();
        // return console.log(fields);
        setbtnclick(true);

        const { name, email, phone, password, cpassword } = fields;
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
            const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}signup`, {
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
                reset()
                // toast.success("Signup Successful,verify your Email", { autoClose: 3300 })
                swal({
                    title: 'Signup Successful',
                    text: 'Please verify your email to proceed. Check your spam/junk folder if you don’t see the email.',
                    icon: 'success',
                    button: {
                        text: 'OK',
                    },
                }).then(() => {
                    setbtnclick(false);
                    setlog(true)
                });

                dispatch(setloader(false));
            } else {
                dispatch(setloader(false));
                setbtnclick(false);
                toast.warn(datae.message, { autoClose: 3300 })
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
                        size='small'
                        className='filled'
                        onChange={handlechange}
                        name="name"
                        value={fields.name}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <FaUserAstronaut />
                            </InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Email"
                        required
                        size='small'
                        className='filled'
                        onChange={handlechange}
                        name="email"
                        type='email'
                        value={fields.email}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <IoMailOutline />
                            </InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Phone"
                        required
                        size='small'
                        color={fields.phone.length == 10 ? "primary" : "warning"}
                        className='filled'
                        onChange={handlechange}
                        name="phone"
                        type='tel'
                        inputProps={{ minLength: 10, maxLength: 10 }}
                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                        value={fields.phone}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <MdLocalPhone />
                            </InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Password"
                        className='filled'
                        required
                        size='small'
                        onChange={handlechange}
                        name="password"
                        type={signuppass ? "password" : null}
                        value={fields.password}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <MdKey />
                            </InputAdornment>,
                            endAdornment: <InputAdornment position="end" style={{ cursor: "pointer" }} onClick={() => signuppass ? setsignuppass(false) : setsignuppass(true)}>
                                {signuppass ? <IoEyeOutline /> : <IoEyeOffOutline />}
                            </InputAdornment>
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        className='filled'
                        size='small'
                        color={fields.password == fields.cpassword ? "primary" : "warning"}
                        required
                        onChange={handlechange}
                        name="cpassword"
                        value={fields.cpassword}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <MdKey />
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