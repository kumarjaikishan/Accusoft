import React, { useState } from 'react'
import './expeditmodal.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { toast } from 'react-toastify';

const Userexpedit = ({ inp, modal, setmodal, handler }) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();

    // for updating data fetched above 
    const editdetail = async () => {
        const token = localStorage.getItem("token");
        dispatch(setloader(true));
        const { _id,ledger, date, amount, narration } = inp;
        // console.log(inp);
        try {
            const result = await fetch(`${useralldetail.apiadress}/adminupdateexp`, {
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
    return (
        <div className="modal" style={{ display: modal ? "block" : "none" }}>
            <div className="box">
                <h1>User Detail</h1>
                <div>
                    <span>Ledger :</span>
                    <span>
                        <select name="ledger" id="" onChange={handler} value={inp.ledger}>
                           {useralldetail.ledgerlist.map((val)=>{
                           return  <option key={val._id} value={val._id}>{val.ledger}</option>
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
                        <input name="narration" type="text" value={inp.narration} onChange={handler} />
                    </span>
                </div>

                <div>
                    <button onClick={editdetail}>submit</button>
                    <button onClick={() => setmodal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Userexpedit;