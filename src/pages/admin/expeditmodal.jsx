import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const Userexpedit = ({ inp, modal, setmodal, handler,setinp }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();

    // for updating data fetched above 
    const editdetail = async () => {
        const token = localStorage.getItem("token");
        dispatch(setloader(true));
        let { _id,ledger, date, amount, narration } = inp;
        date = dayjs(date).format("YYYY-MM-DD");
        // console.log(inp);
        try {
            const result = await fetch(`${import.meta.env.VITE_API_ADDRESS}adminupdateexp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    _id, ledger, date, amount, narration
                })
            })
            const datea = await result.json();
            console.log(datea);
            if (result.ok) {
                toast.success("Data updated Successfully", { autoClose: 1300 })
                // dispatch(userdata());
                setmodal(false);
                dispatch(setloader(false));
            } else {
                toast.warn("error occurred", { autoClose: 1300 })
                console.log(datea);
            }
        } catch (error) {
            toast.warn("Sopmething went wrong", { autoClose: 1300 })
            console.log(error);
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
    const setValue=(val)=>{
        let now = dayjs(val);
         setinp({
             ...inp, date:now
         })
     }
    return (
        <div className="modal" style={{ display: modal ? "block" : "none" }}>
            <div className="box">
                <h1>Edit Detail</h1>
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
                    <button onClick={editdetail}>submit</button>
                    <button onClick={() => setmodal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Userexpedit;