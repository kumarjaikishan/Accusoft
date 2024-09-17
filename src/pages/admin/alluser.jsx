import React, { useState } from 'react'
import { useEffect } from 'react';
import './alluser.css';
import swal from 'sweetalert';
import Pagination from '../addexp/pagination';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { toast } from 'react-toastify';
import Useredit from './usereditmodal';


const Alluser = () => {
    const dispatch = useDispatch();
    const useralldetail = useSelector((state) => state.userexplist);

    const [users, setusers] = useState([]);
    useEffect(() => {
        // dispatch(setloader(true));
        fetche();
    }, [])

    const fetche = async () => {
        const token = localStorage.getItem("token");
        // dispatch(setloader(true));
        try {
            const result = await fetch(`${import.meta.env.VITE_API_ADDRESS}adminuser`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            const data = await result.json();
            // console.log("admin all users", data);
            if (result.ok) {
                setusers(data.users);
                // dispatch(setloader(false));
            } else {
                toast.warn(data.message ? data.message : "You are not authorised", { autoClose: 1500 });
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
        id: "",
        name: "",
        phone: "",
        email: "",
        admin: "",
        verified: ""
    }
    const [inp, setinp] = useState(init);
    const [currentpage, setcurrentpage] = useState(1);
    const [postperpage, setpostperpage] = useState(10);


    const [modal, setmodal] = useState(false);
    const handler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        console.log(name, " : ", value);
        setinp({
            ...inp, [name]: value
        })
    }

    //  setting input field for edit user data
    const setinputfield = async (val) => {
        // console.log(val);
        setinp({
            id: val._id,
            name: val.name,
            phone: val.phone,
            email: val.email,
            admin: val.isadmin,
            verified: val.isverified
        })
        setmodal(true);
        // console.log(val);
    }
    //  fecthing data for edit ends here

    // for deleteing data
    const delet = async (val) => {
        // console.log(val);
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    const id = toast.loading('Please Wait...')
                    const token = localStorage.getItem("token");
                    // dispatch(setloader(true));
                    const result = await fetch(`${import.meta.env.VITE_API_ADDRESS}removeuser`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            id: val
                        })
                    })
                    const data = await result.json();
                    // console.log(data);
                    if (result.ok) {
                        toast.update(id, { render: 'Deleted Successfully', type: "success", isLoading: false, autoClose: 1600 });
                        fetche();
                    }
                } catch (error) {
                    toast.update(id, { render: "Someting went wrong", type: "warn", isLoading: false, autoClose: 1600 });
                    console.log(error);
                }

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
                        const result = await fetch(`${import.meta.env.VITE_API_ADDRESS}delmany`, {
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
    let lastpostindex = currentpage * postperpage;
    const firstpostindex = lastpostindex - postperpage;

    const currentpost = users.slice(firstpostindex, lastpostindex);



    return (
        <>
            <div className="allusers admin">
                <div className="head">
                    <span>All Users List</span>
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

                    <div className="header">
                        <span>S.no</span>
                        <span>Name </span>
                        <span>Phone</span>
                        <span>Email</span>
                        <span>Admin </span>
                        <span>Verified </span>
                        <span>Action</span>
                        <span>Date</span>
                    </div>
                    <div className="body" id="tablecontent"   >

                        {currentpost && currentpost.map((val, ind) => {
                            const expenseDate = new Date(val.createdAt);
                            const formattedDate = `${expenseDate.getUTCDate().toString().padStart(2, '0')} ${expenseDate.toLocaleString('default', { month: 'short' })
                                }, ${expenseDate.getFullYear().toString().substr(-2)}`;
                            return <div key={ind} // Ensure each item has a unique key
                            >
                                <span>{ind + 1}</span>
                                <span>{val.name}</span>
                                <span>{val.phone}</span>
                                <span>{val.email}</span>
                                <span>{val.isadmin ? "Yes" : "No"}</span>
                                <span>{val.isverified ? "Yes" : "No"}</span>
                                <span>
                                    <i title='Edit' onClick={() => setinputfield(val)} className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    <i title='Delete' onClick={() => delet(val._id)} className="fa fa-trash-o" aria-hidden="true"></i>
                                </span>
                                <span>{formattedDate ? formattedDate : ""}</span>
                            </div>
                        })}
                    </div>
                </div>
                <div className="foot">
                    <span>Showing Result From {firstpostindex + 1} To {lastpostindex >= users.length ? lastpostindex = users.length : lastpostindex} of  {users.length} Results</span>
                    <span>Pages :
                        <Pagination currentpage={currentpage} changepageno={changepageno} totalpost={users.length} postperpage={postperpage} />
                    </span>
                </div>
                <Useredit handler={handler} inp={inp} setinp={setinp} modal={modal} setmodal={setmodal} fetche={fetche} />
            </div>
        </>
    )
}

export default Alluser;
