import React, { useState } from 'react'
import { useEffect } from 'react';
import './allexpense.css';
import swal from 'sweetalert';
import Pagination from '../addexp/pagination';
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { toast } from 'react-toastify';
import Userexpedit from './expeditmodal';

const Allexpense = () => {
    const dispatch = useDispatch();
    const log = useSelector((state) => state.login);
    const useralldetail = useSelector((state) => state.userexplist);
    if (!log.islogin || !useralldetail.user.isadmin) {
        // console.log(log);
        toast.warn("You are not Admin",{ autoClose: 1300 })
        return <Navigate to='/' />
    }
    const [adminexpdata, setadminexpdata] = useState([])
    useEffect(() => {
        log.islogin && useralldetail.user.isadmin && fetche();
    }, [])
    let itemIds = [];
    const fetche = async () => {
        const token = localStorage.getItem("token");
        // console.log("from admin",token);
        dispatch(setloader(true));
        try {
            const result = await fetch(`${useralldetail.apiadress}/adminexp`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            const data = await result.json();
            // console.log("whole",data);
            if (result.ok) {
                setadminexpdata(data.explist)
                dispatch(setloader(false));
            } else {
                // toast.warn(data.msg ? data.msg : "You are not authorised", { autoClose: 1500 });
                // return <Navigate to='/' />
            }
        } catch (error) {
            console.log(error);
        }
    }

    const date = new Date;
    const [serinp, setserinp] = useState("");
    const [isupdate, setisupdate] = useState(false);
    let dfbdf = (date.getMonth() + 1);
    let dfbfvfddf = date.getUTCDate();
    if (dfbdf < 10) {
        dfbdf = "0" + dfbdf;
    }
    if (dfbfvfddf < 10) {
        dfbfvfddf = "0" + dfbfvfddf;
    }

    const today = date.getFullYear() + "-" + dfbdf + "-" + dfbfvfddf;

    const init = {
        _id: "",
        ledger: "general",
        date: today,
        amount: "",
        narration: ""
    }
    const [inp, setinp] = useState(init);
    const [currentpage, setcurrentpage] = useState(1);
    const [postperpage, setpostperpage] = useState(10);


    const [modal, setmodal] = useState(false);
    const handler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setinp({
            ...inp, [name]: value
        })
    }

    //  setting input field for edit user data
    const setinputfield = async (val) => {
        // console.log(val);
        setinp({
            _id: val._id,
            ledger: val.ledger._id,
            date: val.date,
            amount: val.amount,
            narration: val.narration
        })
        setmodal(true);
        // console.log(val);
    }

    const deleteExpense = async (expenseId) => {
        itemIds = []
        itemIds.push(expenseId);
        // console.log(itemIds);
        sendDeleteRequest(itemIds);
    };

    const deletemanyExpense = async () => {
        itemIds = []
        const selectedItems = document.querySelectorAll('#tablecontent input:checked');
        selectedItems.forEach((item) => {
            itemIds.push(item.id);
        });
        // console.log(itemIds);
        sendDeleteRequest(itemIds);
    };

    // for sending multiple delete request
    const sendDeleteRequest = async (itemIds) => {
        if (itemIds.length < 1) {
            return toast.warn('Kindly Select Atlest 1 Entry', { autoClose: 1700 });
        }
        const token = localStorage.getItem('token');
        swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this Data!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                dispatch(setloader(true));
                try {
                    const result = await fetch(`${useralldetail.apiadress}/deletemanyexp`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            id: itemIds,
                        }),
                    });

                    const data = await result.json();
                    //    console.log(data);
                    if (result.ok) {
                        toast.success('Deleted Successfully', { autoClose: 1300 });
                        dispatch(setloader(false));
                        fetche();

                        const selectedItems = document.querySelectorAll('#tablecontent input:checked');
                        const tableRows = document.querySelectorAll('#tablecontent tr');

                        selectedItems.forEach((item) => {
                            item.checked = false;
                        });

                        highlight();
                    } else {
                        toast.warn('Something went wrong', { autoClose: 1800 });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                swal('Your data is safe!');
            }
        });
    };
    // for sending multiple delete request ends here

    // for selecting all checkbox
    const allselect = () => {
        const it = document.querySelector("#allcheck");
        const item = document.querySelectorAll("#tablecontent input");
        if (it.checked == true) {
            for (let i = 0; i < item.length; i++) {
                item[i].checked = true
            }
        } else {
            for (let i = 0; i < item.length; i++) {
                item[i].checked = false;
            }
        }
        highlight();
    }

    // for selecting all checkbox ends here

    const requirede = (e) => {
        setpostperpage(e.target.value);
        setcurrentpage(1);
    }

    const changepageno = (hi) => {
        setcurrentpage(hi);
    }

    const sear = (e) => {
        setserinp(e.target.value);
    }


    const highlight = () => {
        const item = document.querySelectorAll("#tablecontent input");
        const tr = document.querySelectorAll("#tablecontent tr");

        for (let i = 0; i < item.length; i++) {
            var parent = item[i].parentNode.parentNode;
            if (item[i].checked) {
                parent.style.background = "rgb(16 135 129)";
                parent.style.color = "white";
            } else {
                parent.style.background = "transparent";
                parent.style.color = "black";
            }
        }
    }

    let lastpostindex = currentpage * postperpage;
    const firstpostindex = lastpostindex - postperpage;

    const currentpost = adminexpdata.slice(firstpostindex, lastpostindex);


    let sum = 0;
    return (
        <>
            <div className="admin">
                <div className="head">
                    <span>All User Expense List</span>
                    <span>
                        Record :  <select name="" id="" value={postperpage} onChange={requirede}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                        </select>
                    </span>
                    <span><input type="text" onChange={sear} value={serinp} placeholder='Type to search...' /></span>
                </div>
                <div className="table">
                    <table cellSpacing="15">
                        <thead >
                            <tr>
                                <th>S.no</th>
                                <th>User</th>
                                <th>Ledger</th>
                                <th>Amt.</th>
                                <th>Narration</th>
                                <th>Date</th>
                                <th>Actions</th>
                                <th><input type="checkbox" onClick={allselect} id="allcheck" /></th>
                            </tr>
                        </thead>
                        <tbody id="tablecontent">

                            {currentpost && currentpost.map((val, ind) => {
                                let daten = new Date(val.date);
                                let vf = daten.getUTCDate();
                                if (vf < 10) {
                                    vf = "0" + daten.getUTCDate();
                                }
                                // console.log(vf);
                                let fde = vf + " " + daten.toLocaleString('default', { month: 'short' }) + ", " + daten.getFullYear().toString().substr(-2);
                                return (
                                    <tr key={ind}>
                                        <td>{firstpostindex + ind + 1}</td>
                                        <td>{val.userid.name}</td>
                                        <td>{val.ledger.ledger}</td>
                                        <td>{val.amount}</td>
                                        <td>{val.narration}</td>
                                        <td>{fde}</td>
                                        <td >
                                            <i title='Edit' onClick={() => setinputfield(val)} className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                            {/* <i title='Functionallity not added' className="fa fa-eye" aria-hidden="true"></i> */}
                                            <i title="Delete" onClick={() => deleteExpense(val._id)} className="fa fa-trash-o" aria-hidden="true"></i>
                                        </td>
                                        <td><input type="checkbox" onClick={highlight} id={val._id} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr id="foot">
                                <th colSpan="2" ></th>
                                <th colSpan="1" >Total</th>
                                <th></th>
                                {/* <th colSpan="1" id="totalhere">
                                    {
                                        currentpost.reduce((accu, val, ind) => {
                                            return accu = accu + val.amount;
                                        }, 0)
                                    }
                                </th> */}
                                <th colSpan="2" ></th>
                                <th colSpan="1" id="alldelete" title="Delete"><i onClick={deletemanyExpense} className="fa fa-trash" aria-hidden="true"></i></th>
                                <th colSpan="1" ></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="foot">
                    <span>Showing Result From {firstpostindex + 1} To {lastpostindex >= adminexpdata.length ? lastpostindex = adminexpdata.length : lastpostindex} of  {adminexpdata.length} Results</span>
                    <span>Pages :
                        <Pagination currentpage={currentpage} changepageno={changepageno} totalpost={adminexpdata.length} postperpage={postperpage} />
                    </span>
                </div>
                <Userexpedit handler={handler} inp={inp} setinp={setinp} modal={modal} setmodal={setmodal} />
            </div>

        </>
    )
}

export default Allexpense;
