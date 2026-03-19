import React, { useState } from 'react'
import { Mail, Eye, EyeOff, Key, Phone, User } from 'lucide-react';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

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
            <div className="w-full h-full">
                <form onSubmit={submit} className="w-full h-full relative flex flex-col justify-around items-center gap-4 py-4">
                    <TextField
                        label="Name"
                        required
                        size='small'
                        className='!w-[80%] max-sm:!w-[93%]'
                        onChange={handlechange}
                        name="name"
                        value={fields.name}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <User />
                            </InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Email"
                        required
                        size='small'
                        className='!w-[80%] max-sm:!w-[93%]'
                        onChange={handlechange}
                        name="email"
                        type='email'
                        value={fields.email}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Mail />
                            </InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Phone"
                        required
                        size='small'
                        color={fields.phone.length == 10 ? "primary" : "warning"}
                        className='!w-[80%] max-sm:!w-[93%]'
                        onChange={handlechange}
                        name="phone"
                        type='tel'
                        inputProps={{ minLength: 10, maxLength: 10 }}
                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                        value={fields.phone}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Phone />
                            </InputAdornment>,
                        }}
                    />
                    <TextField
                        label="Password"
                        className='!w-[80%] max-sm:!w-[93%]'
                        required
                        size='small'
                        onChange={handlechange}
                        name="password"
                        type={signuppass ? "password" : null}
                        value={fields.password}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Key />
                            </InputAdornment>,
                            endAdornment: <InputAdornment position="end" style={{ cursor: "pointer" }} onClick={() => signuppass ? setsignuppass(false) : setsignuppass(true)}>
                                {signuppass ? <Eye /> : <EyeOff />}
                            </InputAdornment>
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        className='!w-[80%] max-sm:!w-[93%]'
                        size='small'
                        color={fields.password == fields.cpassword ? "primary" : "warning"}
                        required
                        onChange={handlechange}
                        name="cpassword"
                        value={fields.cpassword}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Key />
                            </InputAdornment>,
                        }}
                    />
                    <button type='submit' disabled={btnclick} className="border-none outline-none cursor-pointer text-[1.2em] font-semibold tracking-[1px] px-[16px] py-[8px] transition-[0.1s] text-center rounded-[15px] hover:opacity-90 max-sm:mb-4" style={btnclick ? { background: "#cccccc", color: "#666666" } : { background: "var(--maincolor)", color: "white" }} >Signup</button>
                </form>
            </div>
        </>
    )
}

export default Signup