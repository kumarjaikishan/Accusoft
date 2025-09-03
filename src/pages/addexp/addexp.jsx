import React, { useEffect, useState } from 'react';
import './addexp.css';
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
import { MdKeyboardArrowDown, MdAddBox } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line, RiDeleteBin6Fill } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { FaBook } from 'react-icons/fa6';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);


const AddExpenses = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const userAllDetails = useSelector((state) => state.userexplist);

  const [searchInput, setSearchInput] = useState('');
  const [finalsearch, setfinalserach] = useState('');
  const isAnimatingRef = React.useRef(false);

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable, setdisable] = useState(false);
  const [isLedgerUpdate, setIsLedgerUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const selectedItems = document.querySelectorAll('#tablecontent input:checked');
    const itemIds = Array.from(selectedItems).map((item) => item.id);
    sendDeleteRequest(itemIds);
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
          highlight();
        };

        const notsuccessAction = (data) => toast.warn(data.message, { autoClose: 1800 });
        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper({ url, method, body, dispatch, successAction, loaderAction, navigate, notsuccessAction });
      }
    });
  };

  const selectAllCheckbox = () => {
    const selectAllCheckbox = document.querySelector('#allcheck');
    const checkboxes = document.querySelectorAll('#tablecontent input');
    checkboxes.forEach((checkbox) => (checkbox.checked = selectAllCheckbox.checked));
    highlight();
  };

  const handlePageSizeChange = (e) => {
    setPostsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const changePageNumber = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const highlight = () => {
    const checkboxes = document.querySelectorAll('#tablecontent input');
    const tableRows = document.querySelectorAll('#tablecontent div');
    checkboxes.forEach((checkbox, index) => {
      const parentRow = tableRows[index];
      checkbox.checked ? parentRow.classList.add('checked') : parentRow.classList.remove('checked');
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

  let lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredExpenses.slice(firstPostIndex, lastPostIndex);

  // Sorting logic (optional: still works on current page only)
  const [sortOrder, setSortOrder] = useState('ASC');

  const container = { visible: { transition: { delayChildren: .1 } } };

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
          <Button title='Add Expense' onClick={() => setIsModalOpen(true)} startIcon={<MdAddBox />} variant="contained">Add Expense</Button>
          <Button title='Ledger' onClick={() => setIsLedgerUpdate(true)} startIcon={<FaBook />} variant="outlined">Ledger</Button>
        </div>
        <div className="head">
          <span>Expense List </span>
          <span>
            Record :{' '}
            <select title='Items Per Page' value={postsPerPage} onChange={handlePageSizeChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
            </select>
          </span>
          <span>
            <input type="text" title='Search' onChange={(e) => setSearchInput(e.target.value)} value={searchInput} placeholder="Type to search..." />
            <span title='clear' onClick={() => setSearchInput('')}><IoCloseSharp /></span>
          </span>
        </div>
        <div className="table">
          <div className="header">
            <span>S.no</span>
            <span>Ledger</span>
            <span>Amt. </span>
            <span>Narration</span>
            <span>Date </span>
            <span>Action</span>
            <span><input type="checkbox" onClick={selectAllCheckbox} id="allcheck" /></span>
          </div>
          <motion.div variants={container} initial="hidden" animate="visible" className="body" id="tablecontent">
            {filteredExpenses.length < 1 && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                <b>No Expense Added</b>
              </div>
            )}
            <AnimatePresence>
              {currentPosts.map((expense, index) => (
                <motion.div
                  exit={isAnimatingRef.current ? { opacity: 1, x: '-102%', transition: { duration: 0.6 } } : {}}
                  key={expense._id}
                >
                  <span>{firstPostIndex + index + 1}</span>
                  <span className='caps'>{expense.ledger.ledger}</span>
                  <span>{expense.amount}</span>
                  <span>{expense.narration}</span>
                  <span>{dayjs(expense.date).format('DD MMM, YYYY')}</span>
                  <span>
                    <HiPencilSquare title="Edit" onClick={() => setDataForEdit(expense)} className='editicon ico' />
                    <RiDeleteBin6Line title="Delete" onClick={() => deleteExpense(expense._id)} className='deleteicon ico' />
                  </span>
                  <span><input type="checkbox" title='select' onClick={highlight} id={expense._id} /></span>
                </motion.div>
              ))}
              <div id="foot">
                <span></span>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 700 }} id="totalhere">
                  {filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0)}
                </span>
                <span></span>
                <span></span>
                <span colSpan="1" id="alldelete" title="Delete Selected Item">
                  <RiDeleteBin6Fill onClick={deletemanyExpense} />
                </span>
                <span></span>
              </div>
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="foot">
          <span>
            Showing Result From {filteredExpenses.length === 0 ? 0 : firstPostIndex + 1} To{' '}
            {lastPostIndex >= filteredExpenses.length ? filteredExpenses.length : lastPostIndex} of{' '}
            {filteredExpenses.length} Results
          </span>
          <span>
            Pages :
            <Pagination currentpage={currentPage} changepageno={changePageNumber} totalpost={filteredExpenses.length} postperpage={postsPerPage} />
          </span>
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
