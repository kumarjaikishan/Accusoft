import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import { motion } from "framer-motion";
import { CSVLink } from "react-csv";
import { Download, Printer } from "lucide-react";
import { setnarrow } from "../../store/login";
import { getLedgerDetailColumns } from "./ledgerDetailColumns";
import { useTableStyles } from "../../components/dataTableStyle";

const VoucherDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const ledgerName = searchParams.get("ledgerName");
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  const displayMonth = dayjs()
    .month(month)
    .format("MMMM");

  const { explist } = useSelector((state) => state.userexplist);

  /* ---------------- FILTERED DATA ---------------- */

  const filteredData = useMemo(() => {
    if (!explist) return [];

    return explist.filter((e) => {
      const d = dayjs(e.date);

      const inMonth =
        d.month() === month && d.year() === year;

      if (id === "all") return inMonth;

      return (
        e.ledger?._id === id &&
        inMonth
      );
    });
  }, [explist, id, month, year]);

  const totalAmount = useMemo(
    () =>
      filteredData.reduce(
        (acc, val) => acc + Number(val.amount),
        0
      ),
    [filteredData]
  );

  const handlePrint = () => {
    dispatch(setnarrow(true));
    setTimeout(() => window.print(), 200);
  };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (month !== undefined && !isNaN(month)) {
      localStorage.setItem("month", month);
    }
    if (year !== undefined && !isNaN(year)) {
      localStorage.setItem("year", year);
    }
  }, [month, year]);

  const SummaryRow = () => (
    <div className="flex items-center bg-surface border-t border-border-subtle font-bold text-content min-h-[35px]">
      {/* 
          Alignment Logic:
          - Desktop prefix: 48px (selectable) + 70px (S.No) + 140px (Ledger) = 258px
          - Mobile prefix: 48px (selectable) + 120px (Ledger) = 168px
      */}
      <div
        style={{ width: isMobile ? '140px' : '140px' }}
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

  /* ---------------- TABLE COLUMNS ---------------- */

  const columns = getLedgerDetailColumns({ isMobile });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-2 lg:p-4 md:p-6 space-y-8"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 print:hidden text-white rounded-2xl shadow-xl p-2 md:p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* LEFT SIDE */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-end">

          {/* Ledger */}
          <div>
            <p className="text-xs uppercase tracking-wide opacity-70">
              Ledger
            </p>
            <p className="text-2xl md:text-2xl font-bold capitalize mt-1">
              {ledgerName}
            </p>
          </div>

          {/* Period */}
          <div>
            <p className="text-xs uppercase tracking-wide opacity-70">
              Period
            </p>
            <p className="text-base md:text-lg font-semibold mt-1">
              {displayMonth} {year}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-wrap items-center gap-2 ">
          <button
            onClick={() => navigate("/data_analysis")}
            className="px-6 py-2 rounded-xl bg-white text-indigo-600 font-medium hover:bg-gray-100 transition shadow-md"
          >
            Return
          </button>

          <CSVLink
            data={filteredData}
            headers={[
              { label: "Ledger", key: "ledger.ledger" },
              { label: "Amount", key: "amount" },
              { label: "Date", key: "date" },
              { label: "Narration", key: "narration" },
            ]}
            filename={`${ledgerName || "all-ledger"}-${displayMonth}-${year}-record.csv`}
          >
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-600 font-medium hover:bg-gray-100 transition shadow-md">
              <Download size={16} /> CSV
            </button>
          </CSVLink>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-600 font-medium hover:bg-gray-100 transition shadow-md"
          >
            <Printer size={16} /> Print
          </button>
        </div>

      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="bg-white rounded-xs md:rounded-xl shadow-lg p-0 md:p-4 lg:p-6">
        <div className="flex hidden print:flex justify-center gap-4 border-b border-border-subtle p-2">
          <div>
            <span className="text-sm font-medium">Ledger : </span>
            <span className="text-sm font-medium capitalize"> {ledgerName}</span>
          </div>
          <div>
            <span className="text-sm font-medium mr-2">Period : </span>
            <span className="text-sm font-medium">{displayMonth} {year}</span>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          customStyles={useTableStyles()}
          highlightOnHover
          striped
          noDataComponent={
            <div className="py-6 text-gray-500">
              No Record Found
            </div>
          }
        />
        <SummaryRow />
      </div>
    </motion.div>
  );
};

export default VoucherDetail;
