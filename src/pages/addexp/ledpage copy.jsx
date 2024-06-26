import React, { useState } from 'react'
import './ledpage.css';
import swal from 'sweetalert'
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api';
import { toast } from 'react-toastify';

const Ledpage = ({ setmodal, setdisable,disable, isledupdate, setisledupdate }) => {
  const dispatch = useDispatch();
  const useralldetail = useSelector((state) => state.userexplist);
  const [isupda, setinsupdat] = useState(false)
  const init = {
    ind: "",
    val: ""
  }
  const [ledinp, setledinp] = useState(init)

  const handle = (e) => {
    setledinp({
      ...ledinp, val: e.target.value.toLowerCase()
    })
  }

  const add = async () => {
    if(!ledinp.val){
      return toast.warn("Ledger Can't be Blank", { autoClose: 1300 });
     }
    const token = localStorage.getItem("token");
    dispatch(setloader(true));
    try {
      setdisable(true);
      const result = await fetch(`${useralldetail.apiadress}/addledger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ledger: ledinp.val
        })
      })
      const data = await result.json();
      if (result.ok) {
        toast.success(data.message, { autoClose: 1300 })
        dispatch(userdata());
        setledinp(init);
        setdisable(false);
        dispatch(setloader(false));
      } else {
        toast.warn("error occurred", { autoClose: 1300 })
        console.log(data);
        dispatch(setloader(false));
        setdisable(false);
      }
    } catch (error) {
      toast.warn("Sopmething went wrong", { autoClose: 1300 })
      console.log(error);
      setdisable(false);
      dispatch(setloader(false));
    }
  }

  const deletee = async (id) => {
    // console.log(id);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setdisable(true);
        const token = localStorage.getItem("token");
        dispatch(setloader(true));
        try {
          const result = await fetch(`${useralldetail.apiadress}/deleteledger`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              ledgerid: id
            })
          })
          
          const data = await result.json();
          if (result.ok) {
            toast.success(data.message, { autoClose: 1300 })
            dispatch(userdata());
            setdisable(false);
            dispatch(setloader(false));
          } else {
            toast.warn("error occurred", { autoClose: 1300 })
            console.log(data);
            setdisable(false);
            dispatch(setloader(false));
          }
        } catch (error) {
          toast.warn("Sopmething went wrong", { autoClose: 1300 })
          console.log(error);
          dispatch(setloader(false));
          setdisable(false);
        }
      } else {
        // swal("Your data is safe!");
      }
    });


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
  const setledgerininput = (ind, val) => {
    setledinp({
      ind: ind,
      val: val
    })
    setinsupdat(true);
  }

  const updat = async () => {
    const token = localStorage.getItem("token");
    const newledger = ledinp.val;
    const ledger_id = ledinp.ind;
    //  console.log(ledger_id,newledger);
    try {
      const res = await fetch(`${useralldetail.apiadress}/updateledger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ledger_id, newledger
        })
      })
      const result = await res.json();
      console.log(result);
      if (res.ok) {
        toast.success(result.message, { autoClose: 1300 })
        dispatch(userdata());
        dispatch(setloader(false));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="ledpage" onClick={sdef} style={{ display: isledupdate ? "block" : "none" }}>
      <div className="box">
        <h2>Hi jai kishan</h2>  <span onClick={back}> <i className="fa fa-undo" aria-hidden="true"></i> Back</span>
        <div className="cont">

          <input type="text" className='caps' value={ledinp.val} onChange={handle} />
          {isupda ? <button disabled={disable} onClick={updat}>Update</button> : <button disabled={disable} onClick={add}>Add</button>}
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
              {useralldetail.ledgerlist && useralldetail.ledgerlist.map((val, ind) => {
                return (
                  <tr key={ind}>
                    <td>{val.ledger}</td>
                    <td><i className="fa fa-pencil" onClick={() => setledgerininput(val._id, val.ledger)} aria-hidden="true" ></i></td>
                    <td><i className="fa fa-trash" onClick={() => deletee(val._id)} aria-hidden="true" value={ind} ></i></td>
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