import React from "react";
import dayjs from "dayjs";
import { 
  Pencil, 
  Trash2, 
  User, 
  BadgeCheck, 
  CircleAlert
} from "lucide-react";

const getDesktopColumns = ({ setForm, setModal, deleteUser }) => [
  { 
    name: "#", 
    selector: (_, i) => i + 1, 
    width: "60px",
    cell: (_, i) => <span className="text-xs font-semibold text-slate-400">{i + 1}</span>
  },
  {
    name: "User",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="flex items-center gap-3 py-1">
        <div className="w-[34px] h-[34px] rounded-full overflow-hidden shrink-0 ring-2 ring-slate-100 dark:ring-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {row?.imgsrc ? (
            <img src={row.imgsrc} alt={row?.name || "User Avatar"} className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-slate-500" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {row?.name || "Unnamed"}
            </p>
            {row?.isadmin && (
              <span className="px-1.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 text-[10px] font-bold border border-purple-200/50 dark:border-purple-800/50">
                Admin
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {row?.email}
          </p>
        </div>
      </div>
    ),
    grow: 2,
  },
  { 
    name: "Phone", 
    selector: (row) => row.phone || "-", 
    width: "120px",
    cell: (row) => <span className="text-xs font-medium text-slate-600 dark:text-slate-300 font-mono">{row.phone || "-"}</span>
  },
  {
    name: "Records",
    selector: (row) => row.totalExpenses,
    sortable: true,
    width: "95px",
    cell: (row) => (
      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono">
        {row.totalExpenses || 0}
      </span>
    ),
  },
  {
    name: "Last Active",
    selector: (row) => row.lastActivity,
    sortable: true,
    width: "150px",
    cell: (row) => (
      <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
        {row.lastActivity ? dayjs(row.lastActivity).format("DD MMM YY, hh:mm A") : "Never"}
      </span>
    ),
  },
  {
    name: "Verified",
    selector: (row) => row.isverified,
    sortable: true,
    width: "105px",
    cell: (row) => (
      <div className="flex items-center">
        {row.isverified ? (
          <span
            title="Email Verified"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm"
          >
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Verified
          </span>
        ) : (
          <span
            title="Unverified Email"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50 shadow-sm"
          >
            <CircleAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Pending
          </span>
        )}
      </div>
    ),
  },
  {
    name: "Actions",
    width: "90px",
    cell: (row) => (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            setForm(row);
            setModal(true);
          }}
          title="Edit User"
          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => deleteUser(row._id)}
          title="Delete User"
          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    ),
  },
];

const getMobileColumns = ({ setForm, setModal, deleteUser }) => [
  {
    name: "User",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="flex items-center gap-2 py-1">
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {row?.imgsrc ? (
            <img src={row.imgsrc} alt={row?.name || "User Avatar"} className="w-full h-full object-cover" />
          ) : (
            <User className="w-3.5 h-3.5 text-slate-500" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
              {row?.name || "User"}
            </p>
            {row?.isverified ? (
              <BadgeCheck className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <CircleAlert className="w-3 h-3 text-rose-500 shrink-0" />
            )}
          </div>
          <p className="text-[9.5px] text-slate-400 truncate">
            {row?.phone || row?.email}
          </p>
        </div>
      </div>
    ),
    grow: 2,
  },
  {
    name: "Active",
    selector: (row) => row.lastActivity,
    sortable: true,
    width: "82px",
    cell: (row) => (
      <span className="text-[9.5px] font-medium text-slate-600 dark:text-slate-400 leading-tight">
        {row.lastActivity ? dayjs(row.lastActivity).format("DD MMM, hh:mm A") : "Never"}
      </span>
    ),
  },
  {
    name: "Rec",
    selector: (row) => row.totalExpenses,
    width: "42px",
    cell: (row) => (
      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 font-mono">
        {row.totalExpenses || 0}
      </span>
    ),
  },
  {
    name: "Act",
    width: "60px",
    cell: (row) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            setForm(row);
            setModal(true);
          }}
          className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={() => deleteUser(row._id)}
          className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    ),
  },
];

export const getAdminTableColumns = ({ isMobile, setForm, setModal, deleteUser }) =>
  isMobile ? getMobileColumns({ setForm, setModal, deleteUser }) : getDesktopColumns({ setForm, setModal, deleteUser });
