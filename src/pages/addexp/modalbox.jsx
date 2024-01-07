import React, { useState } from 'react'
import swal from 'sweetalert'
import './modalbox.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api'
import {  toast } from 'react-toastify';

const Modalbox = ({ setisledupdate, modal,disable,setdisable, init, handler, inp, isupdate, sub, setmodal, setisupdate, setinp }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();
  
    // for updating data fetched above 
    const updatee = async (_id) => {
        const token = localStorage.getItem("token");
        const { ledger, date, amount, narration } = inp;
        dispatch(setloader(true));
        try {
            setdisable(true);
            const result = await fetch(`${useralldetail.apiadress}/updateexp`, {
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
            if (result.ok) {
                toast.success("Data updated Successfully", { autoClose: 1300 })
                dispatch(userdata());
                setinp(init);
                setdisable(false);
                setisupdate(false);
                setmodal(false);
                dispatch(setloader(false));
            } else {
                toast.warn("error occurred", { autoClose: 1300 })
                console.log(datea);
                setdisable(false);
                dispatch(setloader(false));
            }
        } catch (error) {
            toast.warn("Sopmething went wrong", { autoClose: 1300 })
            console.log(error);
            dispatch(setloader(false));
            setdisable(false);
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
        <div className="modal" onClick={sdef} style={{ display: modal ? "block" : "none" }}>
            <div className="box">
                <h1>Add Voucher</h1>
                <div className="ledgeredit"><i onClick={jkh} className="fa fa-pencil" aria-hidden="true"></i></div>
                <div className='leger'>
                    <span>Ledger :</span>
                    <span>
                        <select className='caps' name="ledger" id="" onChange={handler} value={inp.ledger} >
                        <option value="">Select Ledger</option>
                            {useralldetail.ledgerlist.map((val, ind) => {
                                return <option className='erffeg' key={ind} value={val._id}>{val.ledger}</option>
                            })}
                        </select>
                    </span>
                </div>
                <div>
                    <span>Date :</span>
                    <span>
                        <input name="date" type="date" value={inp.date} onChange={handler} />
                    </span>
                </div>
                <div>
                    <span>Amount :</span>
                    <span>
                        <input name="amount"
                            onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                            type="tel" value={inp.amount} onChange={handler} />
                    </span>

                </div>
                <div>
                    <span>Narration :</span>
                    <span>
                        <input name="narration" value={inp.narration} type="text" onChange={handler} />
                    </span>
                </div>
                <div>
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