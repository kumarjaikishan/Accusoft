import React, { useEffect, useState } from 'react';
import './addexp.css';
import swal from 'sweetalert';
import Pagination from './pagination';
import Modalbox from './modalbox';
import Ledpage from './ledpage';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata } from '../../store/api'
import { toast } from 'react-toastify';
import apiWrapper from './apiWrapper';
import { AnimatePresence, motion } from 'framer-motion';

const AddExpenses = () => {
  const dispatch = useDispatch();
  const log = useSelector((state) => state.login);
  const userAllDetails = useSelector((state) => state.userexplist);
  const [searchInput, setSearchInput] = useState('');
  const [finalsearch,setfinalserach] = useState('');

  if (!log.islogin) {
    toast.warn("You are not Logged In", { autoClose: 1300 })
    return <Navigate to='/login' />
  }
  useEffect(() => {
    dispatch(setloader(false))
  }, [])

  useEffect(() => {
    const timerId = setTimeout(() => {
      setfinalserach(searchInput);
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchInput]);

  useEffect(() => {
    if (finalsearch) {
      console.log('Serach for:', finalsearch);
    }
    
  }, [finalsearch]);



  let itemIds = [];
  const currentDate = new Date();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable, setdisable] = useState(false);


  const init = {
    _id: '',
    ledger: '',
    date: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate().toString().padStart(2, '0')}`,
    amount: '',
    narration: '',
  }
  const [expenseInput, setExpenseInput] = useState(init);

  const [isLedgerUpdate, setIsLedgerUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseInput((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const capitalize = (value) => {
    const words = value.split(' ');
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
  };


  // adding new expense
  const submitExpense = async () => {
    const token = localStorage.getItem('token');
    const { ledger, date, amount, narration } = expenseInput;

    if (!ledger || !date || !amount || !narration) {
      const shakeElement = document.querySelector('.box');
      shakeElement.classList.add('shake');
      setTimeout(() => {
        shakeElement.classList.remove('shake');
      }, 420);
      dispatch(setloader(false));
      return toast.warn('Kindly Fill all Fields', { autoClose: 1700 });
    }

    const url = `${userAllDetails.apiadress}/addexpense`;
    const method = 'POST';
    const body = {
      ledger,
      date,
      amount,
      narration: capitalize(narration)
    };

    const successAction = (data) => {
      toast.success(data.msg, { autoClose: 1300 });
      dispatch(userdata());
      dispatch(setloader(false));
      setIsModalOpen(false);
      setExpenseInput(init);
    };

    const loaderAction = (isLoading) => dispatch(setloader(isLoading));

    await apiWrapper(url, method, body, dispatch, successAction, loaderAction);
  };
  // adding new expense ends here

  // setting input data on edit button click
  const setDataForEdit = async (expense) => {
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
        const url = `${userAllDetails.apiadress}/delmany`;
        const method = 'POST';
        const body = { id: itemIds };

        const successAction = (data) => {
          toast.success(data.msg, { autoClose: 1300 });
          dispatch(setloader(false));
          dispatch(userdata());

          const selectedItems = document.querySelectorAll('#tablecontent input:checked');

          selectedItems.forEach((item) => {
            item.checked = false;
          });

          highlight();
        };

        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper(url, method, body, dispatch, successAction, loaderAction);
      } else {
        swal('Your data is safe!');
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
    const tableRows = document.querySelectorAll('#tablecontent tr');

    checkboxes.forEach((checkbox, index) => {
      const parentRow = tableRows[index];

      if (checkbox.checked) {
        parentRow.style.background = 'rgb(16 135 129)';
        parentRow.style.color = 'white';
      } else {
        parentRow.style.background = 'transparent';
        parentRow.style.color = 'black';
      }
    });
  };

  let lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;

  const currentPosts = userAllDetails.explist.slice(firstPostIndex, lastPostIndex);
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

  return (
    <>
      <div className="exp">
        <div className="add">
          <i title="Add Expense" className="fa fa-plus" onClick={() => setIsModalOpen(true)} aria-hidden="true" id="addexp"></i>
        </div>
        <div className="head">
          <span>Expense Voucher List </span>
          <span>
            Record :{' '}
            <select name="" id="" value={postsPerPage} onChange={handlePageSizeChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="5000">ALL</option>
            </select>
          </span>
          <span>
            <input type="text" onChange={(e)=> setSearchInput(e.target.value)} value={searchInput} placeholder="Type to search..." />
          </span>
        </div>
        <div className="table">
          <motion.table layout cellSpacing="15">
            <thead>
              <tr>
                <th>S.no</th>
                <th onClick={() => sortPosts('ledger')}>
                  <span>Ledger Name</span> <i className="fa fa-arrow-down" aria-hidden="true"></i>
                </th>
                <th onClick={() => sortPosts('amount')}>
                  <span>Amount</span> <i className="fa fa-arrow-down" aria-hidden="true"></i>
                </th>
                <th>Narration</th>
                <th onClick={() => sortPosts('date')}>
                  <span>Date</span> <i className="fa fa-arrow-down" aria-hidden="true"></i>
                </th>
                <th>Actions</th>
                <th title="Select All">
                  <input type="checkbox" onClick={selectAllCheckbox} id="allcheck" />
                </th>
              </tr>
            </thead>
            <AnimatePresence>
              <motion.tbody layout id="tablecontent">
                {(sortedList ? sortedList : currentPosts)
                  .filter((item) => {
                    return (
                      finalsearch.toLowerCase() === '' ||
                      item.narration.toLowerCase().includes(finalsearch) ||
                      item.ledger.ledger.toLowerCase().includes(finalsearch) ||
                      item.amount.toString().includes(finalsearch)
                    );
                  })
                  .map((expense, index) => {
                    const expenseDate = new Date(expense.date);
                    const formattedDate = `${expenseDate.getUTCDate().toString().padStart(2, '0')} ${expenseDate.toLocaleString('default', { month: 'short' })
                      }, ${expenseDate.getFullYear().toString().substr(-2)}`;

                    return (
                      <motion.tr
                        layout key={index}>
                        <td>{firstPostIndex + index + 1}</td>
                        <td>{expense.ledger.ledger}</td>
                        <td>{expense.amount}</td>
                        <td>{expense.narration}</td>
                        <td>{formattedDate}</td>
                        <td>
                          <i title="Edit" onClick={() => setDataForEdit(expense)} className="fa fa-pencil-square-o" aria-hidden="true"></i>
                          <i title="Delete" onClick={() => deleteExpense(expense._id)} className="fa fa-trash-o" aria-hidden="true"></i>
                        </td>
                        <td>
                          <input type="checkbox" onClick={highlight} id={expense._id} />
                        </td>
                      </motion.tr>
                    );
                  })}
              </motion.tbody>
            </AnimatePresence>
            <tfoot>
              <tr id="foot">
                <th colSpan="1"></th>
                <th colSpan="1">Total</th>
                <th colSpan="1" id="totalhere">
                  {currentPosts
                    .filter((item) => {
                      return (
                        finalsearch.toLowerCase() === '' ||
                        item.narration.toLowerCase().includes(finalsearch) ||
                        item.ledger.ledger.toLowerCase().includes(finalsearch)
                      );
                    })
                    .reduce((accumulator, expense) => {
                      return (accumulator += expense.amount);
                    }, 0)}
                </th>
                <th colSpan="2"></th>
                <th colSpan="1" id="alldelete" title="Delete Selected Item">
                  <i onClick={deletemanyExpense} className="fa fa-trash" aria-hidden="true"></i>
                </th>
                <th colSpan="1"></th>
              </tr>
            </tfoot>
          </motion.table>
        </div>
        <div className="foot">
          <span>
            Showing Result From {firstPostIndex + 1} To{' '}
            {lastPostIndex >= userAllDetails.explist.length ? (lastPostIndex = userAllDetails.explist.length) : lastPostIndex} of{' '}
            {userAllDetails.explist.length} Results
          </span>
          <span>
            Pages :
            <Pagination currentpage={currentPage} changepageno={changePageNumber} totalpost={userAllDetails.explist.length} postperpage={postsPerPage} />
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
        />
        <Ledpage setmodal={setIsModalOpen} setdisable={setdisable} disable={disable} setisledupdate={setIsLedgerUpdate} isledupdate={isLedgerUpdate} />
      </div>
    </>
  );
};

export default AddExpenses;

