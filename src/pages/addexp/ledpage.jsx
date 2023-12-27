import React, { useState } from 'react'
import './ledpage.css';
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { userdata } from '../../store/api';
import {  toast } from 'react-toastify';

const Ledpage = ({  setmodal, isledupdate, setisledupdate }) => {
  const dispatch = useDispatch();
  const useralldetail = useSelector((state) => state.userexplist);
  const [isupda, setinsupdat] = useState(false)

  const [ledger, setledger] = useState(useralldetail.user.ledger);
  const init = {
    ind: "",
    val: ""
  }
  const [ledinp, setledinp] = useState(init)
  const [count,setcount]= useState(0)
  useEffect(() => {
    if(count>0){
      updateledger();
    }
    setcount(count+1);
  }, [ledger])

  const updateledger = async () => {
    const token = localStorage.getItem("token");
    // console.log(ledger.length);
    if (ledger.length < 1) {
      return toast.warn("At least One ledger Required", 2000)
    }
    try {
      const res = await fetch(`${useralldetail.apiadress}/userledger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
           userledger:ledger
        })
      })
      const result = await res.json();
      // console.log(res);
      if(res.ok){
        toast.success("Ledger Updated successful", 1800)
        setledinp(init);
        dispatch(userdata());
        isupda && setinsupdat(false);
      }else{
        console.log(result)
        return toast.warn("something wrong", 2000)
      }
    } catch (error) {
      console.log(error);
      return toast.warn("something wrong", 2000)
    }
  }


  const handle = (e) => {
    setledinp({
      ...ledinp, val: e.target.value.toLowerCase()
    })
  }

  const add = () => {
    setledger([...ledger, ledinp.val]);
  }

  const updat = () => {
    setledger(ledger.map((value, ind) => {
      if (ind == ledinp.ind) {
        return value = ledinp.val
      }
      return value;
    }))
  }

  const deletee = (index) => {
    setledger(ledger.filter((val, ind) => {
      return ind != index;
    }))
  }


  const back = () => {
    setmodal(true)
    setisledupdate(false)
  }
  var ledpage = document.querySelector(".ledpage");

  const sdef = function (event) {
    if (event.target == ledpage) {
      setisledupdate(false)
    }
  }
  const edite = (ind, val) => {
    setledinp({
      ind: ind,
      val: val
    })
    setinsupdat(true);
  }

  return (
    <div className="ledpage" onClick={sdef} style={{ display: isledupdate ? "block" : "none" }}>
      <div className="box">
        <h2>Hi jai kishan</h2>  <span onClick={back}> <i className="fa fa-undo" aria-hidden="true"></i> Back</span>
        <div className="cont">

          <input type="text" className='caps' value={ledinp.val} onChange={handle} />
          {isupda ? <button onClick={updat}>Update</button> : <button onClick={add}>Add</button>}
        </div>
        <div className="mater">
          <table>
            <thead>
              <tr>
                <th>Ledger</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((val, ind) => {
                return (
                  <tr key={ind}>
                    <td>{val}</td>
                    <td><i className="fa fa-pencil" onClick={() => edite(ind, val)} aria-hidden="true" ></i></td>
                    <td><i className="fa fa-trash" onClick={() => deletee(ind)} aria-hidden="true" value={ind} ></i></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Ledpage;