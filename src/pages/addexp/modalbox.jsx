import React, { useEffect, useState } from 'react'
import './modalbox.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api'
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { VscDebugRestart } from "react-icons/vsc";
import { IoIosSave } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";
import InputAdornment from '@mui/material/InputAdornment';
import { useApi } from '../../utils/useApi';

const Modalbox = ({ modal, navigate,disable, init, handler, inp, isupdate, sub, setmodal, setisupdate, setinp }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();
    const { request, loading, } = useApi();

    useEffect(() => {
        // dispatch(setloader(loading))
    }, [loading])

    // for updating data  
    const updatee = async (_id) => {
        let { ledger, date, amount, narration } = inp;
        try {
            const res= await request({
                url: 'updateexp',
                method: 'POST',
                body: { _id, ledger, date, amount, narration: capitalize(narration) },
            });

            toast.success(res?.message, { autoClose: 1300 });
            dispatch(userdata());
            setinp(init);
            setisupdate(false);
            setmodal(false);

        } catch (error) {
        }
    }

    const capitalize = (value) => {
        const words = value.split(' ');
        const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        return capitalizedWords.join(' ');
    };

    var modale = document.querySelector(".modal");
    const sdef = function (event) {
        if (event.target == modale) {
            setmodal(false);
        }
    }

    return (
        <div className="modal" onClick={sdef} style={{ display: modal ? "block" : "none" }}>
            <div className="box">
                <h1>Add Voucher</h1>

                <span className="wrapper">
                    <FormControl className='caps' sx={{ width: '90%', mt: 2, mb: 2 }}>
                        <InputLabel id="demo-simple-select-label">Ledger</InputLabel>
                        <Select
                            name="ledger"
                            labelId="demo-simple-select-label"
                            onChange={(e) => handler(e, 'ledger')}
                            value={inp.ledger}
                            id="demo-simple-select"
                            label="Ledger"
                        >
                            {useralldetail?.ledgerlist?.map((val, ind) => {
                                return <MenuItem sx={{ textTransform: "capitalize" }} key={ind} value={val._id}>{val.ledger}</MenuItem>
                            })}

                        </Select>
                    </FormControl>

                    <TextField
                        type='date'
                        label="Date"
                        value={inp.date}
                        onChange={(e) => handler(e, 'date')}
                        sx={{ width: '90%', mt: 2, mb: 2 }} />

                    <TextField sx={{ width: '90%', mt: 2, mb: 2 }} id="outlined-basic" label="Amount" name="amount"
                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                        type="tel" value={inp.amount}
                        onChange={(e) => handler(e, 'amount')}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        variant="outlined" />

                    <TextField multiline rows={2} sx={{ width: '90%', mt: 2, mb: 2 }} id="outlined-basic" label="Narration"
                        name="narration" value={inp.narration} type="text"
                        onChange={(e) => handler(e, 'narration')}
                        variant="outlined" />
                    <div className='btn'>
                        {isupdate ? <Button 
                        // disabled={loading} 
                        onClick={() => updatee(inp._id)} variant="contained" startIcon={<MdOutlineUpdate />}>
                            Update
                        </Button> : <Button disabled={disable} onClick={sub} variant="contained" startIcon={<IoIosSave />}>
                            Submit
                        </Button>}

                        <Button
                            onClick={() => {
                                setmodal(false);
                                setisupdate(false);
                                setinp(init);
                            }}
                            className='muibtn outlined' title='Cancel' variant="outlined" startIcon={<VscDebugRestart />}>
                            Cancel
                        </Button>
                        {/* <Button endIcon={<CircularProgress size={15} color="inherit" />} title="Create New Tournament"
                            onClick={() => dispatch(setcreatenewmodal(true))} sx={{ width: '48%' }} variant="contained">New</Button> */}
                    </div>
                </span>
            </div>
        </div>
    )
}

export default Modalbox;