import React, { useState, useEffect } from 'react';
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

const AddExpenses = () => {
  const dispatch = useDispatch();
  const log = useSelector((state) => state.login);
  const userAllDetails = useSelector((state) => state.userexplist);
  if (!log.islogin) {
    toast.warn("You are not Logged In",{ autoClose: 1300 })
    return <Navigate to='/login' />
  }
  let itemIds = [];
  const currentDate = new Date();
  const [searchInput, setSearchInput] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable,setdisable]= useState(false);
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

    try {
      dispatch(setloader(true));
      const result = await fetch(`${userAllDetails.apiadress}/addexpense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ledger,
          date,
          amount,
          narration: capitalize(narration),
        }),
      });

      const data = await result.json();

      if (result.ok) {
        toast.success('Expense Added', { autoClose: 1300 });
        dispatch(userdata());
        dispatch(setloader(false));
        setIsModalOpen(false);
        setExpenseInput({
          _id: '',
          ledger: '',
          date: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate().toString().padStart(2, '0')}`,
          amount: '',
          narration: '',
        });
      } else {
        toast.warn('Something went wrong', { autoClose: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };
 // adding new expense ends here


  const fetchDataForEdit = async (expense) => {
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
        dispatch(setloader(true));
        try {
          const result = await fetch(`${userAllDetails.apiadress}/delmany`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: itemIds,
            }),
          });

          const data = await result.json();

          if (result.ok) {
            toast.success('Deleted Successfully', { autoClose: 1300 });
            dispatch(setloader(false));
            dispatch(userdata());

            const selectedItems = document.querySelectorAll('#tablecontent input:checked');
            const tableRows = document.querySelectorAll('#tablecontent tr');

            selectedItems.forEach((item) => {
              item.checked = false;
            });

            highlight();
          } else {
            toast.warn('Something went wrong', { autoClose: 1800 });
            dispatch(setloader(false));
          }
        } catch (error) {
          console.log(error);
          dispatch(setloader(false));
        }
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

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
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
            <input type="text" onChange={handleSearch} value={searchInput} placeholder="Type to search..." />
          </span>
        </div>
        <div className="table">
          <table cellSpacing="15">
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
            <tbody id="tablecontent">
              {(sortedList ? sortedList : currentPosts)
                .filter((item) => {
                  return (
                    searchInput.toLowerCase() === '' ||
                    item.narration.toLowerCase().includes(searchInput) ||
                    item.ledger.ledger.toLowerCase().includes(searchInput) ||
                    item.amount.toString().includes(searchInput)
                  );
                })
                .map((expense, index) => {
                  const expenseDate = new Date(expense.date);
                  const formattedDate = `${expenseDate.getUTCDate().toString().padStart(2, '0')} ${expenseDate.toLocaleString('default', { month: 'short' })
                    }, ${expenseDate.getFullYear().toString().substr(-2)}`;

                  return (
                    <tr key={index}>
                      <td>{firstPostIndex + index + 1}</td>
                      <td>{expense.ledger.ledger}</td>
                      <td>{expense.amount}</td>
                      <td>{expense.narration}</td>
                      <td>{formattedDate}</td>
                      <td>
                        <i title="Edit" onClick={() => fetchDataForEdit(expense)} className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        <i title="Delete" onClick={() => deleteExpense(expense._id)} className="fa fa-trash-o" aria-hidden="true"></i>
                      </td>
                      <td>
                        <input type="checkbox" onClick={highlight} id={expense._id} />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr id="foot">
                <th colSpan="1"></th>
                <th colSpan="1">Total</th>
                <th colSpan="1" id="totalhere">
                  {currentPosts
                    .filter((item) => {
                      return (
                        searchInput.toLowerCase() === '' ||
                        item.narration.toLowerCase().includes(searchInput) ||
                        item.ledger.ledger.toLowerCase().includes(searchInput)
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
          </table>
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
        <Ledpage setmodal={setIsModalOpen}  setdisable={setdisable} disable={disable} setisledupdate={setIsLedgerUpdate} isledupdate={isLedgerUpdate} />
      </div>
    </>
  );
};

export default AddExpenses;

