import React, { useState } from 'react'
import './modalbox.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api'
import { toast } from 'react-toastify';
import apiWrapper from './apiWrapper';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { VscDebugRestart } from "react-icons/vsc";
import { IoIosSave } from "react-icons/io";
import { MdOutlineUpdate } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import InputAdornment from '@mui/material/InputAdornment';

const Modalbox = ({ setisledupdate, modal, navigate, disable, setdisable, init, handler, inp, isupdate, sub, setmodal, setisupdate, setinp }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();

    // for updating data  
    const updatee = async (_id) => {
        let { ledger, date, amount, narration } = inp;
        setdisable(true);
        // date = dayjs(date).format("YYYY-MM-DD");
        //   console.log(date);

        const url = `${import.meta.env.VITE_API_ADDRESS}updateexp`;
        const method = 'POST';
        const body = {
            _id, ledger, date, amount, narration: capitalize(narration)
        };
        const successAction = (data) => {
            toast.success(data.message, { autoClose: 1300 });
            dispatch(userdata());
            setinp(init);
            setdisable(false);
            setisupdate(false);
            setmodal(false);
        };

        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper({ url, method, body, dispatch, successAction, loaderAction, navigate });
    }
    // for updating data ends here

    const capitalize = (value) => {
        const words = value.split(' ');
        const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        return capitalizedWords.join(' ');
    };

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
        <div className="modal" onClick={sdef} style={{ display: modal ? "block" : "none" }}>
            <div className="box">
                <h1>Add Voucher</h1>
                <span className="ledgeredit" title='Edit Ledger' onClick={jkh}>
                    <FaPencilAlt />
                </span>
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
                        {isupdate ? <Button disabled={disable} onClick={() => updatee(inp._id)} variant="contained" startIcon={<MdOutlineUpdate />}>
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