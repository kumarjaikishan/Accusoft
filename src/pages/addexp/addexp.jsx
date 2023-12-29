import React, { useState } from 'react'
import { useEffect } from 'react';
import './addexp.css';
import swal from 'sweetalert'
import Pagination from './pagination';
import Modalbox from './modalbox';
import Ledpage from './ledpage';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api'
import {  toast } from 'react-toastify';


const Addexp = () => {
  let navigate = useNavigate();
  const log = useSelector((state) => state.login);
  const useralldetail = useSelector((state) => state.userexplist);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!log.islogin) {
      toast.warn("You Are not Logged In", 1100);
      return navigate('/login');
    }
    // console.log("addexp:",useralldetail.explist);
    // setloader(true)
  }, [])



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
    ledger: "",
    date: today,
    amount: "",
    narration: ""
  }
  const [isledupdate, setisledupdate] = useState(false);
  const [inp, setinp] = useState(init);
  const [currentpage, setcurrentpage] = useState(1);
  const [postperpage, setpostperpage] = useState(10);

  const [modal, setmodal] = useState(false);

  const handler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setinp({ ...inp, [name]: value })
  }

  // function for captilizing
  const cap = (val) => {
    let cop = val.split(' ');
    let final = "";
    for (let i = 0; i < cop.length; i++) {
      let hi = cop[i].toLowerCase().charAt(0).toUpperCase();
      let ho = cop[i].toLowerCase().slice(1);
      final += hi + ho;

      if (((cop.length) - 1) !== i) {
        final += " ";
      }
    }
    return final;
  }
  // function for captilizing ends here


  // for creating/inserting data
  const sub = async () => {
    const token = localStorage.getItem("token");
    let { ledger, date, amount, narration } = inp;
    // console.log(inp);
    narration = cap(narration);

    if (!ledger || !date || !amount || !narration) {
      let dvd = document.querySelector('.box');
      dvd.classList.add("shake");
      setTimeout(() => {
        dvd.classList.remove("shake");
      }, 420);
      console.log(dvd)
      dispatch(setloader(false));
      return toast.warn("Kindly Fill all Fields", { autoClose: 1700 })
    }
    try {
      dispatch(setloader(true));
      const result = await fetch(`${useralldetail.apiadress}/addexpense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ledger, date, amount, narration
        })
      })
      const data = await result.json();
      if (result.ok) {
        toast.success("Expense Added", { autoClose: 1300 });
        console.log(data);
        dispatch(userdata());
        dispatch(setloader(false));
        setmodal(false);
        setinp(init);
      } else {
        toast.warn("something went wrong", { autoClose: 1500 });
      }

    } catch (error) {
      console.log(error);
    }
  }
  // for creating/inserting data ends here


  //  fecthing data for edit
  const datafetchforedit = async (val) => {
    const token = localStorage.getItem("token");
    dispatch(setloader(true));
    try {
      const result = await fetch(`${useralldetail.apiadress}/datafetcheditexp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: val
        })
      })
      const datae = await result.json();
      if (result.ok) {
        // console.log(datae.data[0]);
        setinp(datae.data[0]);
        setisupdate(true);
        setmodal(true);
        dispatch(setloader(false));
      } else {
        console.log(datae);
      }

    } catch (error) {
      console.log(error);
    }

  }
  //  fecthing data for edit ends here

  // for deleteing data
  const delet = async (val) => {
    const token = localStorage.getItem("token");
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
          try {
            const result = await fetch(`${useralldetail.apiadress}/deleteoneexp`, {
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
            if (result.ok) {
              toast.success("Data Deleted Successfully", { autoClose: 1300 });
              dispatch(userdata());
              dispatch(setloader(false));
            }
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong", { autoClose: 1600 });
          }

        } else {
          // swal("Your data is safe!");
        }
      });
  }
  // for deleteing data ends here

  // for sending multiple delete request
  const senddelete = async () => {
    const token = localStorage.getItem("token");
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
            return toast.warn("Kindly Select data", { autoClose: 1700 });
          }
          try {
            const result = await fetch(`${useralldetail.apiadress}/delmany`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                id: arr
              })
            })
            const data = await result.json();
            if (result.ok) {
              toast.success("Deleted Successfully", { autoClose: 1300 });
              dispatch(setloader(false));
              dispatch(userdata());

              const item = document.querySelectorAll("#tablecontent input");
              const tr = document.querySelectorAll("#tablecontent tr");
              for (let i = 0; i < item.length; i++) {
                item[i].checked = false;
              }

              highlight();
            } else {
              toast.warn("something went wrong", { autoClose: 1800 });
            }

          } catch (error) {
            console.log(error);
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
    setsortee();
  }

  const changepageno = (hi) => {
    setsortee();
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

  let currentpost = useralldetail.explist.slice(firstpostindex, lastpostindex);
  const [sortee, setsortee] = useState();

  const [order, setorder] = useState("ASC");

  const sorte = (col) => {
    console.log(this);
    if (order === "ASC") {
      if (col == "amount") {
        const sorted = [...currentpost].sort((a, b) => {
          return a[col] - b[col];
        });
        setsortee(sorted);
        setorder("DSC");
      } else {
        const sorted = [...currentpost].sort((a, b) => {
          return a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1;
        });
        setsortee(sorted);
        setorder("DSC");
      }

      // sorted.map((valem) => {
      //   console.log(valem.ledger)
      // })

    }
    if (order === "DSC") {
      if (col == "amount") {
        const sorted = [...currentpost].sort((a, b) => {
          return b[col] - a[col];
        });
        setsortee(sorted);
        setorder("ASC");
      } else {
        const sorted = [...currentpost].sort((a, b) => {
          return a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1;
        });
        setsortee(sorted);
        setorder("ASC");
      }
      // sorted.map((valem) => {
      //   console.log(valem.ledger)
      // })
    }
  }

  let sum = 0;
  return (
    <>
      <div className="exp">
        <div className="add"> <i title='Add Expense' className="fa fa-plus" onClick={() => setmodal(true)} aria-hidden="true" id='addexp'></i> </div>
        <div className="head">
          <span>Expense Voucher List </span>
          <span>
            Record :  <select name="" id="" value={postperpage} onChange={requirede}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="5000">ALL</option>
            </select>
          </span>
          <span><input type="text" onChange={sear} value={serinp} placeholder='Type to search...' /></span>
        </div>
        <div className="table">
          <table cellSpacing="15">
            <thead >
              <tr>
                <th >S.no  </th>
                <th onClick={() => sorte('ledger')}>Ledger Name <i className="fa fa-arrow-down" aria-hidden="true"></i></th>
                <th onClick={() => sorte('amount')}>Amount <i className="fa fa-arrow-down" aria-hidden="true"></i></th>
                <th>Narration</th>
                <th onClick={() => sorte('date')}>Date<i className="fa fa-arrow-down" aria-hidden="true"></i></th>
                <th style={{ display: "none" }}>View</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>All  : <input type="checkbox" onClick={allselect} id="allcheck" /></th>
              </tr>
            </thead>
            <tbody id="tablecontent">

              {sortee ? sortee.filter((item) => {
                return serinp.toLowerCase() === "" ? item : item.narration.toLowerCase().includes(serinp) || item.ledger.toLowerCase().includes(serinp);
              }).map((val, ind) => {
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
                    <td>{val.ledger}</td>
                    <td>{val.amount}</td>
                    <td>{val.narration}</td>
                    <td>{fde}</td>
                    <td style={{ display: "none" }} title='view'><i className="fa fa-eye" aria-hidden="true"></i></td>
                    <td title='edit'><i onClick={() => datafetchforedit(val._id)} className="fa fa-pencil" aria-hidden="true"></i></td>
                    <td title='delete' ><i onClick={() => delet(val._id)} className="fa fa-trash-o" aria-hidden="true"></i></td>
                    <td><input type="checkbox" onClick={highlight} id={val._id} /></td>
                  </tr>
                )
              }) : currentpost.filter((item) => {
                return serinp.toLowerCase() === "" ? item : item.narration.toLowerCase().includes(serinp) || item.ledger.toLowerCase().includes(serinp);
              }).map((val, ind) => {
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
                    <td>{val.ledger.ledger}</td>
                    <td>{val.amount}</td>
                    <td>{val.narration}</td>
                    <td>{fde}</td>
                    <td style={{ display: "none" }} title='view'><i className="fa fa-eye" aria-hidden="true"></i></td>
                    <td title='edit'><i onClick={() => datafetchforedit(val._id)} className="fa fa-pencil" aria-hidden="true"></i></td>
                    <td title='delete' ><i onClick={() => delet(val._id)} className="fa fa-trash-o" aria-hidden="true"></i></td>
                    <td><input type="checkbox" onClick={highlight} id={val._id} /></td>
                  </tr>
                )
              })}

            </tbody>
            <tfoot>
              <tr id="foot">
                <th colSpan="1" ></th>
                <th colSpan="1" >Total</th>
                <th colSpan="1" id="totalhere">
                  {
                    currentpost.filter((item) => {
                      return serinp.toLowerCase() === "" ? item : item.narration.toLowerCase().includes(serinp) || item.ledger.toLowerCase().includes(serinp);
                    }).reduce((accu, val, ind) => {
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
          <span>Showing Result From {firstpostindex + 1} To {lastpostindex >= useralldetail.explist.length ? lastpostindex = useralldetail.explist.length : lastpostindex} of  {useralldetail.explist.length} Results</span>
          <span>Pages :
            <Pagination currentpage={currentpage} changepageno={changepageno} totalpost={useralldetail.explist.length} postperpage={postperpage} />
          </span>
        </div>
        <Modalbox  setisledupdate={setisledupdate}  init={init} setinp={setinp} setisupdate={setisupdate} setmodal={setmodal} sub={sub} modal={modal} handler={handler} inp={inp} isupdate={isupdate} />
        <Ledpage  setmodal={setmodal} setisledupdate={setisledupdate} isledupdate={isledupdate}  
         />
      </div>

    </>
  )
}

export default Addexp;
