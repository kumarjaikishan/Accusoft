import React, { useEffect, useState, useMemo } from 'react';
import './addexp1.css';
import swal from 'sweetalert';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api';
import { toast } from 'react-toastify';
import apiWrapper from './apiWrapper';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { MdAddBox, MdOutlineDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { FaBook } from 'react-icons/fa6';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { useMediaQuery } from '@mui/material';
import {
  DataGrid,
  GridFooterContainer,
  GridFooter,
} from '@mui/x-data-grid';

import Modalbox from './modalbox';
import Ledpage from './ledpage';

dayjs.extend(utc);
dayjs.extend(timezone);

const AddExpenses = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const userAllDetails = useSelector((state) => state.userexplist);

  const [searchInput, setSearchInput] = useState('');
  const [finalsearch, setfinalserach] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable, setdisable] = useState(false);
  const [isLedgerUpdate, setIsLedgerUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const isMobile = useMediaQuery('(max-width:600px)');

  const init = {
    _id: '',
    ledger: '',
    date: dayjs().format('YYYY-MM-DD'),
    amount: '',
    narration: '',
  };
  const [expenseInput, setExpenseInput] = useState(init);

  useEffect(() => {
    dispatch(setloader(false));
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setfinalserach(searchInput.toLowerCase());
    }, 1300);
    return () => clearTimeout(timerId);
  }, [searchInput]);

  const handleInputChange = (e, field) => {
    setExpenseInput({
      ...expenseInput,
      [field]: e.target.value,
    });
  };

  const capitalize = (value) => {
    const words = value.split(' ');
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Add expense
  const submitExpense = async () => {
    let { ledger, date, amount, narration } = expenseInput;
    if (!ledger || !date || !amount || !narration) {
      toast.warn('Kindly Fill all Fields', { autoClose: 1700 });
      dispatch(setloader(false));
      return;
    }

    const url = `${import.meta.env.VITE_API_ADDRESS}addexpense`;
    const method = 'POST';
    const body = {
      ledger,
      date,
      amount,
      narration: capitalize(narration),
    };

    let ledgername = userAllDetails.ledgerlist.find(
      (item) => item._id === ledger
    );
    const newExpense = {
      _id: `temp-${Date.now()}`,
      ledger: { _id: ledger, ledger: ledgername.ledger },
      date,
      amount,
      narration: capitalize(narration),
    };

    const successAction = (data) => {
      toast.success(data.message, { autoClose: 1300 });
      dispatch(userdata());
      setIsModalOpen(false);
      setExpenseInput(init);
    };

    const notsuccessAction = (data) =>
      toast.warn(data.message, { autoClose: 1800 });
    const loaderAction = (isLoading) => dispatch(setloader(isLoading));

    await apiWrapper({
      url,
      method,
      body,
      dispatch,
      successAction,
      loaderAction,
      notsuccessAction,
      navigate,
    });
  };

  // Edit expense
  const setDataForEdit = (expense) => {
    setExpenseInput({
      _id: expense._id,
      ledger: expense.ledger._id,
      date: dayjs(expense.date).format('YYYY-MM-DD'),
      amount: expense.amount,
      narration: expense.narration,
    });
    setIsUpdateMode(true);
    setIsModalOpen(true);
  };

  // Delete expense
  const deleteExpense = (expenseId) => {
    sendDeleteRequest([expenseId]);
  };

  const deletemanyExpense = () => {
    sendDeleteRequest(selectedRowIds);
  };

  const sendDeleteRequest = async (itemIds) => {
    if (itemIds.length < 1) {
      return toast.warn('Kindly Select Atleast 1 Entry', { autoClose: 1700 });
    }

    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this Data!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const url = `${import.meta.env.VITE_API_ADDRESS}delmany`;
        const method = 'POST';
        const body = { id: itemIds };

        const successAction = (data) => {
          toast.success(data.message, { autoClose: 1300 });
          dispatch(userdata());
        };

        const notsuccessAction = (data) =>
          toast.warn(data.message, { autoClose: 1800 });
        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper({
          url,
          method,
          body,
          dispatch,
          successAction,
          loaderAction,
          navigate,
          notsuccessAction,
        });
      }
    });
  };

  // ✅ Filter data
  const filteredExpenses =
    userAllDetails?.explist?.filter((item) => {
      return (
        finalsearch === '' ||
        item.narration.toLowerCase().includes(finalsearch) ||
        item.ledger.ledger.toLowerCase().includes(finalsearch) ||
        item.amount.toString().includes(finalsearch)
      );
    }) || [];

  // ✅ Columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'S.No', width: 70 },
    {
      field: 'ledger',
      headerName: 'Ledger',
      width: 150,
      renderCell: (params) => <span className="caps">{params.value}</span>,
    },
    { field: 'amount', headerName: 'Amount', width: 100, type: 'number' },
    { field: 'narration', headerName: 'Narration', flex: 1 },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      valueGetter: (params) => dayjs(params.value).format('DD MMM, YYYY'),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <HiPencilSquare
            title="Edit"
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevent row selection
              setDataForEdit(params.row);
            }}
            className="editicon ico"
          />
          <RiDeleteBin6Line
            title="Delete"
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevent row selection
              deleteExpense(params.row._id);
            }}
            className="deleteicon ico"
          />
        </>
      ),
    },
  ];

  // ✅ Transform data for DataGrid
  const rows = filteredExpenses.map((item, index) => ({
    id: index + 1,
    _id: item._id,
    ledger: item.ledger.ledger,
    amount: item.amount,
    narration: item.narration,
    date: item.date,
  }));

  // ✅ Compute total of visible rows
  const visibleTotal = useMemo(() => {
    return rows.reduce((sum, row) => sum + Number(row.amount), 0);
  }, [rows]);

  // ✅ Custom footer with sum
  function CustomFooter({ visibleTotal }) {
    return (
      <GridFooterContainer>
        <div style={{ flex: 1, textAlign: "right", padding: "10px", fontWeight: "bold" }}>
          Page Total: {visibleTotal}
        </div>
        <GridFooter /> {/* ✅ keeps default pagination / footer */}
      </GridFooterContainer>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={isModalOpen || isLedgerUpdate ? 'exp ismodal' : 'exp'}
    >
      <div className="add">
        {selectedRowIds.length > 0 && (
          <Button
            className="flex-1"
            variant="contained"
            onClick={deletemanyExpense}
            color="error"
            startIcon={<MdOutlineDelete />}
          >
            Delete ({selectedRowIds.length})
          </Button>
        )}
        <Button
          title="Add Expense"
          onClick={() => setIsModalOpen(true)}
          startIcon={<MdAddBox />}
          variant="contained"
        >
          Add Expense
        </Button>
        <Button
          title="Ledger"
          onClick={() => setIsLedgerUpdate(true)}
          startIcon={<FaBook />}
          variant="outlined"
        >
          Ledger
        </Button>
      </div>

      <div className="head">
        <span>Expense List </span>
        <span>
          <input
            type="text"
            title="Search"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            placeholder="Type to search..."
          />
          <span title="clear" onClick={() => setSearchInput('')}>
            <IoCloseSharp />
          </span>
        </span>
      </div>

      <div className="table" style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick   // ✅ stops row selection when clicking cells
          isRowSelectable={() => true} // ✅ keeps checkboxes working
          pagination
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } }, // ✅ default page size = 10
          }}
          pageSizeOptions={[10, 20, 50, 100, 300]}
          onRowSelectionModelChange={(ids) => setSelectedRowIds(ids)}
          slots={{
            footer: () => <CustomFooter visibleTotal={visibleTotal} />,
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#0a3d62", // ✅ header background
              color: "#fff",              // ✅ header text color
              fontWeight: "bold",
              fontSize: "0.95rem",
              lineHeight: "1.5rem",
              minHeight: "45px !important",
              maxHeight: "45px !important",
            },
            
          }}
        />
      </div>

      <Modalbox
        init={init}
        setdisable={setdisable}
        disable={disable}
        setinp={setExpenseInput}
        setisupdate={setIsUpdateMode}
        setmodal={setIsModalOpen}
        sub={submitExpense}
        modal={isModalOpen}
        handler={handleInputChange}
        inp={expenseInput}
        isupdate={isUpdateMode}
        navigate={navigate}
      />
      <Ledpage
        navigate={navigate}
        setmodal={setIsModalOpen}
        setdisable={setdisable}
        disable={disable}
        setisledupdate={setIsLedgerUpdate}
        isledupdate={isLedgerUpdate}
      />
    </motion.div>
  );
};

export default AddExpenses;
