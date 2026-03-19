import React, { useEffect, useState, useMemo } from "react";
import { Users, Scale, User, BadgeCheck, Pencil, Trash2 } from 'lucide-react';

import { useDispatch, useSelector } from "react-redux";
import { setloader } from "../../store/login";
import { motion } from "framer-motion";

import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import swal from "sweetalert";
import { toast } from "react-toastify";
import Useredit from "./usereditmodal";
import { useApi } from "../../utils/useApi";
import { Avatar, Grow } from "@mui/material";

const AdminPanel = () => {
    const dispatch = useDispatch();
    const mode = useSelector((state) => state.theme.mode);
    const { request, loading, data } = useApi();

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({});

    /* ---------------- FETCH ---------------- */
    useEffect(() => {
        refetchUsers()
    }, []);
    useEffect(() => {
        // console.log(data)
    }, [data]);

    useEffect(() => {
        dispatch(setloader(loading));
    }, [loading]);

    const refetchUsers = async () => {
        await request({ url: "adminuser", method: "GET" });
    };

    const derivedData = useMemo(() => {
        if (!data?.users) {
            return { totalUsers: 0, totalRecords: 0 };
        }

        let totalUsers = data?.users?.length
        const totalRecords = data.users.reduce(
            (sum, user) => sum + (user.totalExpenses || 0),
            0
        );

        return { totalUsers, totalRecords }
    }, [data])

    /* ---------------- DELETE ---------------- */
    const deleteUser = async (id) => {
        const confirm = await swal({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (!confirm) return;

        const toastId = toast.loading("Deleting...");
        try {
            await fetch(`${import.meta.env.VITE_API_ADDRESS}removeuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ id }),
            });

            toast.update(toastId, {
                render: "Deleted Successfully",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });

            refetchUsers();
        } catch {
            toast.update(toastId, {
                render: "Error deleting",
                type: "error",
                isLoading: false,
            });
        }
    };

    /* ---------------- SEARCH ---------------- */
    const filteredUsers = useMemo(() => {
        if (!search.trim()) return data?.users;
        const q = search.toLowerCase();
        return data?.users?.filter(
            (u) =>
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q)
            // || u.phone?.includes(search)
        );
    }, [search, data]);

    /* ---------------- TABLE ---------------- */
    const columns = [
        { name: "#", selector: (_, i) => i + 1, width: "60px" },
        {
            name: "Name", selector: (row) => <div className="flex items-center gap-3 ">
                <Avatar
                    src={row?.imgsrc}
                    alt={'user Profile photo'}
                >
                    {!row?.imgsrc && <User />}
                </Avatar>
                <div>
                    <p className="text-[12px] md:text-[14px] text-gray-700 font-semibold">
                        {row?.name}
                    </p>
                </div>
            </div>
        },
        { name: "Phone", selector: (row) => row.phone },
        { name: "Email", selector: (row) => row.email , Grow:2 },
        {
            name: "Expenses",
            selector: (row) => row.totalExpenses,
            width: "100px",
        },
        {
            name: "Last Active",
            selector: (row) =>
                row.lastActivity
                    ? dayjs(row.lastActivity).format("DD MMM YYYY")
                    : "-",
            width: "120px"
        },
        {
            name: "Verified",
            selector: (row) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${row.isverified
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                >
                    {row.isverified ? "Yes" : "No"}
                </span>
            ),
            width: "100px"
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="flex gap-3">
                    <Pencil
                        className="cursor-pointer text-indigo-600 hover:scale-110 transition"
                        onClick={() => {
                            setForm(row);
                            setModal(true);
                        }}
                    />
                    <Trash2
                        className="cursor-pointer text-red-500 hover:scale-110 transition"
                        onClick={() => deleteUser(row._id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 space-y-8"
        >
            {/* ---------------- STATS CARDS ---------------- */}
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
                    <div>
                        <p className="text-sm opacity-80">Total Users</p>
                        <h2 className="text-3xl font-bold">
                            {derivedData?.totalUsers || 0}
                        </h2>
                    </div>
                    <Users size={40} className="opacity-70" />
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl p-6 shadow-lg flex justify-between items-center">
                    <div>
                        <p className="text-sm opacity-80">Total Expense Records</p>
                        <h2 className="text-3xl font-bold">
                            {derivedData?.totalRecords || 0}
                        </h2>
                    </div>
                    <Scale size={40} className="opacity-70" />
                </div>
            </div>

            {/* ---------------- USER TABLE ---------------- */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] dark:shadow-none border border-transparent dark:border-white/5 p-6 overflow-hidden overflow-x-auto">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold dark:text-gray-100">
                        All Users
                    </h2>

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-200 dark:border-white/10 dark:bg-slate-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    pagination
                    progressPending={loading}
                    highlightOnHover
                    customStyles={{
                        table: {
                            style: { backgroundColor: 'transparent' },
                        },
                        header: {
                            style: { backgroundColor: 'transparent', color: mode === 'dark' ? '#f3f4f6' : '#1f2937' },
                        },
                        headRow: {
                            style: { backgroundColor: mode === 'dark' ? '#1e293b' : '#f9fafb', borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#e5e7eb' },
                        },
                        headCells: {
                            style: { fontWeight: "600", fontSize: "14px", color: mode === 'dark' ? '#d1d5db' : '#374151' },
                        },
                        rows: {
                            style: { padding: "10px 0", backgroundColor: mode === 'dark' ? '#0f172a' : '#ffffff', borderBottomColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#e5e7eb', color: mode === 'dark' ? '#f3f4f6' : '#1f2937' },
                            highlightOnHoverStyle: { backgroundColor: mode === 'dark' ? '#1e293b' : '#f3f4f6', color: mode === 'dark' ? '#ffffff' : '#111827', borderBottomColor: mode === 'dark' ? '#334155' : '#d1d5db', transitionDuration: '0.15s', outline: 'none' },
                        },
                        pagination: {
                            style: { backgroundColor: mode === 'dark' ? '#0f172a' : '#ffffff', color: mode === 'dark' ? '#d1d5db' : '#374151', borderTopColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#e5e7eb' },
                        },
                    }}
                />
            </div>

            {modal && Object.keys(form).length > 0 && (
                <Useredit
                    inp={form}
                    setinp={setForm}
                    modal={modal}
                    setmodal={setModal}
                    fetche={refetchUsers}
                />)}
        </motion.div>
    );
};

export default AdminPanel;