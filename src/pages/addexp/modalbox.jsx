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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const Modalbox = ({ setisledupdate, modal, disable, setdisable, init, handler, inp, isupdate, sub, setmodal, setisupdate, setinp }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();

    // for updating data  
    const updatee = async (_id) => {
        const { ledger, date, amount, narration } = inp;
        setdisable(true);

        const url = `${useralldetail.apiadress}/updateexp`;
        const method = 'POST';
        const body = {
            _id, ledger, date, amount, narration
        };
        const successAction = (data) => {
            toast.success(data.msg, { autoClose: 1300 });
            dispatch(userdata());
            setinp(init);
            setdisable(false);
            setisupdate(false);
            setmodal(false);
        };

        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper(url, method, body, dispatch, successAction, loaderAction);
    }
    // for updating data ends here


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
    const setValue=(val)=>{
       let now = dayjs(val);
        setinp({
            ...inp, date:now
        })
    }
    return (
        <div className="modal" onClick={sdef} style={{ display: modal ? "block" : "none" }}>
            <div
                className="box">
                <h1>Add Voucher</h1>
                <span className="ledgeredit" title='Edit Ledger'><i onClick={jkh} className="fa fa-pencil" aria-hidden="true"></i></span>

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
                        {useralldetail.ledgerlist.map((val, ind) => {
                            return <MenuItem className='caps' key={ind} value={val._id}>{val.ledger}</MenuItem>
                        })}

                    </Select>
                </FormControl>

                <LocalizationProvider onChange={(e) => handler(e, 'date')} dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date"
                        value={inp.date}
                        onChange={(newValue) => setValue(newValue)}
                        sx={{ width: '90%', mt: 2, mb: 2 }}
                        format="DD-MM-YYYY"
                    />
                </LocalizationProvider>


                <TextField sx={{ width: '90%', mt: 2, mb: 2 }} id="outlined-basic" label="Amount" name="amount"
                    onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                    type="tel" value={inp.amount}
                    onChange={(e) => handler(e, 'amount')}
                    variant="outlined" />

                <TextField multiline rows={2} sx={{ width: '90%', mt: 2, mb: 2 }} id="outlined-basic" label="Narration"
                    name="narration" value={inp.narration} type="text"
                    onChange={(e) => handler(e, 'narration')}
                    variant="outlined" />
                <div className='btn'>
                    {isupdate ? <button disabled={disable} onClick={() => updatee(inp._id)}>Update</button> : <button disabled={disable} onClick={sub}>Submit</button>}
                    <button onClick={() => {
                        setmodal(false);
                        setisupdate(false);
                        setinp(init);
                    }}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Modalbox;