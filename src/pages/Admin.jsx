import React, { useState } from 'react'
import { useEffect } from 'react';
import './admin.css';
import swal from 'sweetalert';
import Pagination from './addexp/pagination';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../store/login';
import { toast } from 'react-toastify';


const Admin = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const log = useSelector((state) => state.login);
    const useralldetail = useSelector((state) => state.userexplist);
    const [adminexpdata, setadminexpdata] = useState([])
    useEffect(() => {
        if (!log.islogin) {
            toast.warn("You Are not Logged In", { autoClose: 1300 });
            return navigate('/login');
        }
        // console.log(useralldetail.explist);
        setadminexpdata(useralldetail.explist);
        // dispatch(setloader(true));
        fetche();
    }, [])

    const fetche = async () => {
        const token = localStorage.getItem("token");
        // console.log("from admin",token);
        try {
            const result = await fetch(`${useralldetail.apiadress}/admin`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            const data = await result.json();
            console.log(data);
            if (result.ok) {
                setadminexpdata(data.explist)
                dispatch(setloader(false));
            } else {
                toast.warn(data.msg ? data.msg : "You are not authorised", { autoClose: 1500 });
                return navigate('/');
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
        userid: "",
        ledger: "general",
        date: today,
        amount: "",
        narration: ""
    }
    const [isledupdate, setisledupdate] = useState(false);
    const [inp, setinp] = useState(init);
    const [currentpage, setcurrentpage] = useState(1);
    const [postperpage, setpostperpage] = useState(10);


    const [modal, setmodal] = useState(false);


    //  fecthing data for edit
    const edit = async (val) => {
        dispatch(setloader(true));
        const result = await fetch(`${useralldetail.apiadress}/data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: val
            })
        })
        const datae = await result.json();
        // console.log(datae.data[0]);
        setinp(datae.data[0]);
        setisupdate(true);
        setmodal(true);
        dispatch(setloader(false));
    }
    //  fecthing data for edit ends here

    // for deleteing data
    const delet = async (val) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    dispatch(setloader(true));
                    const result = await fetch(`${useralldetail.apiadress}/addexpense`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id: val
                        })
                    })
                    const data = await result.json();

                    // console.log(data);
                    fetche();
                    toast.success("Deleted Successfully", { autoClose: 1300 });
                } else {
                    // swal("Your data is safe!");
                }
            });
    }
    // for deleteing data ends here

    // for sending multiple delete request
    const senddelete = async () => {
        const item = document.querySelectorAll("#tablecontent input");
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    dispatch(setloader(true));
                    const arr = [];
                    for (let i = 0; i < item.length; i++) {
                        if (item[i].checked == true) {
                            arr.push(item[i].id)
                        }
                    }

                    if (arr.length < 1) {
                        toast.warn("Kindly Select data", { autoClose: 1300 });
                    } else {
                        const result = await fetch(`${useralldetail.apiadress}/delmany`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: arr
                            })
                        })
                        const data = await result.json();
                        toast.success("Deleted Successfully", { autoClose: 1300 });
                        fetche();

                        const item = document.querySelectorAll("#tablecontent input");
                        const tr = document.querySelectorAll("#tablecontent tr");
                        for (let i = 0; i < item.length; i++) {
                            item[i].checked = false;
                        }

                        highlight();
                    }
                } else {
                    swal("Your data is safe!");
                }

            })
    }
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
                    <span>Expense Voucher List</span>
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
                                <th style={{ display: "none" }}>View</th>
                                <th>Edit</th>
                                <th>Del.</th>
                                <th><input type="checkbox" onClick={allselect} id="allcheck" /></th>
                            </tr>
                        </thead>
                        <tbody id="tablecontent">

                            {adminexpdata.map((val, ind) => {
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
                                        <td>{val.userid}</td>
                                        <td>{val.ledger}</td>
                                        <td>{val.amount}</td>
                                        <td>{val.narration}</td>
                                        <td>{fde}</td>
                                        <td style={{ display: "none" }} title='view'><i className="fa fa-eye" aria-hidden="true"></i></td>
                                        <td title='edit'><i onClick={() => edit(val._id)} className="fa fa-pencil" aria-hidden="true"></i></td>
                                        <td title='delete' ><i onClick={() => delet(val._id)} className="fa fa-trash-o" aria-hidden="true"></i></td>
                                        <td><input type="checkbox" onClick={highlight} id={val._id} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot>
                            <tr id="foot">
                                <th colSpan="2" ></th>
                                <th colSpan="1" >Total</th>
                                <th colSpan="1" id="totalhere">
                                    {
                                        currentpost.reduce((accu, val, ind) => {
                                            return accu = accu + val.amount;
                                        }, 0)
                                    }

                                </th>
                                <th colSpan="3" ></th>
                                <th colSpan="1" id="alldelete" title="Delete"><i onClick={senddelete} className="fa fa-trash" aria-hidden="true"></i></th>
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
            </div>

        </>
    )
}

export default Admin;
