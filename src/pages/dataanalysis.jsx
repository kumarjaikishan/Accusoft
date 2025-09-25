import React, { useEffect, useState, useMemo } from "react";
import "./dataanalysis.css";
import { useSelector, useDispatch } from "react-redux";
import { setloader } from "../store/login";
import { motion } from "framer-motion";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Datanalysis = () => {
    const dispatch = useDispatch();
    const useralldetail = useSelector((state) => state.userexplist || {});
    const navigate = useNavigate();
    const [showbudget, setshowbudget] = useState(true);

    const today = new Date();

    // Load month/year from localStorage or fallback to current
    const storedMonth = localStorage.getItem("month");
    const storedYear = localStorage.getItem("year");

    const [inp, setinp] = useState({
        // not used elsewhere, but keep for compatibility
        date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
            today.getDate()
        ).padStart(2, "0")}`,
        month: storedMonth !== null ? parseInt(storedMonth, 10) : today.getMonth(),
        year: storedYear !== null ? parseInt(storedYear, 10) : today.getFullYear(),
    });

    const BudgetToggle = () => {
        let now = !showbudget
        setshowbudget(now)
        localStorage.setItem("showbudget", JSON.stringify(now));
    }

    // Save to localStorage whenever it changes
    useEffect(() => {
        let saved = localStorage.getItem("showbudget");
        if (saved) setshowbudget(Boolean(JSON.parse(saved)));
        console.log(saved)
        console.log(saved)

    }, []);

    const [cardarr, setcardarr] = useState({});

    useEffect(() => {
        cal();
        dispatch(setloader(false));
        localStorage.setItem("month", String(inp.month));
        localStorage.setItem("year", String(inp.year));
    }, [inp.month, inp.year, useralldetail]);

    // Helper: safe number formatter (optional)
    const fmt = (n) =>
        typeof n === "number" ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : n;

    // main calculation
    const cal = () => {
        const newLedgerSum = {};
        let allLedgerSum = 0;
        let allLedgerBudgetSum = 0;

        // Defensive: ensure ledgerlist exists
        const ledgerlist = Array.isArray(useralldetail?.ledgerlist) ? useralldetail.ledgerlist : [];

        // Build dictionary keyed by ledgerId
        ledgerlist.forEach((led) => {
            const budgetNum = Number(led.budget || 0) || 0;
            allLedgerBudgetSum += budgetNum;
            newLedgerSum[led._id] = {
                ledger: led.ledger,
                budget: budgetNum,
                totalSum: 0,
            };
        });

        const monthIn2Digit = String(parseInt(inp.month, 10) + 1).padStart(2, "0");
        const startDate = dayjs(`${inp.year}-${monthIn2Digit}-01`);
        const endDate = startDate.endOf("month");

        const explist = Array.isArray(useralldetail?.explist) ? useralldetail.explist : [];

        explist.forEach((entry) => {
            // defensive extraction: entry.ledger may be object or id string
            const ledgerId =
                entry?.ledger && typeof entry.ledger === "object"
                    ? entry.ledger._id
                    : entry?.ledger || null;

            const amountValue = parseFloat(entry.amount);
            const entryDate = dayjs(entry.date);

            if (
                ledgerId &&
                !isNaN(amountValue) &&
                entryDate.isValid() &&
                entryDate.isSameOrAfter(startDate) &&
                entryDate.isSameOrBefore(endDate)
            ) {
                if (newLedgerSum[ledgerId]) {
                    allLedgerSum += amountValue;
                    newLedgerSum[ledgerId].totalSum += amountValue;
                }
            }
        });

        // Add Total entry inside the object (safe)
        newLedgerSum["Total"] = {
            ledger: "Total",
            budget: allLedgerBudgetSum,
            totalSum: allLedgerSum,
        };

        setcardarr(newLedgerSum);
    };

    const monname = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // Ensure month/year inputs stored as numbers
    const handle = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (name === "month" || name === "year") {
            value = parseInt(value, 10);
        }
        setinp((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const detail = (ledgerId) => {
        if (ledgerId === "Total") {
            navigate(
                `/datanalysis/ledgerDetail/all?&ledgerName=All Ledger&month=${inp.month}&year=${inp.year}`
            );
            return;
        }

        // find ledger in ledgerlist by _id
        const ledgerItem = (useralldetail?.ledgerlist || []).find((e) => e._id === ledgerId);
        if (ledgerItem) {
            navigate(
                `/datanalysis/ledgerDetail/${ledgerId}?&ledgerName=${encodeURIComponent(
                    ledgerItem.ledger
                )}&month=${inp.month}&year=${inp.year}`
            );
        } else {
            // fallback to all
            navigate(
                `/datanalysis/ledgerDetail/all?&ledgerName=All Ledger&month=${inp.month}&year=${inp.year}`
            );
        }
    };

    // Prepare entries sorted so 'Total' is last
    const sortedEntries = useMemo(() => {
        const entries = Object.entries(cardarr || {});
        const nonTotal = entries.filter(([id]) => id !== "Total");
        const total = entries.find(([id]) => id === "Total");
        // Optionally sort nonTotal by totalSum desc:
        nonTotal.sort(([, a], [, b]) => b.totalSum - a.totalSum);
        return total ? [...nonTotal, total] : nonTotal;
    }, [cardarr]);

    // Safe totals for percentage calculations
    const overallTotal = cardarr?.["Total"]?.totalSum || 0;
    const overallBudget = cardarr?.["Total"]?.budget || 0;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-100%" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="datanalysis"
            >
                <div className="cont">
                    <span>
                        <FormControl size="small" className=" select caps">
                            <InputLabel id="month-select-label">Month</InputLabel>
                            <Select
                                name="month"
                                size="small"
                                labelId="month-select-label"
                                onChange={handle}
                                value={inp.month}
                                id="month-select"
                                label="Month"
                            >
                                {monname.map((val, ind) => {
                                    return (
                                        <MenuItem sx={{ textTransform: "capitalize" }} key={ind} value={ind}>
                                            {val}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </span>
                    <span>
                        <FormControl size="small" className="select caps">
                            <InputLabel id="year-select-label">Year</InputLabel>
                            <Select
                                name="year"
                                labelId="year-select-label"
                                onChange={handle}
                                value={inp.year}
                                id="year-select"
                                label="Year"
                            >
                                <MenuItem value={2021}>2021</MenuItem>
                                <MenuItem value={2022}>2022</MenuItem>
                                <MenuItem value={2023}>2023</MenuItem>
                                <MenuItem value={2024}>2024</MenuItem>
                                <MenuItem value={2025}>2025</MenuItem>
                            </Select>
                        </FormControl>
                    </span>

                    {/* You may want a toggle for showbudget */}
                    <div className="show-budget-toggle">
                        <input
                            type="checkbox"
                            id="showBudget"
                            checked={showbudget}
                            onChange={BudgetToggle}
                        />
                        <label htmlFor="showBudget">{showbudget ? "Show Budget: ON" : "Show Budget: OFF"}</label>
                    </div>
                </div>

                <div className="cards">
                    {sortedEntries.length === 0 && <div className="empty">No data for selected month</div>}

                    {sortedEntries.map(([ledgerId, data]) => {
                        const total = Number(data?.totalSum || 0);
                        const budget = Number(data?.budget || 0);
                        // percent of overall total (avoid division by zero)
                        const percentage = overallTotal > 0 ? Math.floor((total / overallTotal) * 100) : 0;
                        const budgetDiff = total - budget;
                        const isOverBudget = budgetDiff > 0;

                        // conic-gradient expects degrees: percentage * 3.6
                        const deg = percentage * 3.6;

                        return (
                            <div
                                onClick={() => detail(ledgerId)}
                                className="card"
                                key={ledgerId}
                                id={ledgerId}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="data">
                                    <div className="amt">{fmt(total)}</div>
                                    <div className="day">{data.ledger}</div>

                                    {showbudget && ledgerId !== "Total" && (
                                        <div
                                            className="budget-info"
                                            style={{
                                                fontSize: "12px",
                                                marginTop: 6,
                                            }}
                                        >
                                            Budget: {fmt(budget)} /
                                            {isOverBudget
                                                ? <span style={{
                                                    color: "red",
                                                    fontSize: "12px",
                                                    fontWeight: 500
                                                }} > + {fmt(Math.abs(budgetDiff))}</span>
                                                : <span style={{
                                                    color: "green",
                                                    fontSize: "12px",
                                                    fontWeight: 500
                                                }}> - {fmt(Math.abs(budgetDiff))}</span>
                                            }
                                        </div>
                                    )}


                                    {showbudget && ledgerId === "Total" && (
                                        <div
                                            className="budget-info"
                                            style={{
                                                fontSize: "12px",
                                                marginTop: 6,
                                            }}
                                        >
                                            {/* Budget: {fmt(overallBudget)} <br />
                                            {overallTotal > overallBudget
                                                ? `Exceeded by ${fmt(overallTotal - overallBudget)}`
                                                : `Under by ${fmt(overallBudget - overallTotal)}`} */}

                                            Budget: {fmt(budget)} /
                                            {overallTotal > overallBudget
                                                ? <span style={{
                                                    color: "red",
                                                    fontSize: "12px",
                                                    fontWeight: 500
                                                }} > + {fmt(overallTotal - overallBudget)}</span>
                                                : <span style={{
                                                    color: "green",
                                                    fontSize: "12px",
                                                    fontWeight: 500
                                                }}> - {fmt(overallBudget - overallTotal)}</span>
                                            }
                                        </div>
                                    )}
                                </div>

                                <div className="icon">
                                    <div
                                        className="cir"
                                        style={{
                                            background: `conic-gradient(#034972 ${deg}deg, #afbbcb ${deg}deg)`,
                                        }}
                                    >
                                        <div className="per">{percentage} %</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </>
    );
};

export default Datanalysis;
