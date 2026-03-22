import React, { useState } from 'react'
import { Mail, Eye, EyeOff, Key, Phone, User, UserPlus } from 'lucide-react';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { setloader } from '../../store/login';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useForm } from '../../utils/useForm';
import { useApi } from '../../utils/useApi';
import LoadingButton from '../../components/LoadingButton';
import swal from 'sweetalert';

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
    const { request, loading } = useApi();
    const [signuppass, setsignuppass] = useState(true);

    const submit = async (e) => {
        e.preventDefault();
        const { name, email, phone, password, cpassword } = fields;
        
        if (!name || !email || !phone || !password) {
            return toast.warn("All Fields are Required", { autoClose: 1300 });
        }
        if (password != cpassword) {
            return toast.warn("Password does not match", { autoClose: 1300 });
        }
        if (phone.length < 10) {
            return toast.warn("Mobile Should be 10 Digits", { autoClose: 1300 });
        }

        try {
            const res = await request({
                url: "signup",
                method: "POST",
                body: { name, email, phone, password }
            });

            if (res) {
                reset();
                swal({
                    title: 'Signup Successful',
                    text: 'Please verify your email to proceed. Check your spam/junk folder if you don’t see the email.',
                    icon: 'success',
                    button: { text: 'OK' },
                }).then(() => {
                    setlog(true);
                });
            }
        } catch (error) {
            console.error(error);
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
                                <User size={20} />
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
                                <Mail size={20} />
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
                                <Phone size={20} />
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
                                <Key size={20} />
                            </InputAdornment>,
                            endAdornment: <InputAdornment position="end" style={{ cursor: "pointer" }} onClick={() => signuppass ? setsignuppass(false) : setsignuppass(true)}>
                                {signuppass ? <Eye size={20} /> : <EyeOff size={20} />}
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
                                <Key size={20} />
                            </InputAdornment>,
                        }}
                    />
                    
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        icon={UserPlus}
                        className="max-sm:mb-4 w-[80%] max-sm:w-[93%]"
                    >
                        Signup
                    </LoadingButton>
                </form>
            </div>
        </>
    )
}

export default Signup;