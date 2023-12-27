import React, { useState } from 'react'
import swal from 'sweetalert'
import './modalbox.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api'
import {  toast } from 'react-toastify';

const Modalbox = ({ setisledupdate, modal, init, handler, inp, isupdate, sub, setmodal, setisupdate, setinp }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();

    // for updating data fetched above 
    const updatee = async (_id) => {
        const token = localStorage.getItem("token");
        const { ledger, date, amount, narration } = inp;
        // dispatch(setloader(true));
        try {
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
                toast.success("Data updated Successfully", 1700)
                dispatch(userdata());
                setinp(init);
                setisupdate(false);
                setmodal(false);
                dispatch(setloader(false));
            } else {
                toast.warn("error occurred", 1700)
                console.log(datea);
            }
        } catch (error) {
            toast.warn("Sopmething went wrong", 2500)
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
    return (
        <div className="modal" onClick={sdef} style={{ display: modal ? "block" : "none" }}>
            <div className="box">
                <h1>Add Voucher</h1>
                <div className="ledgeredit"><i onClick={jkh} className="fa fa-pencil" aria-hidden="true"></i></div>
                <div className='leger'>
                    <span>Ledger :</span>
                    <span>
                        <select className='caps' name="ledger" id="" onChange={handler} value={inp.ledger} >
                            {useralldetail.user.ledger.map((val, ind) => {
                                return <option className='erffeg' key={ind} value={val}>{val}</option>
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
                    {isupdate ? <button onClick={() => updatee(inp._id)}>Update</button> : <button onClick={sub}>Submit</button>}
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