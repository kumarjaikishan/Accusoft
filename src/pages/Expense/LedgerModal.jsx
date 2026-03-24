import React, { useEffect, useState } from 'react';
import { SquarePlus, RefreshCw, Pencil, Trash2, X } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import TextField from '@mui/material/TextField';
import LoadingButton from '../../components/LoadingButton';

import { useApi } from '../../utils/useApi';
import Modalbox from '../../components/custommodal/Modalbox';
import DataTable from 'react-data-table-component';
import { useTableStyles } from '../../components/dataTableStyle';

const LedgerModal = ({ setdisable, isledupdate, setisledupdate }) => {
  const dispatch = useDispatch();
  const useralldetail = useSelector((state) => state.userexplist);

  const [isupda, setinsupdat] = useState(false);

  const init = {
    ind: '',
    ledger: '',
    budget: ''
  };
  const [ledinp, setledinp] = useState(init);

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
  }, [loading, dispatch])

  const add = async () => {
    if (!ledinp.ledger) {
      return toast.warn("Ledger Can't be Blank", { autoClose: 1300 });
    }

    if (!ledinp.budget) {
      return toast.warn("Budget Can't be Blank", { autoClose: 1300 });
    }

    const toastId = toast.loading("Adding ledger...");
    try {
      const res = await request({
        url: 'addledger',
        method: 'POST',
        body: { ledger: ledinp.ledger, budget: parseFloat(ledinp.budget) },
      });

      toast.update(toastId, { 
        render: res.message || "Ledger Added Successfully", 
        type: "success", 
        isLoading: false, 
        autoClose: 1300 
      });
      dispatch(userdata());
      setledinp(init);
    } catch (error) {
      toast.update(toastId, { 
        render: error?.message || "Failed to add ledger", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
      console.error(error);
    }
  };

  const updat = async () => {
    if (!ledinp.ledger) return toast.warn("Ledger Can't be Blank", { autoClose: 1300 });

    const ledger_id = ledinp.ind;
    const newledger = ledinp.ledger;
    const newbudget = parseFloat(ledinp.budget);

    const toastId = toast.loading("Updating ledger...");
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

      toast.update(toastId, { 
        render: res.message || "Ledger Updated Successfully", 
        type: "success", 
        isLoading: false, 
        autoClose: 1300 
      });
      setledinp(init);
      setinsupdat(false);
      dispatch(userdata());

    } catch (error) {
      toast.update(toastId, { 
        render: error?.message || "Failed to update ledger", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
      console.error(error);
    }
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
        try {
          const toastId = toast.loading("Deleting ledger...");
          const res = await request({
            url: 'deleteledger',
            method: 'POST',
            body: { ledgerid: id },
          });

          toast.update(toastId, { 
            render: res.message || "Ledger Deleted Successfully", 
            type: "success", 
            isLoading: false, 
            autoClose: 1300 
          });
          dispatch(userdata());
        } catch (error) {
          toast.update(toastId, { 
            render: error?.message || "Failed to delete ledger", 
            type: "error", 
            isLoading: false, 
            autoClose: 3000 
          });
          console.error(error);
        }
      }
    });
  };

  const setledgerininput = (id, ledgerName, budget) => {
    setledinp({
      ind: id,
      ledger: ledgerName,
      budget: budget
    });
    setinsupdat(true);
  };

  const customStyles = useTableStyles();

  const columns = [
    {
      name: 'Ledger',
      selector: row => row.ledger,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Budget',
      selector: row => `₹${row.budget}`,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className='flex gap-2'>
          <Pencil
            className='p-[2px_5px] box-content w-[15px] h-[15px] rounded-[.2rem] cursor-pointer text-[var(--editicon)] bg-[rgba(7,121,182,0.116)] hover:bg-[var(--editicon)] hover:text-white'
            title='Edit'
            onClick={() => setledgerininput(row._id, row.ledger, row.budget)}
          />
          <Trash2
            className='p-[2px_5px] box-content w-[15px] h-[15px] rounded-[.2rem] cursor-pointer text-[var(--deleteicon)] bg-[rgba(182,7,16,0.116)] hover:bg-[var(--deleteicon)] hover:text-white'
            title='Delete'
            onClick={() => deletee(row._id)}
          />
        </div>
      ),
      button: true,
    },
  ];

  return (
    <Modalbox open={isledupdate} onClose={() => setisledupdate(false)}>
      <div className="w-[500px] h-[520px] max-sm:w-[95vw] max-sm:h-[520px] rounded-[20px] bg-[var(--maincolor)] overflow-hidden flex flex-col items-center relative">

        {/* Close Button */}
        <button
          onClick={() => setisledupdate(false)}
          className="absolute top-2 right-3 text-white/60 hover:text-red-400 transition-colors cursor-pointer p-1"
          title="Close"
        >
          <X size={26} />
        </button>

        {/* Header */}
        <h2 className="w-full text-center h-[40px] leading-[40px] font-bold text-2xl text-[aliceblue] capitalize bg-[var(--maincolor)] max-sm:text-[20px]">
          Hi, {useralldetail?.user?.name}
        </h2>

        {/* Content Section */}
        <div className="w-full flex flex-col flex-1 items-center pt-[5px] pb-[20px] rounded-t-[30px] border-t border-white/20 bg-surface min-h-0">

          {/* Input Row */}
          <div className="flex w-[95%] h-[60px] items-center justify-around gap-[5px] p-[8px] rounded-[20px] mb-[15px]">

            <TextField
              label="Enter Ledger"
              size="small"
              variant="outlined"
              style={{ width: "250px" }}
              value={ledinp.ledger}
              onChange={handleLedger}
              className="inpe"
            />

            <TextField
              label="Budget"
              size="small"
              variant="outlined"
              value={ledinp.budget}
              style={{ width: "100px" }}
              onChange={handleBudget}
              className="inpe"
              type="number"
            />

            {isupda ? (
              <LoadingButton
                loading={loading}
                onClick={updat}
                icon={RefreshCw}
                className="px-2 py-1 text-xs"
              >
                Update
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={loading}
                onClick={add}
                icon={SquarePlus}
                className="px-2 py-1 text-xs"
              >
                Add
              </LoadingButton>
            )}
          </div>

          {/* Table Section */}
          <div className="w-[95%] flex-1 rounded-[20px] border-2 border-dotted border-[var(--theme-border)] overflow-hidden min-h-0">

            <DataTable
              columns={columns}
              data={useralldetail?.ledgerlist || []}
              customStyles={customStyles}
              fixedHeader
              fixedHeaderScrollHeight="100%"
              highlightOnHover
              pointerOnHover
              noDataComponent={
                <p className="p-4 text-slate-500">No ledgers found</p>
              }
            />

          </div>
        </div>
      </div>
    </Modalbox>
  );
};

export default LedgerModal;
