import React, { useEffect, useState } from 'react';
import { SquarePlus, RefreshCw, Pencil, Trash2, X } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import { useApi } from '../../utils/useApi';

const Ledpage = ({ setmodal, setdisable, isledupdate, setisledupdate }) => {
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
  const { request, loading } = useApi();

  useEffect(() => {
    dispatch(setloader(loading))
  }, [loading])

  // Add ledger
  const add = async () => {
    if (!ledinp.ledger) {
      return toast.warn("Ledger Can't be Blank", { autoClose: 1300 });
    }

    if (!ledinp.budget) {
      return toast.warn("Budget Can't be Blank", { autoClose: 1300 });
    }

    try {
      const res = await request({
        url: 'addledger',
        method: 'POST',
        body: { ledger: ledinp.ledger, budget: parseFloat(ledinp.budget) },
      });

      toast.success(res.message, { autoClose: 1300 });
      dispatch(userdata());
      setledinp(init);
      setdisable(false);
    } catch (error) {
      setdisable(false);
    }
  };

  // Update ledger
  const updat = async () => {
    if (!ledinp.ledger) return toast.warn("Ledger Can't be Blank", { autoClose: 1300 });

    const ledger_id = ledinp.ind;
    const newledger = ledinp.ledger;
    const newbudget = parseFloat(ledinp.budget);

    const token = localStorage.getItem("token");

    setdisable(true);
    try {
      const res = await request({
        url: 'updateledger',
        method: 'POST',
        body: {
          ledger_id,
          newledger,
          newbudget
        },
      });

      toast.success(res.message, { autoClose: 1300 });
      setledinp(init);
      setinsupdat(false);
      dispatch(userdata());

    } catch (error) {
    } finally {
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

        setdisable(true);
        try {
          const res = await request({
            url: 'deleteledger',
            method: 'POST',
            body: { ledgerid: id },
          });

          toast.success(res.message, { autoClose: 1300 });
          dispatch(userdata());
        } catch (error) {
        } finally {
          setdisable(false);
        }
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
    if (event.target.classList.contains('ledpage-overlay')) {
      setisledupdate(false);
    }
  };

  return (
    <div className="ledpage-overlay absolute top-0 left-0 w-full h-full bg-white/20 dark:bg-black/40 backdrop-blur-[5px] z-[110]" onClick={sdef} style={{ display: isledupdate ? "block" : "none" }}>
      <div className="absolute top-1/2 left-1/2 w-[500px] h-max rounded-[20px] -translate-x-1/2 -translate-y-1/2 shadow-[10px_10px_20px_rgba(0,0,0,0.4)] bg-[var(--maincolor)] dark:bg-slate-900 overflow-hidden flex flex-col items-center max-sm:top-[35%] max-sm:w-[95vw] max-sm:h-[520px]">
        <button
          onClick={() => setisledupdate(false)}
          className="absolute top-2 right-3 text-white/60 hover:text-red-400 transition-colors cursor-pointer p-1"
          title="Close"
        >
          <X size={26} />
        </button>
        <h2 className="w-full text-center h-[40px] leading-[40px] text-[aliceblue] capitalize bg-[var(--maincolor)] dark:bg-slate-900 max-sm:text-[20px]">Hi, {useralldetail?.user?.name}</h2>

        <span className='w-full flex flex-col items-center pt-[5px] pb-[20px] rounded-t-[30px] bg-surface min-h-[400px]'>
          <div className="flex w-[95%] h-[60px] items-center justify-around gap-[5px] p-[8px] rounded-[20px] mb-[15px]">
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
                disabled={loading}
                title='Add'
                onClick={updat}
                startIcon={<RefreshCw />}
                variant="contained"
              >
                Update
              </Button>
            ) : (
              <Button
                size='small'
                className='btne'
                disabled={loading}
                title='Add'
                onClick={add}
                startIcon={<SquarePlus />}
                variant="contained"
              >
                Add
              </Button>
            )}
          </div>

          <div className="w-[95%] h-[270px] max-sm:h-[380px] rounded-[20px] border border-dotted border-border-subtle overflow-y-auto overflow-x-hidden">
            <table className="w-full h-fit p-[5px_2px] text-center rounded-[20px] bg-surface text-content">
              <thead>
                <tr>
                  <th className="w-1/2">Ledger</th>
                  <th className="w-[10%]">Budget</th>
                  <th className="w-[10%]">Edit</th>
                  <th className="w-[10%]">Delete</th>
                </tr>
              </thead>
              <tbody>
                {useralldetail.ledgerlist && useralldetail.ledgerlist.map((val, ind) => (
                  <tr key={ind}>
                    <td>{val.ledger}</td>
                    <td>{val.budget}</td>
                    <td>
                      <Pencil
                        className='p-[2px_5px] box-content w-[15px] h-[15px] rounded-[.2rem] cursor-pointer text-[var(--editicon)] bg-[rgba(7,121,182,0.116)] hover:bg-[var(--editicon)] hover:text-[var(--background)]'
                        title='Edit'
                        onClick={() => setledgerininput(val._id, val.ledger, val.budget)}
                      />
                    </td>
                    <td>
                      <Trash2
                        className='p-[2px_5px] box-content w-[15px] h-[15px] rounded-[.2rem] cursor-pointer text-[var(--deleteicon)] bg-[rgba(182,7,16,0.116)] hover:bg-[var(--deleteicon)] hover:text-white'
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
