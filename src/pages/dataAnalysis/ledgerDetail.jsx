import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import DataTableComponent from "react-data-table-component";
const DataTable = DataTableComponent.default || DataTableComponent;
import { motion } from "framer-motion";
import { CSVLink } from "react-csv";
import { Download, Printer } from "lucide-react";
import { setnarrow } from "../../store/login";
import { getLedgerDetailColumns } from "./ledgerDetailColumns";
import { useTableStyles } from "../../components/dataTableStyle";
import { useApi } from "../../utils/useApi";

const VoucherDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const { request } = useApi();

  const ledgerName = searchParams.get("ledgerName");
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  const displayMonth = dayjs()
    .month(month)
    .format("MMMM");

  // Fetched fresh from the server for this specific ledger + month/year -
  // not filtered from the user's whole expense history whenever the month
  // changes.
  const [filteredData, setFilteredData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (Number.isNaN(month) || Number.isNaN(year)) return;
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams({
          ledgerId: id || "all",
          month: String(month),
          year: String(year),
        });
        const res = await request({ url: `ledgerdetail?${params.toString()}`, method: "GET" });
        if (cancelled) return;
        setFilteredData(res?.items || []);
        setTotalAmount(res?.sumAmount || 0);
      } catch (error) {
        if (!cancelled) {
          setFilteredData([]);
          setTotalAmount(0);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, month, year]);

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
    <div className="flex items-center flex-nowrap whitespace-nowrap bg-surface border-t border-border-subtle font-bold text-content min-h-[40px] px-2">
      <div
        style={{ width: isMobile ? '125px' : '130px' }}
        className="shrink-0 flex justify-end pr-2 text-[10px] md:text-xs uppercase tracking-wider opacity-70 whitespace-nowrap"
      >
        Total :
      </div>
      <div
        style={{ width: isMobile ? '80px' : '70px' }}
        className="shrink-0 font-mono text-blue-600 dark:text-blue-400 px-1 text-xs md:text-sm whitespace-nowrap"
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
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate("/data_analysis")}
            className="w-full sm:w-auto flex items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-white text-indigo-600 font-semibold hover:bg-gray-100 transition shadow-md whitespace-nowrap"
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
            className="w-full sm:w-auto"
          >
            <button className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-white text-indigo-600 font-semibold hover:bg-gray-100 transition shadow-md whitespace-nowrap">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> CSV
            </button>
          </CSVLink>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-white text-indigo-600 font-semibold hover:bg-gray-100 transition shadow-md whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Print
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
