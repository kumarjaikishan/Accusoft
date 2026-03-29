import React, { useEffect, useState, useRef } from 'react';
import { SquarePlus, Trash2, X, Book } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import dayjs from 'dayjs';
// import './addexp.css';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import swal from 'sweetalert';
import { toast } from 'react-toastify';

// Icons

import { setloader } from '../../store/login';
import { userdata } from '../../store/api';
import { useApi } from '../../utils/useApi';
import { getExpenseTableColumns } from './expenseTableColumns';
import ExpenseModalbox from './ExpenseModal';
import LedgerModal from './LedgerModal';
import { useTableStyles } from '../../components/dataTableStyle';

dayjs.extend(utc);
dayjs.extend(timezone);

const Expense = () => {
  const dispatch = useDispatch();
  // Mocking Redux state for demonstration. In production, this uses your actual store.
  const userAllDetails = useSelector((state) => state.userexplist) || { explist: [], ledgerlist: [] };
  const mode = useSelector((state) => state.theme?.mode || 'light');
  const { request, loading } = useApi();

  const [searchInput, setSearchInput] = useState('');
  const [finalsearch, setfinalserach] = useState('');
  const isAnimatingRef = useRef(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [disable, setdisable] = useState(false);
  const [isLedgerUpdate, setIsLedgerUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const init = {
    _id: '',
    ledger: '',
    date: dayjs().format('YYYY-MM-DD'),
    amount: '',
    narration: '',
  };
  const [expenseInput, setExpenseInput] = useState(init);

  useEffect(() => {
    dispatch(setloader(loading));
  }, [loading]);

  const reset = () => {
    setExpenseInput(init)
  }

  // Search Debounce Logic
  useEffect(() => {
    const timerId = setTimeout(() => {
      setfinalserach(searchInput.toLowerCase());
    }, 800);
    return () => clearTimeout(timerId);
  }, [searchInput]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setExpenseInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const capitalize = (value) => {
    if (!value) return '';
    const words = value.split(' ');
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const submitExpense = async () => {
    let { ledger, date, amount, narration } = expenseInput;

    if (!ledger || !date || !amount || !narration) {
      const shakeElement = document.querySelector('.shake-box');
      shakeElement?.classList.add('animate-shake');
      setTimeout(() => shakeElement?.classList.remove('animate-shake'), 500);
      return toast.warn('Kindly Fill all Fields', { autoClose: 1700 });
    }

    // API Logic (simplified for tailwind conversion context)
    try {
      const toastId = toast.loading("Adding expense...");
      const res = await request({
        url: 'addexpense',
        method: 'POST',
        body: { ledger, date, amount, narration: capitalize(narration) }
      });

      toast.update(toastId, {
        render: res?.message || "Expense Added Successfully",
        type: "success",
        isLoading: false,
        autoClose: 1300
      });
      dispatch(userdata());
      setIsModalOpen(false);
      setExpenseInput(init);
    } catch (error) {
      toast.update(toastId, {
        render: error?.message || "Failed to add expense",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const setDataForEdit = (expense) => {
    // console.log(expense?.ledger?._id)
    setExpenseInput({
      _id: expense._id,
      ledger: expense?.ledger?._id || '',
      date: dayjs(expense.date).format('YYYY-MM-DD'),
      amount: expense?.amount,
      narration: expense?.narration,
    });
    setIsUpdateMode(true);
    setIsModalOpen(true);
  };

  const deleteExpense = (expenseId) => {
    isAnimatingRef.current = true;
    sendDeleteRequest([expenseId]);
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
        try {
          const toastId = toast.loading("Deleting expense(s)...");
          const res = await request({
            url: 'deleteExpense',
            method: 'POST',
            body: { ExpIds: itemIds }
          });

          toast.update(toastId, {
            render: res?.message || "Deleted successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000
          });
          dispatch(userdata());
          setSelectedRowIds([]);
        } catch (error) {
          toast.update(toastId, {
            render: error?.message || "Failed to delete expense",
            type: "error",
            isLoading: false,
            autoClose: 3000
          });
        }
      }
    });
  };

  const filteredExpenses = userAllDetails?.explist?.filter((item) => {
    return (
      finalsearch === '' ||
      item.narration?.toLowerCase().includes(finalsearch) ||
      item.ledger?.ledger?.toLowerCase().includes(finalsearch) ||
      item.amount?.toString().includes(finalsearch)
    );
  }) || [];

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [finalsearch]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredExpenses.slice(startIndex, startIndex + rowsPerPage);

  const columns = getExpenseTableColumns({
    isMobile,
    setDataForEdit,
    deleteExpense,
    paginationContext: { currentPage, rowsPerPage }
  });


  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRowIds(selectedRows.map(e => e._id));
  };

  const totalAmount = paginatedData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const SummaryRow = () => (
    <div className="flex items-center bg-surface border-t border-border-subtle font-bold text-content min-h-[35px]">
      {/* 
          Alignment Logic:
          - Desktop prefix: 48px (selectable) + 70px (S.No) + 140px (Ledger) = 258px
          - Mobile prefix: 48px (selectable) + 120px (Ledger) = 168px
      */}
      <div
        style={{ width: isMobile ? '168px' : '258px' }}
        className="flex justify-end pr-4 text-[10px] md:text-xs uppercase tracking-wider opacity-60"
      >
        Total :
      </div>
      <div
        style={{ width: isMobile ? '70px' : '100px' }}
        className="font-mono text-blue-600 dark:text-blue-400 px-2"
      >
        ₹{totalAmount.toLocaleString()}
      </div>
      <div className="flex-1" />
    </div>
  );

  return (
    <>
      <div className={`min-h-screen exp bg-page p-2 lg:p-4 transition-all duration-300 ${isModalOpen || isLedgerUpdate ? 'overflow-hidden h-screen' : ''}`}>
        <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full mx-auto space-y-4"
        >
          {/* Consolidated Header: Search & Action Buttons */}
          <div className="shake-box bg-(--maincolor) dark:bg-slate-900 border-b border-white/5 text-white p-3 rounded-t-xl flex flex-wrap items-center justify-between gap-4">

            {/* Left side: Search and Multi-Delete */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative group w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search Expense..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="
                    w-full
                    bg-white dark:bg-slate-800
                    text-slate-800 dark:text-slate-200
                    border border-slate-300 dark:border-slate-600
                    rounded-lg py-2 pl-3 pr-10
                    focus:ring-2 focus:ring-[var(--maincolor)]
                    focus:border-[var(--maincolor)]
                    outline-none transition-all
                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                    text-sm
                  "
                />

                {searchInput ? (
                  <button
                    onClick={() => setSearchInput("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                ) : (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {selectedRowIds.length > 0 && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={() => sendDeleteRequest(selectedRowIds)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors font-semibold text-xs whitespace-nowrap"
                  >
                    <Trash2 size={16} />
                    Delete Selected ({selectedRowIds.length})
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Right side: Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setIsUpdateMode(false);
                  setExpenseInput(init);
                  setIsModalOpen(true);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-indigo-600 text-(--maincolor) dark:text-white rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-indigo-500 cursor-pointer transition-colors font-bold text-xs sm:text-sm whitespace-nowrap"
              >
                <SquarePlus size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Expense</span>
                <span className="sm:hidden">Add</span>
              </button>

              <button
                onClick={() => { setIsLedgerUpdate(true) }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg cursor-pointer shadow-sm hover:bg-white/20 transition-colors font-bold text-xs sm:text-sm whitespace-nowrap"
              >
                <Book size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Ledger</span>
                <span className="sm:hidden">Ledger</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-surface rounded-b-xl shadow-md border border-border-subtle overflow-hidden overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredExpenses}
              theme={mode === "dark" ? "dark" : "default"}
              selectableRows
              selectableRowsVisibleOnly
              onSelectedRowsChange={handleSelectedRowsChange}
              pagination
              paginationDefaultPage={currentPage}
              onChangePage={page => setCurrentPage(page)}
              onChangeRowsPerPage={num => {
                setRowsPerPage(num);
                setCurrentPage(1);
              }}
              highlightOnHover
              customStyles={useTableStyles()}
              noDataComponent={
                <div className="py-12 text-center text-content bg-surface">
                  <div className="text-4xl mb-2 opacity-20">📂</div>
                  <p className="font-medium">No expense records found</p>
                  <p className="text-sm">Try adjusting your search or add a new expense</p>
                </div>
              }
            />
            <SummaryRow />
          </div>

          {/* Totals Summary Footer (Optional/Replica of your .foot) */}
          {/* <div className="mt-4 p-4 bg-white border border-dashed border-slate-300 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-slate-600 text-sm font-medium">
              Total Amount: <span className="text-blue-600 font-bold">₹{filteredExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)}</span>
            </div>
          </div> */}

          {/* Modals */}
          <ExpenseModalbox
            init={init}
            setdisable={setdisable}
            disable={disable}
            setinp={setExpenseInput}
            setisupdate={setIsUpdateMode}
            setmodal={setIsModalOpen}
            sub={submitExpense}
            modal={isModalOpen}
            handlechange={handleInputChange}
            fields={expenseInput}
            isupdate={isUpdateMode}
            reset={reset}
          />

          {/* <Ledpage navigate={navigate} setmodal={setIsModalOpen} setdisable={setdisable} disable={disable} setisledupdate={setIsLedgerUpdate} isledupdate={isLedgerUpdate} /> */}

        </motion.div>
        <LedgerModal
          setdisable={setdisable}
          disable={disable}
          setisledupdate={setIsLedgerUpdate}
          isledupdate={isLedgerUpdate}
        />
      </div>

    </>);
};

export default Expense;
