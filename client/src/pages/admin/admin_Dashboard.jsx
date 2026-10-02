import React, { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  RefreshCw,
  Rocket
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { setloader } from "../../store/login";
import DataTable from "../../components/common/DataTable";
import { confirmDialog } from "../../utils/confirm";
import { toast } from "../../utils/toast";
import Useredit from "./usereditmodal";
import DeployModal from "./DeployModal";
import { useApi } from "../../utils/useApi";
import { useTableStyles } from "../../components/dataTableStyle";
import { getAdminTableColumns } from "./AdminTableColumns";

const AdminPanel = () => {
    const dispatch = useDispatch();
    const mode = useSelector((state) => state.theme.mode);
    const { request, loading } = useApi();

    const [data, setData] = useState(null);
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(false);
    const [deployModal, setDeployModal] = useState(false);
    const [form, setForm] = useState({});
    const [filterType, setFilterType] = useState("all"); // all, verified, unverified, admin

    /* ---------------- FETCH ---------------- */
    useEffect(() => {
        refetchUsers();
    }, []);

    useEffect(() => {
        dispatch(setloader(loading));
    }, [loading, dispatch]);

    const refetchUsers = async () => {
        try {
            const res = await request({ url: "adminuser", method: "GET" });
            setData(res);
        } catch (e) {
            console.error(e);
        }
    };

    /* ---------------- DELETE ---------------- */
    const deleteUser = async (id) => {
        const confirm = await confirmDialog({
            title: "Delete User Account?",
            text: "This will permanently remove the user and their associated data. This action cannot be undone.",
            icon: "warning",
            buttons: ["Cancel", "Delete User"],
            dangerMode: true,
        });

        if (!confirm) return;

        const toastId = toast.loading("Deleting user...");
        try {
            const result = await request({
                url: "removeuser",
                method: "POST",
                body: { id },
            });

            toast.update(toastId, {
                render: result?.message || "User deleted successfully",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });
            refetchUsers();
        } catch (error) {
            toast.update(toastId, {
                render: error?.message || "Failed to delete user",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    /* ---------------- SEARCH & FILTER ---------------- */
    const filteredUsers = useMemo(() => {
        if (!data?.users) return [];
        let list = data.users;

        // Status Filter
        if (filterType === "verified") {
            list = list.filter(u => u.isverified);
        } else if (filterType === "unverified") {
            list = list.filter(u => !u.isverified);
        } else if (filterType === "admin") {
            list = list.filter(u => u.isadmin);
        }

        // Search Filter
        if (!search.trim()) return list;
        const q = search.toLowerCase();
        return list.filter(
            (u) =>
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.phone?.includes(q)
        );
    }, [search, data, filterType]);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const columns = getAdminTableColumns({ isMobile, setForm, setModal, deleteUser });

    const TableSkeleton = () => (
        <div className="w-full p-4 space-y-3 bg-white dark:bg-slate-900 animate-pulse">
            {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>
            ))}
        </div>
    );

    const baseTableStyles = useTableStyles();
    const customTableStyles = useMemo(() => ({
        ...baseTableStyles,
        headRow: {
            ...baseTableStyles?.headRow,
            style: {
                ...baseTableStyles?.headRow?.style,
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
            },
        },
    }), [baseTableStyles]);

    return (
        <div
            className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] p-2.5 sm:p-5 space-y-3 transition-colors duration-300 font-sans text-slate-700 dark:text-slate-200 animate-in fade-in"
        >
            {/* ---------------- USER MANAGEMENT TABLE CONTAINER ---------------- */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                {/* Header Toolbar: Search, Filters & Refresh */}
                <div className="p-3.5 sm:p-4 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    {/* Left: Section Title & Status Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mr-1">
                            User Accounts
                        </h2>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                            <button
                                type="button"
                                onClick={() => setFilterType("all")}
                                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] sm:text-xs ${
                                    filterType === "all" 
                                        ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                }`}
                            >
                                All ({data?.users?.length || 0})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterType("verified")}
                                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] sm:text-xs ${
                                    filterType === "verified" 
                                        ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                }`}
                            >
                                Verified
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterType("unverified")}
                                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] sm:text-xs ${
                                    filterType === "unverified" 
                                        ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                }`}
                            >
                                Unverified
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterType("admin")}
                                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] sm:text-xs ${
                                    filterType === "admin" 
                                        ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                }`}
                            >
                                Admins
                            </button>
                        </div>
                    </div>

                    {/* Right: Search & Refresh */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>

                        <button
                            onClick={refetchUsers}
                            title="Refresh user list"
                            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        {/* Deploy Server Button */}
                        <button
                            onClick={() => setDeployModal(true)}
                            title="Deploy updates on Oracle VPS"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold shadow-sm shadow-indigo-500/20 transition cursor-pointer shrink-0"
                        >
                            <Rocket className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Deploy Server</span>
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    customStyles={customTableStyles}
                    className="border-0 shadow-none rounded-none bg-transparent dark:bg-transparent"
                    pagination
                    progressPending={loading}
                    progressComponent={<TableSkeleton />}
                    highlightOnHover
                    noDataComponent={
                        <div className="py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                            <div className="text-4xl mb-2 opacity-30">👥</div>
                            <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No users found</p>
                            <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or status filter</p>
                        </div>
                    }
                />
            </div>

            {/* Modals */}
            {modal && Object.keys(form).length > 0 && (
                <Useredit
                    inp={form}
                    setinp={setForm}
                    modal={modal}
                    setmodal={setModal}
                    fetche={refetchUsers}
                />
            )}

            <DeployModal
                isOpen={deployModal}
                onClose={() => setDeployModal(false)}
            />
        </div>
    );
};

export default AdminPanel;