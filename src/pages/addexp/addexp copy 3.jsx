import React, { useEffect, useState } from 'react';
import './addexp.css';
import swal from 'sweetalert';
import Pagination from './pagination';
import Modalbox from './modalbox';
import Ledpage from './ledpage';
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata, addexpense } from '../../store/api'
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import apiWrapper from './apiWrapper';
import { AnimatePresence, color, motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdPrint } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import DataTable from 'react-data-table-component';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IoCloseSharp } from "react-icons/io5";

const AddExpenses = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const userAllDetails = useSelector((state) => state.userexplist);
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [finalsearch, setfinalserach] = useState('');
  const isAnimatingRef = React.useRef(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [loading, setLoading] = useState(false);


  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);


  useEffect(() => {
    dispatch(setloader(false))
    // console.log('expcheck', userAllDetails.explist)
    // console.log("date-",dayjs())
    // console.log(isMobile)
    fetchData(1, 100);
  }, [])

  const handlePageChange = page => {
    setCurrentPage(page);
    const loadedPages = Math.ceil(data.length / perPage);
    const maxpageno = Math.ceil(totalRows / perPage);
    if (page == maxpageno) {
      const nextPage = Math.floor(totalRows / 100) + 1;
      console.log("nectpage", nextPage)
      return fetchData(nextPage, 100);
    }

    if (data[((page + 1) * 10) + 1] == undefined) {
      const nextPage = Math.floor((((page + 1) * 10) + 1 + 99) / 100);
      console.log("next page info:", nextPage)
      return fetchData(nextPage, 100);
    }


  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
    fetchData(page, newPerPage);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      // console.log("called");

      setfinalserach(searchInput.toLowerCase());
    }, 1300);

    return () => {
      // console.log("unmount");
      clearTimeout(timerId);
    };
  }, [searchInput]);

  const fetchData = async (page, size = perPage) => {
    // console.log("this fetchdat is called with", page, size);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}explist?page=${page}&limit=${size}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const result = await res.json();
      console.log(result)
      if (result.items.length) {
        if (page === 1) {
          setData(result.items);
          setTotalRows(result.total);
        } else {
          setData((prev)=> [...prev,...result.items])
        }


        console.log(result.items)
      }
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  }


  let itemIds = [];
  const currentDate = new Date();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable, setdisable] = useState(false);


  const init = {
    _id: '',
    ledger: '',
    date: dayjs().format('YYYY-MM-DD'),
    amount: '',
    narration: '',
  }
  const [expenseInput, setExpenseInput] = useState(init);

  const [isLedgerUpdate, setIsLedgerUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e, field) => {
    setExpenseInput({
      ...expenseInput, [field]: e.target.value
    });
  };

  const capitalize = (value) => {
    const words = value.split(' ');
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedWords.join(' ');
  };


  // adding new expense
  const submitExpense = async () => {
    const token = localStorage.getItem('token');
    let { ledger, date, amount, narration } = expenseInput;

    if (!ledger || !date || !amount || !narration) {
      const shakeElement = document.querySelector('.box');
      shakeElement.classList.add('shake');
      setTimeout(() => {
        shakeElement.classList.remove('shake');
      }, 420);
      dispatch(setloader(false));
      return toast.warn('Kindly Fill all Fields', { autoClose: 1700 });
    }

    const url = `${import.meta.env.VITE_API_ADDRESS}addexpense`;
    const method = 'POST';
    const body = {
      ledger,
      date,
      amount,
      narration: capitalize(narration)
    };

    // for optimistic update in expense
    let ledgername = userAllDetails.ledgerlist.find(item => item._id === ledger)
    // console.log(ledgername)
    const newExpense = {
      _id: `temp-${Date.now()}`, // Temporary ID
      ledger: { _id: ledger, ledger: ledgername.ledger }, // Ledger should be an object
      date,
      amount,
      narration: capitalize(narration),
    };

    const successAction = (data) => {
      dispatch(addexpense(newExpense))
      toast.success(data.message, { autoClose: 1300 });
      dispatch(userdata());
      setIsModalOpen(false);
      setExpenseInput(init);
    };

    const notsuccessAction = (data) => {
      toast.warn(data.message, { autoClose: 1800 });
    };

    const loaderAction = (isLoading) => dispatch(setloader(isLoading));

    await apiWrapper({ url, method, body, dispatch, successAction, loaderAction, notsuccessAction, navigate });
  };

  // setting input data on edit button click
  const setDataForEdit = async (expense) => {
    // console.log(expense)
    setExpenseInput({
      _id: expense._id,
      ledger: expense.ledger._id,
      date: expense.date,
      amount: expense.amount,
      narration: expense.narration,
    });
    setIsUpdateMode(true);
    setIsModalOpen(true);
  };

  const deleteExpense = async (expenseId) => {
    isAnimatingRef.current = true;
    itemIds = []
    itemIds.push(expenseId);
    // console.log(itemIds);
    sendDeleteRequest(itemIds);
  };

  const deletemanyExpense = async () => {
    itemIds = []
    const selectedItems = document.querySelectorAll('.rowcheckbox:checked');
    selectedItems.forEach((item) => {
      itemIds.push(item.id);
    });
    // console.log(itemIds);
    sendDeleteRequest(itemIds);
  };

  const sendDeleteRequest = async (itemIds) => {
    if (itemIds?.length < 1) {
      return toast.warn('Kindly Select Atlest 1 Entry', { autoClose: 1700 });
    }
    const token = localStorage.getItem('token');
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

          const selectedItems = document.querySelectorAll('#tablecontent input:checked');

          selectedItems.forEach((item) => {
            item.checked = false;
          });
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 100);
          highlight();
        };

        const notsuccessAction = (data) => {
          toast.warn(data.message, { autoClose: 1800 });
        };

        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper({ url, method, body, dispatch, successAction, loaderAction, navigate, notsuccessAction });
      } else {
        // swal('Your data is safe!');
      }
    });
  };

  const selectAllCheckbox = () => {
    const selectAllCheckbox = document.querySelector('#allcheck');
    const checkboxes = document.querySelectorAll('.rowcheckbox');

    if (selectAllCheckbox.checked) {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
    } else {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }

    highlight();
  };

  const highlight = () => {
    const checkboxes = document.querySelectorAll('.rowcheckbox');
    const tableRows = document.querySelectorAll('.rdt_TableRow');


    checkboxes.forEach((checkbox, index) => {
      const parentRow = tableRows[index];

      if (checkbox.checked) {
        parentRow.classList.add('checked')
      } else {
        parentRow.classList.remove('checked')
      }
    });
  };

  const filteredData = data.filter(item => {
    return (
      finalsearch === '' ||
      item.narration.toLowerCase().includes(finalsearch) ||
      item.ledger.ledger.toLowerCase().includes(finalsearch) ||
      item.amount.toString().includes(finalsearch)
    );
  });

  let lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;

  const firstIndex = (currentPage - 1) * perPage;
  const lastIndex = firstIndex + perPage;
  const currentRecords = filteredData.slice(firstIndex, lastIndex);
  const totalAmount = currentRecords.reduce((sum, item) => sum + Number(item?.amount), 0);


  const voucherpage = (expid) => {
    navigate(`/print/${expid}`);
  }
  const container = {
    visible: {
      transition: {
        delayChildren: .1,
      }
    }
  };

  const item = {
    hidden: { x: '-150%' },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300, //these are by default value, work without using it
        damping: 20
      }
    }
  };

  const columns = isMobile ? [
    {
      name: 'S.No',
      cell: (row, index) => firstPostIndex + index + 1,
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
      name: 'Amt',
      width: '60px',
      selector: row => row.amount,
      sortable: true,
    },
    {
      name: 'Narration',
      selector: row => row.narration,
      // width: '295px',

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
      width: '60px',
      button: true,
      style: {
        display: 'flex',
        justifyContent: 'space-around',
      }
    },
    {
      name: (
        <input
          type="checkbox"
          onClick={selectAllCheckbox}
          id="allcheck"
          title="Select All"
        />
      ),
      cell: row => (
        <input
          type="checkbox"
          title="select"
          id={row._id}
          className="rowcheckbox"
          onClick={highlight}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '35px',
    },
  ] : [
    {
      name: 'S.No',
      cell: (row, index) => firstPostIndex + index + 1,
      width: '43px',
    },
    {
      name: 'Ledger',
      selector: row => row.ledger.ledger,
      sortable: true,
      width: '130px',
      cell: row => <span className="caps">{row.ledger.ledger}</span>
    },
    {
      name: 'Amount',
      width: '80px',
      selector: row => row.amount,
      sortable: true,
    },
    {
      name: 'Narration',
      selector: row => row.narration,
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
      width: '65px',
      button: true,
      style: {
        display: 'flex',
        justifyContent: 'space-around',
      }
    },
    {
      name: (
        <input
          type="checkbox"
          onClick={selectAllCheckbox}
          id="allcheck"
          title="Select All"
        />
      ),
      cell: row => (
        <input
          type="checkbox"
          title="select"
          id={row._id}
          className="rowcheckbox"
          onClick={highlight}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '40px',
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '35px', // or whatever height you need
      },
    },
    headCells: {
      style: {
        backgroundColor: '#0a3d62',
        color: '#fff',
        // border:'0.5px solid #d6d8d985',
        padding: '5px'
      },
    },
    cells: {
      style: {
        padding: '5px', // 👈 This is body cell padding

      },
    },
    headRow: {
      style: {
        borderBottom: '2px solid #ddd',
        borderTop: '2px solid #ddd',
        position: 'sticky',
        top: 0,
        backgroundColor: '#999', // Sticky needs background

      },
    },
  };


  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: '100%' }}  // Initial state
        animate={{ opacity: 1, x: 0 }}  // Animation state
        exit={{ opacity: 0, x: '-100%' }}  // Exit animation
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={isModalOpen || isLedgerUpdate ? 'exp ismodal' : 'exp'}>
        <div className="add">
          <Button size='large' title='Add Expense' onClick={() => setIsModalOpen(true)} startIcon={<MdAddBox />} variant="contained">Add Expense</Button>
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
            data={currentRecords}
            pagination
            paginationServer
            // progressPending={loading}
            // selectableRows={true}
            paginationTotalRows={totalRows}
            paginationPerPage={parseInt(postsPerPage)}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            highlightOnHover
            customStyles={customStyles}
            persistTableHead
            noDataComponent={<div>No records found</div>}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2px 16px',
            paddingBottom: 0,
            borderTop: '1px solid #e0e0e0',
            fontWeight: 'bold',
            background: '#f9f9f9',
          }}
          >
            {/* Left side under checkbox column */}
            <div style={{ width: '120px', marginLeft: '120px' }}>
              ₹ {totalAmount}
            </div>

            {/* Spacer columns */}
            <div style={{ flex: 1 }}></div>

            {/* Total aligned under Amount column */}
            <div className='maindelete'>
              <RiDeleteBin6Fill
                onClick={deletemanyExpense}
                title="Delete Selected"
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
        <Modalbox
          setisledupdate={setIsLedgerUpdate}
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

