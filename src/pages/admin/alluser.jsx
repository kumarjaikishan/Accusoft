import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./alluser.css";
import swal from "sweetalert";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { MdVerified } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import Useredit from "./usereditmodal";

/* =========================
   API HELPERS (SRP)
========================= */

const getToken = () => localStorage.getItem("token");

const fetchUsersApi = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}adminuser`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Not authorised");
    return data.users;
};

const deleteUserApi = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_ADDRESS}removeuser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ id })
    });

    if (!res.ok) throw new Error("Delete failed");
};

/* =========================
   CUSTOM HOOK (DATA ONLY)
========================= */

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchUsersApi();
            setUsers(data);
        } catch (err) {
            toast.warn(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return { users, loading, refetch: fetchUsers };
};

/* =========================
   MAIN COMPONENT
========================= */

const Alluser = () => {
    const { users, loading, refetch } = useUsers();

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({
        id: "",
        name: "",
        phone: "",
        email: "",
        admin: "",
        verified: ""
    });

    /* =========================
       HANDLERS (SRP)
    ========================= */

    const openEditModal = (user) => {
        setForm({
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            admin: user.isadmin,
            verified: user.isverified
        });
        setModal(true);
    };

    const deleteUser = async (id) => {
        const confirm = await swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this data!",
            icon: "warning",
            buttons: true,
            dangerMode: true
        });

        if (!confirm) return;

        const toastId = toast.loading("Deleting...");
        try {
            await deleteUserApi(id);
            toast.update(toastId, {
                render: "Deleted Successfully",
                type: "success",
                isLoading: false,
                autoClose: 1500
            });
            refetch();
        } catch {
            toast.update(toastId, {
                render: "Something went wrong",
                type: "error",
                isLoading: false
            });
        }
    };

    /* =========================
       SEARCH FILTER (SRP)
    ========================= */

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;

        const q = search.toLowerCase();
        return users.filter((u) =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.phone?.includes(search)
        );
    }, [users, search]);

    /* =========================
       TABLE CONFIG (SRP)
    ========================= */

    const columns = [
        { name: "S.no", selector: (_, i) => i + 1, width: "60px" },
        { name: "Name", selector: (row) => row.name },
        { name: "Phone", selector: (row) => row.phone, width: "120px" },
        { name: "Email", selector: (row) => row.email },
        {
            name: "Nos",
            selector: (row) => row.totalExpenses,
            width: "80px"
        },
        {
            name: "Last Active",
            selector: (row) =>
                row.lastActivity
                    ? dayjs(row.lastActivity).format("DD MMM, YYYY")
                    : "-",
            width: "130px"
        },
        {
            name: <MdVerified size={20} />,
            selector: (row) => (
                <span className={row.isverified ? "status done" : "status"}>
                    {row.isverified ? "Yes" : "No"}
                </span>
            ),
            width: "80px"
        },
        {
            name: "Action",
            selector: (row) => (
                <>
                    <HiPencilSquare
                        className="editicon ico"
                        onClick={() => openEditModal(row)}
                    />
                    <RiDeleteBin6Line
                        className="deleteicon ico"
                        onClick={() => deleteUser(row._id)}
                    />
                </>
            ),
            width: "120px"
        },
        {
            name: "Date",
            selector: (row) =>
                dayjs(row.createdAt).format("DD MMM, YY"),
            width: "110px"
        }
    ];

    /* =========================
       JSX
    ========================= */

    return (
        <div className="allusers admin">
            <div className="head">
                <span>All Users List</span>
                <span></span>
                <span>
                    <input
                        type="text"
                        placeholder="Type to search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </span>
            </div>

            <DataTable
                columns={columns}
                data={filteredUsers}
                pagination
                progressPending={loading}
                highlightOnHover
            />

            <Useredit
                inp={form}
                setinp={setForm}
                modal={modal}
                setmodal={setModal}
                fetche={refetch}
            />
        </div>
    );
};

export default Alluser;
