import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { VscDebugRestart } from "react-icons/vsc";
import { IoIosSave } from "react-icons/io";

const Useredit = ({ inp, modal, setmodal, handler, fetche }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();

    // for updating data fetched above 
    const editdetail = async (_id) => {
        const token = localStorage.getItem("token");
        dispatch(setloader(true));
        const { id, name, phone, email, admin, verified } = inp;
        console.log(inp);
        try {
            const result = await fetch(`${import.meta.env.VITE_API_ADDRESS}adminuserupdate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id, name, phone, email, admin, verified
                })
            })
            const datea = await result.json();
            // console.log(datea);
            if (result.ok) {
                toast.success(datea.message, { autoClose: 1300 })
                // dispatch(userdata());
                fetche();
                setmodal(false);
            } else {
                toast.warn(datea.message, { autoClose: 1300 })
                console.log(datea);
            }
            dispatch(setloader(false));
        } catch (error) {
            toast.warn("Sopmething went wrong", { autoClose: 1300 })
            console.log(error);
            dispatch(setloader(false));
        }

    }
    // for updating data fetched above ends here


    const jkh = () => {
        setisledupdate(true);
        setmodal(false)
    }
    var modale = document.querySelector(".modal");
    const sdef = function (event) {
        if (event.target == modale) {
            setmodal(false);
        }
    }
    return (
        <div className="modal" style={{ display: modal ? "block" : "none" }}>
            <div className="box">
                <h1>User Detail</h1>
                <span className="wrapper">
                    <TextField sx={{ width: '90%', mt: 3, mb: 1 }} id="outlined-basic" label="Name"
                        name="name" value={inp.name} type="text" onChange={handler}
                        variant="outlined" />
                    <TextField sx={{ width: '90%', mt: 1, mb: 1 }} id="outlined-basic" label="Phone" name="phone"
                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                        type="tel" value={inp.phone}
                        onChange={handler}
                        variant="outlined" />

                    <TextField disabled sx={{ width: '90%', mt: 1, mb: 1 }} id="outlined-basic" label="Email"
                        name="email" value={inp.email} type="text" onChange={handler}
                        variant="outlined" />

                    <FormControl className='caps' sx={{ width: '90%', mt: 1, mb: 1 }}>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            name="admin"
                            labelId="demo-simple-select-label"
                            onChange={handler}
                            value={inp.admin}
                            id="demo-simple-select"
                            label="Type"
                        >
                            <MenuItem className='caps' value={false}>User</MenuItem>
                            <MenuItem className='caps' value={true}>Admin</MenuItem>
                        </Select>
                    </FormControl>
                    {inp.verified}
                    <FormControl className='caps' sx={{ width: '90%', mt: 1, mb: 2 }}>
                        <InputLabel id="demo-simple-select-label">Verified</InputLabel>
                        <Select
                            name="verified"
                            labelId="demo-simple-select-label"
                            onChange={handler}
                            value={inp.verified}
                            id="demo-simple-select"
                            label="verified"
                        >
                            <MenuItem className='caps' value={true}>Verified</MenuItem>
                            <MenuItem className='caps' value={false}>Unverified</MenuItem>
                        </Select>
                    </FormControl>
                    <div className='btn'>
                    <Button className='muibtn' onClick={editdetail} variant="contained" startIcon={<IoIosSave />}>
                            Submit
                        </Button>
                        <Button
                           onClick={() => setmodal(false)}
                            className='muibtn outlined' title='Cancel' variant="outlined" startIcon={<VscDebugRestart />}>
                            Cancel
                        </Button>
                    </div>
                </span>
            </div>
        </div>
    )
}

export default Useredit;