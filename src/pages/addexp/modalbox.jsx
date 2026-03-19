import React, { useEffect, useState } from 'react'
import { RefreshCcw, Save, RefreshCw } from 'lucide-react';

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

import InputAdornment from '@mui/material/InputAdornment';
import { useApi } from '../../utils/useApi';

const Modalbox = ({ modal, navigate, disable, handlechange, fields, isupdate, sub, setmodal, setisupdate, reset }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();
    const { request, loading, } = useApi();

    useEffect(() => {
        // dispatch(setloader(loading))
    }, [loading])

    // for updating data  
    const updatee = async (_id) => {
        let { ledger, date, amount, narration } = fields;
        try {
            const res = await request({
                url: 'updateexp',
                method: 'POST',
                body: { _id, ledger, date, amount, narration: capitalize(narration) },
            });

            toast.success(res?.message, { autoClose: 1300 });
            dispatch(userdata());
            reset();
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

    const sdef = function (event) {
        if (event.target.classList.contains('modal')) {
            setmodal(false);
        }
    }

    return (
        <div className="modal absolute top-0 left-0 w-full h-full bg-white/20 dark:bg-black/40 backdrop-blur-[5px] z-[100]" onClick={sdef} style={{ display: modal ? "block" : "none" }}>
            <div className="absolute top-1/2 left-1/2 w-[500px] h-max rounded-[20px] -translate-x-1/2 -translate-y-1/2 shadow-[10px_10px_20px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col items-center max-sm:top-[35%] max-sm:w-[96vw] bg-[var(--maincolor)] dark:bg-slate-900">
                <h1 className="w-full h-[50px] leading-[50px] text-[aliceblue] tracking-[2px] text-center max-sm:text-[1.5em] max-sm:tracking-[1px] bg-[var(--maincolor)] dark:bg-slate-900">Add Voucher</h1>

                <span className="flex flex-col rounded-t-[30px] pt-[5px] bg-surface items-center w-full pb-[20px] max-sm:pb-[15px]">
                    <FormControl className='caps' sx={{ width: '90%', mt: 2, mb: 2 }}>
                        <InputLabel id="demo-simple-select-label">Ledger</InputLabel>
                        <Select
                            name="ledger"
                            labelId="demo-simple-select-label"
                            onChange={handlechange}
                            value={fields?.ledger}
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
                        value={fields?.date}
                        name="date"
                        onChange={handlechange}
                        sx={{ width: '90%', mt: 2, mb: 2 }} />

                    <TextField sx={{ width: '90%', mt: 2, mb: 2 }} id="outlined-basic" label="Amount" name="amount"
                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                        type="tel" value={fields?.amount}
                        onChange={handlechange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        variant="outlined" />

                    <TextField multiline rows={2} sx={{ width: '90%', mt: 2, mb: 2 }} id="outlined-basic" label="Narration"
                        name="narration" value={fields?.narration} type="text"
                        onChange={handlechange}
                        variant="outlined" />
                    <div className='w-full flex justify-around mt-4 max-sm:flex-col max-sm:gap-2 max-sm:px-4'>
                        {isupdate ? <Button
                            // disabled={loading} 
                            onClick={() => updatee(fields._id)} variant="contained" startIcon={<RefreshCw />}>
                            Update
                        </Button> : <Button disabled={disable} onClick={sub} variant="contained" startIcon={<Save />}>
                            Submit
                        </Button>}

                        <Button
                            onClick={() => {
                                setmodal(false);
                                setisupdate(false);
                                reset();
                            }}
                            className='muibtn outlined' title='Cancel' variant="outlined" startIcon={<RefreshCcw />}>
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