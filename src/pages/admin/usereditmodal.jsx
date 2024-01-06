import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import {  toast } from 'react-toastify';

const Useredit = ({ inp,modal, setmodal,handler}) => {
    const useralldetail = useSelector((state) => state.userexplist);
    const dispatch = useDispatch();

    // for updating data fetched above 
    const editdetail = async (_id) => {
        const token = localStorage.getItem("token");
        dispatch(setloader(true));
        const { id, name, phone, email, admin,verified } = inp;
        console.log(inp);
        try {
            const result = await fetch(`${useralldetail.apiadress}/adminuserupdate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id, name, phone, email, admin,verified
                })
            })
            const datea = await result.json();
            // console.log(datea);
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
        <div className="modal"  style={{ display: modal ? "block":"none"  }}>
            <div className="box">
                <h1>User Detail</h1>
                 
                <div>
                    <span>Name :</span>
                    <span>
                        <input name="name" type="text" value={inp.name} onChange={handler} />
                    </span>
                </div>
                <div>
                    <span>Phone :</span>
                    <span>
                        <input name="phone"
                            onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                            type="tel" value={inp.phone} onChange={handler} />
                    </span>
                </div>
                <div>
                    <span>Email :</span>
                    <span>
                        <input name="email" type="text" value={inp.email} onChange={handler} />
                    </span>
                </div>
               
                <div>
                    <span>Admin :</span>
                    <span>
                       <select name="admin" id="" onChange={handler} value={inp.admin}>
                        <option value={true}>true</option>
                        <option value={false}>False</option>
                       </select>
                    </span>
                </div>
                <div>
                    <span>Verified :</span>
                    <span>
                       <select name="verified" id="" onChange={handler} value={inp.verified}>
                        <option value={true}>true</option>
                        <option value={false}>False</option>
                       </select>
                    </span>
                </div>
                <div>
                   <button onClick={editdetail}>submit</button>
                   <button onClick={()=> setmodal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Useredit;