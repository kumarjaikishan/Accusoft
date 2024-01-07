
import React, { useState } from 'react';
import './ledpage.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import apiWrapper from './apiWrapper'; // Import the wrapper

const Ledpage = ({ setmodal, setdisable, disable, isledupdate, setisledupdate }) => {
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
     if(!ledinp.val){
      return toast.warn("Ledger Can't be Blank", { autoClose: 1300 });
     }
    const url = `${useralldetail.apiadress}/addledger`;
    const method = 'POST';
    const body = { ledger: ledinp.val };

    const successAction = (data) => {
      toast.success(data.msg, { autoClose: 1300 });
      dispatch(userdata());
      setledinp(init);
      setdisable(false);
    };

    const loaderAction = (isLoading) => dispatch(setloader(isLoading));

    await apiWrapper(url, method, body, dispatch, successAction, loaderAction);
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
          toast.success(data.msg, { autoClose: 1300 });
          dispatch(userdata());
          setdisable(false);
        };

        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper(url, method, body, dispatch, successAction, loaderAction);
      }
    });
  };

  const updat = async () => {
    const newledger = ledinp.val;
    const ledger_id = ledinp.ind;

    const url = `${useralldetail.apiadress}/updateledger`;
    const method = 'POST';
    const body = {  ledger_id, newledger };

    const successAction = (data) => {
      toast.success(data.msg, { autoClose: 1300 });
      setledinp(init);
      setinsupdat(false);
      dispatch(userdata());
    };

    const loaderAction = (isLoading) => dispatch(setloader(isLoading));

    await apiWrapper(url, method, body, dispatch, successAction, loaderAction);
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
};

export default Ledpage;
