import React from "react";
import dayjs from "dayjs";
import { Avatar } from "@mui/material";
import { Pencil, Trash2, User } from "lucide-react";

const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

const getDesktopColumns = ({ setForm, setModal, deleteUser }) => [
  { name: "#", selector: (_, i) => i + 1, width: "50px" },
  {
    name: "Name",
    selector: (row) => <div className="flex text-wrap items-center gap-3 ">
      <Avatar
        src={row?.imgsrc}
        alt={'user Profile photo'}
      >
        {!row?.imgsrc && <User />}
      </Avatar>
      <div>
        <p className="text-[12px] md:text-[14px] text-gray-700 text-wrap font-semibold">
          {row?.name}
        </p>
      </div>
    </div>,
    width: '150px'
  },
  { name: "Phone", selector: (row) => row.phone, width: '120px' },
  { name: "Email", selector: (row) => <div className=" min-w-[450px] ">{row.email}</div>, flex: 1 },
  {
    name: "Records",
    selector: (row) => row.totalExpenses,
    width: "100px",
  },
  {
    name: "Last Active",
    selector: (row) =>
      row.lastActivity
        ? dayjs(row.lastActivity).format("DD MMM YY, hh:mm A")
        : "-",
    width: "160px"
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
    width: "100px"
  },
];

const getMobileColumns = ({ setForm, setModal, deleteUser }) => [
  { name: "#", selector: (_, i) => i + 1, width: "50px" },
  {
    name: "Name",
    selector: (row) => <div className="flex text-wrap items-center gap-3 ">
      <Avatar
        src={row?.imgsrc}
        alt={'user Profile photo'}
      >
        {!row?.imgsrc && <User />}
      </Avatar>
      <div>
        <p className="text-[12px] md:text-[14px] text-gray-700 text-wrap font-semibold">
          {row?.name}
        </p>
      </div>
    </div>,
    width: '150px'
  },
  { name: "Phone", selector: (row) => row.phone, width: '120px' },
  { name: "Email", selector: (row) => <div className=" max-w-[250px] ">{row.email}</div>, flex: 1 },
  {
    name: "Rec.",
    selector: (row) => row.totalExpenses,
    width: "8px",
  },
  {
    name: "Last Act",
    selector: (row) =>
      row.lastActivity
        ? dayjs(row.lastActivity).format("DD MMM YY, hh:mm A")
        : "-",
    width: "160px"
  },
  {
    name: "Ver.",
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
    width: "70px"
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
    width: "100px"
  },
];

export const getAdminTableColumns = ({ isMobile, setForm, setModal, deleteUser }) =>
  isMobile ? getMobileColumns({ setForm, setModal, deleteUser }) : getDesktopColumns({ setForm, setModal, deleteUser });



