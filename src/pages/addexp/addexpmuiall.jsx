// ✅ FIXED VERSION of `AddExpenses.js` with null-safe handling for react-data-table-component

import React, { useEffect, useState } from 'react';
import './addexp.css';
import swal from 'sweetalert';
import Pagination from './pagination';
import Modalbox from './modalbox';
import Ledpage from './ledpage';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { userdata, addexpense } from '../../store/api';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import apiWrapper from './apiWrapper';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { MdAddBox } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line, RiDeleteBin6Fill } from "react-icons/ri";
import DataTable from 'react-data-table-component';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IoCloseSharp } from "react-icons/io5";

const AddExpenses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userAllDetails = useSelector((state) => state.userexplist);

  const [searchInput, setSearchInput] = useState('');
  const [finalsearch, setFinalSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLedgerUpdate, setIsLedgerUpdate] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable, setdisable] = useState(false);
  const [allexp, setallexp] = useState([]);
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
    fetchData(1, perPage);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFinalSearch(searchInput.toLowerCase());
    }, 1300);

    return () => clearTimeout(timerId);
  }, [searchInput]);

  const fetchData = async (page, size = perPage) => {
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
      const startIndex = (page - 1) * size;

      if (page === 1 && result.total) {
        setallexp(new Array(result.total).fill(null));
      }

      setallexp((prev) => {
        const updated = [...prev];
        for (let i = 0; i < result.items.length; i++) {
          updated[startIndex + i] = result.items[i];
        }
        return updated;
      });
      setTotalRows(result.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (value) => value.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * perPage;
    const pageDataAvailable = allexp.slice(startIndex, startIndex + perPage).every(item => item !== null);
    if (!pageDataAvailable) {
      fetchData(page, perPage);
    }
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
    fetchData(page, newPerPage);
  };

  const columns = [
    {
      name: 'S.No',
      cell: (row, index) => (currentPage - 1) * perPage + index + 1,
    },
    {
      name: 'Ledger',
      selector: row => row.ledger?.ledger || '-',
      sortable: true,
    },
    {
      name: 'Amount',
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
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <HiPencilSquare title="Edit" onClick={() => console.log(row)} className='editicon ico' />
          <RiDeleteBin6Line title="Delete" onClick={() => console.log("delete", row._id)} className='deleteicon ico' />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={isModalOpen || isLedgerUpdate ? 'exp ismodal' : 'exp'}
    >
      <div className="add">
        <Button size='large' onClick={() => setIsModalOpen(true)} startIcon={<MdAddBox />} variant="contained">Add Expense</Button>
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
          data={allexp.filter(item => item !== null)} // ✅ filter nulls
          pagination
           paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={perPage}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          highlightOnHover
        />
      </div>
    </motion.div>
  );
};

export default AddExpenses;