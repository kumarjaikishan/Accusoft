import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import { motion } from "framer-motion";

const VoucherDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const formatDate = (date) =>
    dayjs(date).format("DD MMM YYYY");

  /* ---------------- TABLE COLUMNS ---------------- */

  const columns = [
    {
      name: "#",
      selector: (_, i) => i + 1,
      width: "60px",
    },
    {
      name: "Ledger",
      selector: (row) =>
        row.ledger?.ledger?.charAt(0).toUpperCase() +
        row.ledger?.ledger?.slice(1),
      width: "140px",
    },
    {
      name: "Amount",
      selector: (row) => `₹ ${row.amount}`,
      sortable: true,
      right: true,
      width: "120px",
    },
    {
      name: "Narration",
      selector: (row) => row.narration || "-",
      grow: 2,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) => formatDate(row.date),
      width: "140px",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 space-y-8"
    >
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* LEFT SIDE */}
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">

            {/* Ledger */}
            <div>
              <p className="text-xs uppercase tracking-wide opacity-70">
                Ledger
              </p>
              <p className="text-2xl md:text-3xl font-bold capitalize mt-1">
                {ledgerName}
              </p>
            </div>

            {/* Total Amount */}
            <div>
              <p className="text-xs uppercase tracking-wide opacity-70">
                Total Amount
              </p>
              <p className="text-2xl md:text-3xl font-bold mt-1">
                ₹ {totalAmount.toLocaleString()}
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

            {/* Entries */}
            <div>
              <p className="text-xs uppercase tracking-wide opacity-70">
                Total Entries
              </p>
              <p className="text-base md:text-lg font-semibold mt-1">
                {filteredData.length}
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <button
            onClick={() => navigate("/datanalysis")}
            className="px-6 py-2 rounded-xl bg-white text-indigo-600 font-medium hover:bg-gray-100 transition shadow-md"
          >
            Return
          </button>
        </div>

      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <DataTable
          columns={columns}
          data={filteredData}
          highlightOnHover
          striped
          fixedHeader
          fixedHeaderScrollHeight="500px"
          noDataComponent={
            <div className="py-6 text-gray-500">
              No Record Found
            </div>
          }
        />
      </div>
    </motion.div>
  );
};

export default VoucherDetail;