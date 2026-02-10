import React, { useEffect, useMemo, useState } from 'react';
import './addexp.css';
import swal from 'sweetalert';
import Pagination from './pagination';
import Modalbox from './modalbox';
import Ledpage from './ledpage';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata, addexpense } from '../../store/api'
import { toast } from 'react-toastify';
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
import { BiLoaderAlt } from "react-icons/bi";
import { useApi } from '../../utils/useApi';
import { useForm } from '../../utils/useForm';

dayjs.extend(utc);
dayjs.extend(timezone);

const capitalize = (value) => {
  const words = value.split(' ');
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const AddExpenses = () => {
  // console.log('%c🔄 AddExpenses re-render', 'color:red;font-weight:bold');

  const renderCount = React.useRef(0);
  renderCount.current++;
  // console.log(`🧮 render count → ${renderCount.current}`);

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const explist = useSelector((state) => state.userexplist.explist);

  // console.log('🟣 redux userexplist length:', explist?.length);

  const [searchInput, setSearchInput] = useState('');
  const [finalsearch, setfinalserach] = useState('');
  const isAnimatingRef = React.useRef(false);

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable, setdisable] = useState(false);
  const [isLedgerUpdate, setIsLedgerUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // console.log('📦 state snapshot:', {
  //   searchInput,
  //   finalsearch,
  //   isModalOpen,
  //   isLedgerUpdate,
  //   currentPage,
  //   postsPerPage,
  //   isSearching
  // });

  const init = {
    _id: '',
    ledger: '',
    date: dayjs().format('YYYY-MM-DD'),
    amount: '',
    narration: '',
  };

  const { fields, handlechange, reset, editfields } = useForm(init)
  const { request, loading } = useApi();
  const { request: delrequest, loading: delloading } = useApi();

  useEffect(() => {
    // console.log('⚡ useEffect → loader change', { loading, delloading });
    dispatch(setloader(loading || delloading));
  }, [loading, delloading]);

  useEffect(() => {
    // console.log('⌛ useEffect → search debounce fired:', searchInput);
    setIsSearching(true)

    if (searchInput === '') {
      setfinalserach('');
      setIsSearching(false)
      return;
    }

    const timerId = setTimeout(() => {
      setfinalserach(searchInput.toLowerCase());
      setIsSearching(false)
    }, 1200);

    return () => clearTimeout(timerId);
  }, [searchInput]);

  const submitExpense = async () => {
    let { ledger, date, amount, narration } = fields;

    if (!ledger || !date || !amount || !narration) {
      const shakeElement = document.querySelector('.box');
      shakeElement.classList.add('shake');
      setTimeout(() => shakeElement.classList.remove('shake'), 420);
      dispatch(setloader(false));
      return toast.warn('Kindly Fill all Fields', { autoClose: 1700 });
    }

    const res = await request({
      url: 'addexpense',
      method: 'POST',
      body: { ledger, date, amount, narration: capitalize(narration) },
    });

    toast.success(res?.message, { autoClose: 1300 });
    dispatch(userdata());
    setIsModalOpen(false);
    reset();
  };

  const setDataForEdit = (expense) => {
    // console.log('✏️ edit clicked:', expense._id);
    const newobj = {
      _id: expense._id,
      ledger: expense.ledger._id,
      date: dayjs(expense.date).format('YYYY-MM-DD'),
      amount: expense.amount,
      narration: expense.narration,
    }
    editfields(newobj)
    setIsUpdateMode(true);
    setIsModalOpen(true);
  };

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
        const res = await delrequest({
          url: 'delmany',
          method: 'POST',
          body: { id: itemIds },
        });

        toast.success(res?.message, { autoClose: 1800 });
        dispatch(userdata());
        document.querySelectorAll('#tablecontent input:checked').forEach((item) => (item.checked = false));
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 100);
        highlight();
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
    // console.log('📏 page size changed:', e.target.value);
    setPostsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const changePageNumber = (pageNumber) => {
    // console.log('📄 page changed:', pageNumber);
    setCurrentPage(pageNumber);
  };

  const highlight = () => {
    // console.log('🎨 highlight rows');
    const checkboxes = document.querySelectorAll('#tablecontent input');
    const tableRows = document.querySelectorAll('#tablecontent div');
    checkboxes.forEach((checkbox, index) => {
      const parentRow = tableRows[index];
      checkbox.checked ? parentRow.classList.add('checked') : parentRow.classList.remove('checked');
    });
  };


  const filteredExpenses = React.useMemo(() => {
    // console.log('📄 filtering expenses (memoized)');
    return explist?.filter((item) => {
      return (
        finalsearch === '' ||
        item.narration.toLowerCase().includes(finalsearch) ||
        item.ledger.ledger.toLowerCase().includes(finalsearch) ||
        item.amount.toString().includes(finalsearch)
      );
    }) || [];
  }, [explist, finalsearch]);


  const { currentPosts, firstPostIndex, lastPostIndex } = useMemo(() => {
    // console.log('📄 paginating expenses (memoized)');

    const last = currentPage * postsPerPage;
    const first = last - postsPerPage;

    return {
      firstPostIndex: first,
      lastPostIndex: last,
      currentPosts: filteredExpenses.slice(first, last),
    };
  }, [filteredExpenses, currentPage, postsPerPage]);


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
            {isSearching ? <span title='Searching' >  <BiLoaderAlt className='spin' /> </span>
              :
              <span title='clear' onClick={() => setSearchInput('')}>   <IoCloseSharp /></span>}
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
                  {currentPosts.reduce((acc, expense) => acc + expense.amount, 0)}
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
          disable={loading}
          reset={reset}
          setisupdate={setIsUpdateMode}
          setmodal={setIsModalOpen}
          sub={submitExpense}
          modal={isModalOpen}
          handlechange={handlechange}
          fields={fields}
          isupdate={isUpdateMode}
          navigate={navigate}
        />

        <Ledpage navigate={navigate} setmodal={setIsModalOpen} setdisable={setdisable} disable={disable} setisledupdate={setIsLedgerUpdate} isledupdate={isLedgerUpdate} />
      </motion.div>
    </>
  );
};

export default AddExpenses;
