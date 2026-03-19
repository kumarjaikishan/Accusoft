import { useParams } from 'react-router-dom';
import { Save } from 'lucide-react';

import { useNavigate } from "react-router-dom";

import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { toast } from "react-toastify";

const PasswordReset = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const useralldetail = useSelector((state) => state.userexplist);
    const [inp, setinp] = useState({
        pass: '',
        cpass: ''
    })
    const handlechange = (e) => {
        let naam = e.target.name;
        let value = e.target.value;
        // console.log(naam,value);
        setinp({
            ...inp, [naam]: value
        })
    }
    const handlesubmit = async (e) => {
        e.preventDefault();
        // console.log(inp);
        try {
            setloading(true)
            const rese = await fetch(`${import.meta.env.VITE_API_ADDRESS}setpassword?token=${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: inp.pass })
            })
            const resuke = await rese.json();
            console.log(resuke);
            
            if (!rese.ok) {
                setloading(false)
                return toast.warn(resuke.message, { autoClose: 2100 })
            }
            toast.success(resuke.message, { autoClose: 1600 })
            setloading(false)
            navigate('/logout')
        } catch (error) {
            toast.warn(error.message, { autoClose: 2100 })
            console.log(error);
            setloading(false)
        }
    }
    const [isloading, setloading] = useState(false)
    return <>
        <div className="w-full h-[calc(100vh-var(--navheight))] bg-[var(--background)] grid place-items-center">
            <div className="border border-dotted border-black w-[300px] overflow-hidden rounded-[15px] bg-[#f0f0f0]">
                <h2 className="w-full h-[40px] leading-[40px] tracking-[0.5px] text-white pl-[10px] bg-[var(--maincolor)] font-bold">Reset Password</h2>
                <form onSubmit={handlesubmit} className="w-full flex items-center flex-col">
                    <TextField required name='pass' onChange={handlechange} value={inp.pass} sx={{ width: '90%', mt: 2, mb: 2 }} id="outlined-basic" label="Password" variant="outlined" />
                   <TextField required
                        onChange={handlechange}
                        error={inp.cpass.length ? inp.pass != inp.cpass : false}
                        helperText="Password must be same" name='cpass' value={inp.cpass} sx={{ width: '90%', mt: 2, mb: 2 }} id="outlined-basic" label="Confirm Password" variant="outlined" />
                    <button
                        type="submit"
                        disabled={isloading || inp.pass != inp.cpass || !inp.pass.length}
                        className="w-[75%] mt-4 mb-4 bg-[var(--maincolor)] hover:bg-[var(--maincolor)]/90 border border-[var(--maincolor)] text-white font-bold py-2 px-4 rounded transition-opacity disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                        {isloading ? "Changing..." : <><Save /> Change Password</>}
                    </button>
                </form>
            </div>
        </div>
    </>
}
export default PasswordReset;