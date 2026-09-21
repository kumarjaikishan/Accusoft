import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import DataTable from "../../components/common/DataTable";
import { motion } from "framer-motion";
import { downloadCSV } from "../../utils/csvExport";
import { 
  Download, 
  Printer, 
  ArrowLeft 
} from "lucide-react";
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



  /* ---------------- TABLE COLUMNS ---------------- */

  const columns = getLedgerDetailColumns({ isMobile });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-2 lg:p-4 md:p-6 space-y-8"
    >
      {/* ---------- REDESIGNED UPPER HEADER ONLY ---------- */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm backdrop-blur-xl print:hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Back Button & Title Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/data_analysis")}
            aria-label="Back to Analysis"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 border border-slate-200/60 dark:border-slate-700/60 transition cursor-pointer shrink-0"
            title="Back to Monthly Analysis"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold capitalize tracking-tight text-slate-800 dark:text-slate-100">
              {ledgerName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Period: {displayMonth} {year}
            </p>
          </div>
        </div>

        {/* Right Side: Actions (CSV & Print) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() =>
              downloadCSV(
                filteredData,
                [
                  { label: "Ledger", key: "ledger.ledger" },
                  { label: "Amount", key: "amount" },
                  { label: "Date", key: "date" },
                  { label: "Narration", key: "narration" },
                ],
                `${ledgerName || "all-ledger"}-${displayMonth}-${year}-record`
              )
            }
            className="w-full sm:w-auto h-8 px-3 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm text-xs font-bold transition cursor-pointer"
          >
            <Download size={13} /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto h-8 px-3 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm text-xs font-bold transition cursor-pointer"
          >
            <Printer size={13} /> Print
          </button>
        </div>
      </div>

      {/* ---------------- TABLE CONTAINER (MATCHES REPORT PAGE) ---------------- */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden overflow-x-auto">
        <div className="hidden print:flex justify-center gap-4 border-b border-border-subtle p-2">
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
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
              <div className="text-4xl mb-2 opacity-30">📂</div>
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No Record Found</p>
            </div>
          }
        />
      </div>
    </motion.div>
  );
};

export default VoucherDetail;
