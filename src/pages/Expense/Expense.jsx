import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { SquarePlus, Trash2, X, Book, Settings } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import DataTableComponent from 'react-data-table-component';
const DataTable = DataTableComponent.default || DataTableComponent;
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { confirmDialog } from '../../utils/confirm';
import { toast } from '../../utils/toast';

// Icons

import { setloader } from '../../store/login';
import { useApi } from '../../utils/useApi';
import { getExpenseTableColumns } from './expenseTableColumns';
import ExpenseModalbox from './ExpenseModal';
import LedgerModal from './LedgerModal';
import { useTableStyles } from '../../components/dataTableStyle';

dayjs.extend(utc);
dayjs.extend(timezone);

const Expense = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme?.mode || 'light');
  const { request, loading } = useApi();

  // Server-driven page of expenses. We no longer keep the whole expense
  // history in Redux/memory - only the page currently on screen, plus the
  // total row count and the sum for whatever the current search matches
  // (both computed by Mongo, not by summing/filtering a huge local array).
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [sumAmount, setSumAmount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

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

  // Fetch only the current page of expenses from the server. This is the
  // single source of truth for the table now - no full-collection fetch,
  // no client-side filter/slice over the whole dataset.
  const fetchExpenses = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(rowsPerPage),
      });
      if (finalsearch) params.set('search', finalsearch);

      const res = await request({ url: `explist?${params.toString()}`, method: 'GET' });
      setRows(res?.items || []);
      setTotalRows(res?.total || 0);
      setSumAmount(res?.sumAmount || 0);
    } catch (error) {
      toast.error(error?.message || 'Failed to load expenses');
    } finally {
      setTableLoading(false);
    }
  }, [currentPage, rowsPerPage, finalsearch, request]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

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
      // Refetch just the current page (cheap - a handful of rows) instead of
      // the old dispatch(userdata()) which re-pulled the user's entire
      // expense history for a single new row.
      fetchExpenses();
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

  const setDataForEdit = useCallback((expense) => {
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
  }, []);

  const deleteExpense = useCallback((expenseId) => {
    isAnimatingRef.current = true;
    sendDeleteRequest([expenseId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendDeleteRequest = async (itemIds) => {

    if (itemIds.length < 1) {
      return toast.warn('Kindly Select Atleast 1 Entry', { autoClose: 1700 });
    }

    const willDelete = await confirmDialog({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this Data!',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    });

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
        // If deleting emptied the current page (and we're not on page 1),
        // step back a page so the user isn't left staring at a blank page.
        if (rows.length === itemIds.length && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        } else {
          fetchExpenses();
        }
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
  };

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [finalsearch]);

  // Column defs (with their cell-render closures) only need to be rebuilt
  // when the things they actually depend on change - not on every render
  // (e.g. not when isModalOpen or searchInput changes).
  const columns = useMemo(
    () =>
      getExpenseTableColumns({
        isMobile,
        setDataForEdit,
        deleteExpense,
        paginationContext: { currentPage, rowsPerPage },
      }),
    [isMobile, setDataForEdit, deleteExpense, currentPage, rowsPerPage]
  );

  const handleSelectedRowsChange = useCallback(({ selectedRows }) => {
    setSelectedRowIds(selectedRows.map(e => e._id));
  }, []);

  // Page total = sum of just the rows currently on screen (matches the
  // original client-side behaviour, which summed the paginated slice).
  // sumAmount from the server (everything matching the current search) is
  // still fetched but intentionally not used here.
  const totalAmount = useMemo(
    () => rows.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0),
    [rows]
  );

  const SummaryRow = () => (
    <div className="flex items-center flex-nowrap whitespace-nowrap bg-surface border-t border-border-subtle font-bold text-content min-h-[40px] px-2">
      {/* 
          Alignment Logic:
          - Desktop prefix: 48px (selectable) + 70px (S.No) + 140px (Ledger) = 258px
          - Mobile prefix: 95px (Ledger)
      */}
      <div
        style={{ width: isMobile ? '95px' : '258px' }}
        className="shrink-0 flex justify-end pr-2 text-[10px] md:text-xs uppercase tracking-wider opacity-70 whitespace-nowrap"
      >
        Page Total :
      </div>
      <div
        style={{ width: isMobile ? '60px' : '100px' }}
        className="shrink-0 font-mono text-blue-600 dark:text-blue-400 px-1 text-xs md:text-sm whitespace-nowrap"
      >
        ₹{totalAmount.toLocaleString()}
      </div>
      <div className="flex-1" />
    </div>
  );

  const TableSkeleton = () => (
    <div className="w-full p-4 space-y-3 bg-surface animate-pulse">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 py-2 border-b border-border-subtle">
          <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700/80 rounded"></div>
          <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700/80 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700/80 rounded"></div>
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700/80 rounded"></div>
          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700/80 rounded"></div>
          <div className="h-4 flex-1 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
        </div>
      ))}
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
          className="w-full mx-auto space-y-1"
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
          <div className="bg-surface rounded-b-xl shadow-md border border-border-subtle overflow-hidden overflow-x-auto relative">
            {tableLoading && rows.length > 0 && (
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-100 dark:bg-indigo-950/50 overflow-hidden z-30 pointer-events-none">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                  style={{
                    animation: 'tableTopProgress 1.2s ease-in-out infinite'
                  }}
                />
                <style>{`
                  @keyframes tableTopProgress {
                    0% { transform: translateX(-100%) scaleX(0.2); }
                    50% { transform: translateX(0%) scaleX(0.7); }
                    100% { transform: translateX(100%) scaleX(0.2); }
                  }
                `}</style>
              </div>
            )}
            <div className={`transition-all duration-300 ${tableLoading && rows.length > 0 ? 'opacity-60 blur-[1.5px] pointer-events-none' : ''}`}>
              <DataTable
                columns={columns}
                data={rows}
                progressPending={tableLoading && rows.length === 0}
                progressComponent={<TableSkeleton />}
                theme={mode === "dark" ? "dark" : "default"}
                selectableRows={isMobile ? false : true}
                // selectableRowsVisibleOnly
                onSelectedRowsChange={handleSelectedRowsChange}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                paginationPerPage={rowsPerPage}
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
            </div>
            <SummaryRow />
          </div>

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
            onSuccess={fetchExpenses}
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
