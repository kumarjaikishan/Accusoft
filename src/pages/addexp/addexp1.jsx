import React, { useEffect, useState } from 'react';
import './addexp1.css';
import swal from 'sweetalert';
import Pagination from './pagination';
import Modalbox from './modalbox';
import Ledpage from './ledpage';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata, addexpense } from '../../store/api'
import { toast } from 'react-toastify';
import apiWrapper from './apiWrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { MdKeyboardArrowDown, MdAddBox, MdOutlineDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line, RiDeleteBin6Fill } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { FaBook } from 'react-icons/fa6';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { useMediaQuery } from '@mui/material';
import DataTable from 'react-data-table-component';

dayjs.extend(utc);
dayjs.extend(timezone);


const AddExpenses = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const userAllDetails = useSelector((state) => state.userexplist);

  const [searchInput, setSearchInput] = useState('');
  const [finalsearch, setfinalserach] = useState('');
  const isAnimatingRef = React.useRef(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable, setdisable] = useState(false);
  const [isLedgerUpdate, setIsLedgerUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

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
      [field]: e.target.value
    });
  };

  const capitalize = (value) => {
    const words = value.split(' ');
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  // Add expense
  const submitExpense = async () => {
    let { ledger, date, amount, narration } = expenseInput;
    // console.log(dayjs(date))
    // console.log(dayjs(date).format())
    // console.log(dayjs(date).toISOString())
    // return

    if (!ledger || !date || !amount || !narration) {
      const shakeElement = document.querySelector('.box');
      shakeElement.classList.add('shake');
      setTimeout(() => shakeElement.classList.remove('shake'), 420);
      dispatch(setloader(false));
      return toast.warn('Kindly Fill all Fields', { autoClose: 1700 });
    }
    // console.log(date)
    // console.log(dayjs(date).startOf("day").toDate())
    const url = `${import.meta.env.VITE_API_ADDRESS}addexpense`;
    const method = 'POST';
    const body = {
      ledger,
      date,
      amount,
      narration: capitalize(narration)
    };

    let ledgername = userAllDetails.ledgerlist.find(item => item._id === ledger);
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

    const notsuccessAction = (data) => toast.warn(data.message, { autoClose: 1800 });
    const loaderAction = (isLoading) => dispatch(setloader(isLoading));

    await apiWrapper({ url, method, body, dispatch, successAction, loaderAction, notsuccessAction, navigate });
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
    isAnimatingRef.current = true;
    sendDeleteRequest([expenseId]);
  };

  const deletemanyExpense = () => {
    console.log(selectedRowIds)
    // sendDeleteRequest(itemIds);
  };

  const sendDeleteRequest = async (itemIds) => {
    if (itemIds.length < 1) {
      return toast.warn('Kindly Select Atlest 1 Entry', { autoClose: 1700 });
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
          document.querySelectorAll('#tablecontent input:checked').forEach((item) => (item.checked = false));
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 100);
        };

        const notsuccessAction = (data) => toast.warn(data.message, { autoClose: 1800 });
        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper({ url, method, body, dispatch, successAction, loaderAction, navigate, notsuccessAction });
      }
    });
  };

  // ✅ Filter first, then paginate
  const filteredExpenses = userAllDetails?.explist?.filter((item) => {
    return (
      finalsearch === '' ||
      item.narration.toLowerCase().includes(finalsearch) ||
      item.ledger.ledger.toLowerCase().includes(finalsearch) ||
      item.amount.toString().includes(finalsearch)
    );
  }) || [];

  const columns = isMobile ? [
    {
      name: 'S.No',
      cell: (row, index) => index + 1,
      width: '43px',
    },
    {
      name: 'Ledger',
      selector: row => row.ledger.ledger,
      sortable: true,
      width: '70px',
      cell: row => <span className="caps">{row.ledger.ledger}</span>
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      sortable: true,
      width: '60px',
    },
    {
      name: 'Narration',
      selector: row => row.narration,
      width: '280px',
      wrap: true
    },
    {
      name: 'Date',
      selector: row => dayjs(row.date).format('DD MMM, YYYY'),
      sortable: true,
      width: '100px',
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <HiPencilSquare title="Edit" onClick={() => setDataForEdit(row)} className='editicon ico' />
          <RiDeleteBin6Line title="Delete" onClick={() => deleteExpense(row._id)} className='deleteicon ico' />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '60px',
    },
  ] : [
    {
      name: 'S.No',
      cell: (row, index) => index + 1,
      width: '43px',
    },
    {
      name: 'Ledger',
      selector: row => row.ledger.ledger,
      sortable: true,
      width: '120px',
      cell: row => <span className="caps">{row.ledger.ledger}</span>
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Narration',
      selector: row => row.narration,
      grow: 1,   // take remaining width
      wrap: true // wrap text to new line
    },
    {
      name: 'Date',
      selector: row => dayjs(row.date).format('DD MMM, YYYY'),
      sortable: true,
      width: '110px',
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <HiPencilSquare title="Edit" onClick={() => setDataForEdit(row)} className='editicon ico' />
          <RiDeleteBin6Line title="Delete" onClick={() => deleteExpense(row._id)} className='deleteicon ico' />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '65px',
    },
  ];

  const customStyles = {
    rows: { style: { minHeight: '35px' } },
    headCells: {
      style: {
        backgroundColor: '#0a3d62',
        color: '#fff',
        padding: '5px'
      },
    },
    cells: {
      style: { padding: '5px' },
    },
    headRow: {
      style: {
        borderBottom: '2px solid #ddd',
        borderTop: '2px solid #ddd',
        backgroundColor: '#999',
      },
    },
  };

  const handleSelectedRowsChange = ({ selectedRows }) => {
    // Extract only IDs
    // console.log(selectedRows)
    setSelectedRowIds(selectedRows.map(e=> e._id))
  };

    const manualRow = {
        ledger: {ledger:'total'},
       amount:25000,
    };
    const tableData = [...filteredExpenses, manualRow];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '-100%' }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={isModalOpen || isLedgerUpdate ? 'exp ismodal' : 'exp'}
      >
        <div className="add">
          {selectedRowIds.length > 0 && <Button className="flex-1" variant='contained' onClick={deletemanyExpense} color="error" startIcon={<MdOutlineDelete />} >Delete ({selectedRowIds.length})</Button>}
          <Button title='Add Expense' onClick={() => setIsModalOpen(true)} startIcon={<MdAddBox />} variant="contained">Add Expense</Button>
          <Button title='Ledger' onClick={() => setIsLedgerUpdate(true)} startIcon={<FaBook />} variant="outlined">Ledger</Button>
        </div>
        <div className="head">
          <span>Expense List </span>
          <span>
            <input type="text" title='Search' onChange={(e) => setSearchInput(e.target.value)} value={searchInput} placeholder="Type to search..." />
            <span title='clear' onClick={() => setSearchInput('')}><IoCloseSharp /></span>
          </span>
        </div>
        <div className="table">
          <DataTable
            columns={columns}
            data={filteredExpenses}
            selectableRows
            onSelectedRowsChange={handleSelectedRowsChange}
            pagination
            highlightOnHover
            customStyles={customStyles}
            noDataComponent={<div>No records found</div>}
          />
        </div>
        <div className="foot">

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
        <Ledpage navigate={navigate} setmodal={setIsModalOpen} setdisable={setdisable} disable={disable} setisledupdate={setIsLedgerUpdate} isledupdate={isLedgerUpdate} />
      </motion.div>
    </>
  );
};

export default AddExpenses;
