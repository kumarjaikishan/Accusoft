import React, { useEffect, useState } from 'react';
import './ledpage.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import TextField from '@mui/material/TextField';
import apiWrapper from './apiWrapper';
import { MdAddBox, MdUpdate } from "react-icons/md";
import Button from '@mui/material/Button';
import { HiPencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";

const Ledpage = ({ setmodal, setdisable, disable, navigate, isledupdate, setisledupdate }) => {
  const dispatch = useDispatch();
  const useralldetail = useSelector((state) => state.userexplist);

  const [isupda, setinsupdat] = useState(false);

  useEffect(() => {
    // console.log(useralldetail.ledgerlist)
  }, [])

  const init = {
    ind: '',
    ledger: '',
    budget: ''
  };
  const [ledinp, setledinp] = useState(init);

  // handle ledger and budget input changes
  const handleLedger = (e) => {
    setledinp({ ...ledinp, ledger: e.target.value });
  };

  const handleBudget = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setledinp({ ...ledinp, budget: value });
    }
  };

  // Add ledger
  const add = async () => {
    if (!ledinp.ledger) {
      return toast.warn("Ledger Can't be Blank", { autoClose: 1300 });
    }

    if (!ledinp.budget) {
      return toast.warn("Budget Can't be Blank", { autoClose: 1300 });
    }

    const url = `${import.meta.env.VITE_API_ADDRESS}addledger`;
    const method = 'POST';
    const body = { ledger: ledinp.ledger, budget: parseFloat(ledinp.budget) };

    setdisable(true);

    const successAction = (data) => {
      toast.success(data.message, { autoClose: 1300 });
      dispatch(userdata());
      setledinp(init);
      setdisable(false);
    };

    const notsuccessAction = (data) => {
      toast.warn(data.message, { autoClose: 1800 });
      setdisable(false);
    };

    const loaderAction = (isLoading) => dispatch(setloader(isLoading));

    await apiWrapper({ url, method, body, dispatch, successAction, loaderAction, navigate, notsuccessAction });
  };

  // Update ledger
  const updat = async () => {
    if (!ledinp.ledger) return toast.warn("Ledger Can't be Blank", { autoClose: 1300 });
    if (!ledinp.budget) return toast.warn("Budget Can't be Blank", { autoClose: 1300 });

    const ledger_id = ledinp.ind;
    const newledger = ledinp.ledger;
    const newbudget = parseFloat(ledinp.budget);

    const token = localStorage.getItem("token");
    try {
      setdisable(true);
      const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}updateledger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ledger_id,
          newledger,
          newbudget
        })
      });

      const data = await res.json();

      if (!res.ok && data.message === 'jwt expired') {
        toast.warn('Session expired. Please log in again.', { autoClose: 1700 });
        return navigate('/logout');
      }

      if (res.ok && res.status === 200) {
        toast.success(data.message, { autoClose: 1300 });
        setledinp(init);
        setinsupdat(false);
        dispatch(userdata());
      } else {
        toast.warn(data.message, { autoClose: 2300 });
      }
      setdisable(false);
    } catch (error) {
      console.log(error);
      setdisable(false);
    }
  };

  // Delete ledger
  const deletee = async (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this Data!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const url = `${import.meta.env.VITE_API_ADDRESS}/deleteledger`;
        const method = 'POST';
        const body = { ledgerid: id };
        setdisable(true);

        const successAction = (data) => {
          toast.success(data.message, { autoClose: 1300 });
          dispatch(userdata());
          setdisable(false);
        };
        const notsuccessAction = (data) => {
          toast.warn(data.message, { autoClose: 1800 });
          setdisable(false);
        };

        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper({ url, method, body, dispatch, successAction, loaderAction, navigate, notsuccessAction });
      }
    });
  };

  // Set ledger data in input for editing
  const setledgerininput = (id, ledgerName, budget) => {
    setledinp({
      ind: id,
      ledger: ledgerName,
      budget: budget
    });
    setinsupdat(true);
  };

  // Close modal when clicking outside
  const sdef = (event) => {
    if (event.target.classList.contains('ledpage')) {
      setisledupdate(false);
    }
  };

  return (
    <div className="ledpage" onClick={sdef} style={{ display: isledupdate ? "block" : "none" }}>
      <div className="box">
        <h2>Hi, {useralldetail?.user?.name}</h2>

        <span className='ledwrapper'>
          <div className="cont">
            <TextField
              label="Enter Ledger"
              size='small'
              variant="outlined"
               style={{ width: '250px' }}
              value={ledinp.ledger}
              onChange={handleLedger}
              className="inpe"
            />
            <TextField
              label="Budget"
              size='small'
              variant="outlined"
              value={ledinp.budget}
              style={{ width: '170px' }}
              onChange={handleBudget}
              className="inpe"
              type="number"
            />
            {isupda ? (
               <Button
                size='small'
                className='btne'
                disabled={disable}
                title='Add'
                onClick={updat}
                startIcon={<MdUpdate />}
                variant="contained"
              >
                Update
              </Button>
            ) : (
              <Button
                size='small'
                className='btne'
                disabled={disable}
                title='Add'
                onClick={add}
                startIcon={<MdAddBox />}
                variant="contained"
              >
                Add
              </Button>
            )}
          </div>

          <div className="mater">
            <table>
              <thead>
                <tr>
                  <th>Ledger</th>
                  <th>Budget</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {useralldetail.ledgerlist && useralldetail.ledgerlist.map((val, ind) => (
                  <tr key={ind}>
                    <td>{val.ledger}</td>
                    <td>{val.budget}</td>
                    <td>
                      <HiPencilSquare
                        className='editicon ico'
                        title='Edit'
                        onClick={() => setledgerininput(val._id, val.ledger, val.budget)}
                      />
                    </td>
                    <td>
                      <RiDeleteBin6Line
                        className='deleteicon ico'
                        title='Delete'
                        onClick={() => deletee(val._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </span>
      </div>
    </div>
  );
};

export default Ledpage;
