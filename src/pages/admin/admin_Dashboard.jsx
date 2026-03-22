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
import { useTableStyles } from "../../components/dataTableStyle";
import { getAdminTableColumns } from "./AdminTableColumns";

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

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* ---------------- TABLE ---------------- */

    const columns = getAdminTableColumns({ isMobile, setForm, setModal, deleteUser });

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-2 md:p-6 space-y-8"
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
            <div className="bg-white dark:bg-slate-900 rounded-sm shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] dark:shadow-none border border-transparent dark:border-white/5 p-2 md:p-6 overflow-hidden overflow-x-auto">
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
                    customStyles={useTableStyles()}
                    pagination
                    progressPending={loading}
                    highlightOnHover
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