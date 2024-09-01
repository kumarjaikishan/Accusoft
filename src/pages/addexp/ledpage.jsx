
import React, { useState } from 'react';
import './ledpage.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import TextField from '@mui/material/TextField';
import apiWrapper from './apiWrapper'; // Import the wrapper

const Ledpage = ({ setmodal, setdisable, disable, navigate, isledupdate, setisledupdate }) => {
  const dispatch = useDispatch();
  const useralldetail = useSelector((state) => state.userexplist);
  const [isupda, setinsupdat] = useState(false);
  const init = {
    ind: '',
    val: '',
  };
  const [ledinp, setledinp] = useState(init);

  const handle = (e) => {
    setledinp({
      ...ledinp,
      val: e.target.value.toLowerCase(),
    });
  };

  const add = async () => {
    if (!ledinp.val) {
      return toast.warn("Ledger Can't be Blank", { autoClose: 1300 });
    }
    const url = `${useralldetail.apiadress}/addledger`;
    const method = 'POST';
    const body = { ledger: ledinp.val };

    const successAction = (data) => {
      toast.success(data.message, { autoClose: 1300 });
      dispatch(userdata());
      setledinp(init);
      setdisable(false);
    };

    const loaderAction = (isLoading) => dispatch(setloader(isLoading));

    await apiWrapper(url, method, body, dispatch, successAction, loaderAction, navigate);
  };

  const deletee = async (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this Data!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const url = `${useralldetail.apiadress}/deleteledger`;
        const method = 'POST';
        const body = { ledgerid: id };

        const successAction = (data) => {
          toast.success(data.message, { autoClose: 1300 });
          dispatch(userdata());
          setdisable(false);
        };

        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper(url, method, body, dispatch, successAction, loaderAction, navigate);
      }
    });
  };

  const updat = async () => {
    const newledger = ledinp.val;
    const ledger_id = ledinp.ind;

    const token = localStorage.getItem("token");
    try {
      setdisable(true);
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
      const data = await res.json();
      if (!res.ok && data.message === 'jwt expired') {
        toast.warn('Session expired. Please log in again.', { autoClose: 1700 });
        return navigate('/logout');
      }

      if (res.ok && res.status == 200) {
        toast.success(data.message, { autoClose: 1300 });
        setledinp(init);
        setinsupdat(false);
        dispatch(userdata());
      } else if (res.status == 421) {
        toast.warn(data.message, { autoClose: 2300 });
        swal({
          title: 'Want to merge Ledger?',
          text: `If Merge,old Ledger Expenses transferred to ${newledger} Ledger`,
          icon: 'warning',
          buttons: true,
          dangerMode: true,
        }).then(async (merge) => {
          if (merge) {
            try {
              const res = await fetch(`${useralldetail.apiadress}/mergeledger`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ledger_id, newledger
                })
              })
              const datae = await res.json();
              if (!res.ok) {
                return toast.warn(datae.message, { autoClose: 2300 });
              }

              dispatch(userdata());
              toast.success(datae.message, { autoClose: 1300 });

            } catch (error) {
              console.log(error);
            }
          }
        });
      } else {
        toast.warn(data.message, { autoClose: 2300 });
      }
      setdisable(false)
    } catch (error) {
      console.log(error);
      setdisable(false)
    }
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
  // Other functions using the apiWrapper...

  return (
    <div className="ledpage" onClick={sdef} style={{ display: isledupdate ? "block" : "none" }}>
      <div className="box">
        <h2>Hi, {useralldetail?.user.name}</h2>  <span className='back' onClick={back}> <i className="fa fa-undo" aria-hidden="true"></i> Back</span>

        <span className='ledwrapper'>
          <div className="cont">
            <TextField id="outlined-basic" label="Enter Ledger" className='inpe' variant="outlined" value={ledinp.val} onChange={handle} />
            {/* <input type="text" placeholder='Enter Ledger' className='caps' value={ledinp.val} onChange={handle} /> */}
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
                      <td><i className="fa fa-pencil-square-o" onClick={() => setledgerininput(val._id, val.ledger)} aria-hidden="true" ></i></td>
                      <td><i className="fa fa-trash" onClick={() => deletee(val._id)} aria-hidden="true" value={ind} ></i></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </span>
      </div>
    </div>
  )
};

export default Ledpage;
