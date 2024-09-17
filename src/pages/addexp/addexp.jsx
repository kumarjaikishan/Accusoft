import React, { useEffect, useState } from 'react';
import './addexp.css';
import swal from 'sweetalert';
import Pagination from './pagination';
import Modalbox from './modalbox';
import Ledpage from './ledpage';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api'
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import apiWrapper from './apiWrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';

const AddExpenses = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const userAllDetails = useSelector((state) => state.userexplist);
  const [searchInput, setSearchInput] = useState('');
  const [finalsearch, setfinalserach] = useState('');
  const isAnimatingRef = React.useRef(false);
  

  useEffect(() => {
    dispatch(setloader(false))
  }, [])

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


  let itemIds = [];
  const currentDate = new Date();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable, setdisable] = useState(false);


  const init = {
    _id: '',
    ledger: '',
    date: dayjs(),
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
    date = dayjs(date).format("YYYY-MM-DD");
    // console.log(date);
    // return

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

    const successAction = (data) => {
      toast.success(data.message, { autoClose: 1300 });
      dispatch(userdata());
      dispatch(setloader(false));
      setIsModalOpen(false);
      setExpenseInput(init);
    };

    const loaderAction = (isLoading) => dispatch(setloader(isLoading));

    await apiWrapper(url, method, body, dispatch, successAction, loaderAction, navigate);
  };
  // adding new expense ends here

  // setting input data on edit button click
  const setDataForEdit = async (expense) => {
    setExpenseInput({
      _id: expense._id,
      ledger: expense.ledger._id,
      date: dayjs(expense.date),
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
    const selectedItems = document.querySelectorAll('#tablecontent input:checked');
    selectedItems.forEach((item) => {
      itemIds.push(item.id);
    });
    // console.log(itemIds);
    sendDeleteRequest(itemIds);
  };

  const sendDeleteRequest = async (itemIds) => {
    if (itemIds.length < 1) {
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
          dispatch(setloader(false));
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
        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper(url, method, body, dispatch, successAction, loaderAction, navigate);
      } else {
        // swal('Your data is safe!');
      }
    });
  };

  const selectAllCheckbox = () => {
    const selectAllCheckbox = document.querySelector('#allcheck');
    const checkboxes = document.querySelectorAll('#tablecontent input');

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

  const handlePageSizeChange = (e) => {
    setPostsPerPage(e.target.value);
    setCurrentPage(1);
    setSortedList();
  };

  const changePageNumber = (pageNumber) => {
    setSortedList();
    setCurrentPage(pageNumber);
  };

  const highlight = () => {
    const checkboxes = document.querySelectorAll('#tablecontent input');
    const tableRows = document.querySelectorAll('#tablecontent div');

    checkboxes.forEach((checkbox, index) => {
      const parentRow = tableRows[index];

      if (checkbox.checked) {
        parentRow.style.background = 'rgb(16 135 129)';
        // parentRow.style.background = 'rgb(3, 73, 114)';
        parentRow.style.color = 'white';
      } else {
        parentRow.style.background = 'transparent';
        parentRow.style.color = 'black';
      }
    });
  };

  let lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;

  const currentPosts = userAllDetails.explist?.slice(firstPostIndex, lastPostIndex);
  const [sortedList, setSortedList] = useState();
  const [sortOrder, setSortOrder] = useState('ASC');

  const sortPosts = (column) => {
    if (sortOrder === 'ASC') {
      if (column === 'amount') {
        const sorted = [...currentPosts].sort((a, b) => a[column] - b[column]);
        setSortedList(sorted);
        setSortOrder('DSC');
      } else if (column === 'ledger') {
        const sorted = [...currentPosts].sort((a, b) =>
          a[column].ledger.toLowerCase() > b[column].ledger.toLowerCase() ? 1 : -1
        );
        setSortedList(sorted);
        setSortOrder('DSC');
      } else {
        const sorted = [...currentPosts].sort((a, b) =>
          a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
        );
        setSortedList(sorted);
        setSortOrder('DSC');
      }
    }

    if (sortOrder === 'DSC') {
      if (column === 'amount') {
        const sorted = [...currentPosts].sort((a, b) => b[column] - a[column]);
        setSortedList(sorted);
        setSortOrder('ASC');
      } else if (column === 'ledger') {
        const sorted = [...currentPosts].sort((a, b) =>
          b[column].ledger.toLowerCase() > a[column].ledger.toLowerCase() ? 1 : -1
        );
        setSortedList(sorted);
        setSortOrder('ASC');
      } else {
        const sorted = [...currentPosts].sort((a, b) =>
          a[column].toLowerCase() < b[column].toLowerCase() ? 1 : -1
        );
        setSortedList(sorted);
        setSortOrder('ASC');
      }
    }
  };
  const voucherpage = (expid) => {
    navigate(`/print/${expid}`);
  }
  const container = {
    visible: {
      // opacity: 1,
      // scale: 1,
      transition: {
        delayChildren: .1, //this is overall delay for whole children
        // staggerChildren: 0.16
      }
    }
  };
  // const item = {
  //   hidden: { x: -80, y: 80, opacity: 0, scale: 0 },
  //   visible: { y: 0, x: 0, scale: 1, opacity: 1 }
  // };
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: '100%' }}  // Initial state
        animate={{ opacity: 1, x: 0 }}  // Animation state
        exit={{ opacity: 0, x: '-100%' }}  // Exit animation
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={isModalOpen || isLedgerUpdate ? 'exp ismodal' : 'exp'}>
        <div className="add">
          <Button size='large' className='btne' title='Add Expense' onClick={() => setIsModalOpen(true)} startIcon={<AddBoxIcon />} variant="contained">Add Expense</Button>
        </div>
        <div className="head">
          <span>Expense List </span>
          <span>
            Record :{' '}
            <select title='Items Per Page' name="" id="" value={postsPerPage} onChange={handlePageSizeChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="5000">ALL</option>
            </select>
          </span>
          <span>
            <input type="text" title='Search' onChange={(e) => setSearchInput(e.target.value)} value={searchInput} placeholder="Type to search..." />
          </span>
        </div>
        <div className="table">
          <div className="header">
            <span>S.no</span>
            <span onClick={() => sortPosts('ledger')}>Ledger <i><KeyboardArrowDownIcon /> </i></span>
            <span onClick={() => sortPosts('amount')}>Amt. <i><KeyboardArrowDownIcon /> </i></span>
            <span>Narration</span>
            <span onClick={() => sortPosts('date')}>Date <i><KeyboardArrowDownIcon /> </i></span>
            <span>Actions</span>
            <span><input type="checkbox" onClick={selectAllCheckbox} id="allcheck" /></span>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="body"
            id="tablecontent"
          >
            <AnimatePresence>
              {(sortedList ? sortedList : currentPosts)?.filter((item) => {
                return (
                  finalsearch === '' ||
                  item.narration.toLowerCase().includes(finalsearch) ||
                  item.ledger.ledger.toLowerCase().includes(finalsearch) ||
                  item.amount.toString().includes(finalsearch)
                );
              }).map((expense, index) => {
                return <motion.div
                  // variants={item}
                  // exit={{ opacity: 1, x: '-150%', transition: { duration: 0.3 } }}
                  exit={isAnimatingRef.current ? { opacity: 1, x: '-102%', transition: { duration: 0.6 } } : {}}
                  key={expense._id} // Ensure each item has a unique key
                >
                  <span>{firstPostIndex + index + 1}</span>
                  <span className='caps'>{expense.ledger.ledger}</span>
                  <span>{expense.amount}</span>
                  <span>{expense.narration}</span>
                  <span>{dayjs(expense.date).format('DD MMM, YYYY')}</span>
                  <span>
                    <i title="Edit" onClick={() => setDataForEdit(expense)} className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    {/* <i title="print" onClick={() => voucherpage(expense._id)} className="fa fa-print" aria-hidden="true"></i> */}
                    <i title="Delete" onClick={() => deleteExpense(expense._id)} className="fa fa-trash-o" aria-hidden="true"></i>
                  </span>
                  <span> <input type="checkbox" title='select' onClick={highlight} id={expense._id} /></span>
                </motion.div>
              })}
              <div id="foot">
                <span></span>
                <span style={{ fontWeight: 700 }} >Total</span>
                <span style={{ fontWeight: 700 }} id="totalhere">
                  {currentPosts?.filter((item) => {
                    return (
                      finalsearch === '' ||
                      item.narration.toLowerCase().includes(finalsearch) ||
                      item.ledger.ledger.toLowerCase().includes(finalsearch) ||
                      item.amount.toString().includes(finalsearch)
                    );
                  })
                    .reduce((accumulator, expense) => {
                      return (accumulator += expense.amount);
                    }, 0)}
                </span>
                <span></span>
                <span></span>
                <span colSpan="1" id="alldelete" title="Delete Selected Item">
                  <i onClick={deletemanyExpense} className="fa fa-trash" aria-hidden="true"></i>
                </span>
                <span></span>
              </div>
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="foot">
          <span>
            Showing Result From {firstPostIndex + 1} To{' '}
            {lastPostIndex >= userAllDetails.explist?.length ? (lastPostIndex = userAllDetails.explist.length) : lastPostIndex} of{' '}
            {userAllDetails.explist?.length} Results
          </span>
          <span>
            Pages :
            <Pagination currentpage={currentPage} changepageno={changePageNumber} totalpost={userAllDetails.explist?.length} postperpage={postsPerPage} />
          </span>
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

