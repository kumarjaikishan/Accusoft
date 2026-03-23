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
      dispatch(setloader(true));
      const res = await request({
        url: 'addexpense',
        method: 'POST',
        body: { ledger, date, amount, narration: capitalize(narration) }
      });

      toast.success(res?.message || "Expense Added Successfully", { autoClose: 1300 });
      dispatch(userdata());
      setIsModalOpen(false);
      setExpenseInput(init);
    } catch (error) {
      // toast is automatically dispatched by useApi hook
    } finally {
      dispatch(setloader(false));
    }
  };

  const setDataForEdit = (expense) => {
    console.log(expense?.ledger?._id)
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
          dispatch(setloader(true));
          const res = await request({
            url: 'deleteexp',
            method: 'POST',
            body: { ids: itemIds }
          });

          toast.success(res?.message || "Deleted successfully");
          dispatch(userdata());
          setSelectedRowIds([]);
        } catch (error) {
          // Error managed natively by useApi hook
        } finally {
          dispatch(setloader(false));
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

  const columns = getExpenseTableColumns({ isMobile, setDataForEdit, deleteExpense });


  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRowIds(selectedRows.map(e => e._id));
  };

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
          {/* Top Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 mb-2">
            <AnimatePresence>
              {selectedRowIds.length > 0 && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => sendDeleteRequest(selectedRowIds)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors font-semibold text-sm"
                >
                  <Trash2 size={20} />
                  Delete Selected ({selectedRowIds.length})
                </motion.button>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                setIsUpdateMode(false);
                setExpenseInput(init);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-(--maincolor) dark:bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-slate-700 dark:hover:bg-indigo-500 cursor-pointer transition-colors font-semibold text-sm"
            >
              <SquarePlus size={20} />
              Add Expense
            </button>

            <button
              onClick={() => { setIsLedgerUpdate(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-gray-100 border border-slate-400 dark:border-slate-500 rounded-lg cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-semibold text-sm"
            >
              <Book size={16} />
              Ledger
            </button>
          </div>

          {/* Table Header & Search */}
          <div className="shake-box bg-(--maincolor) dark:bg-slate-900 border-b border-white/5 text-white p-3 rounded-t-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-lg font-bold tracking-tight">Expense Tracking List</h1>

            <div className="relative group w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search Expense..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-64 bg-slate-700 dark:bg-slate-800 text-white border-none rounded-lg py-2 pl-3 pr-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 text-sm"
              />
              {searchInput ? (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              ) : (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              )}
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
