import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { header } from "../../store/login";

import {
    MdOutlineGrass,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdOutlineAttachMoney
} from "react-icons/md";

import {
    FaLock,
    FaTachometerAlt,
    FaShippingFast,
    FaSignOutAlt,
    FaRegUser
} from "react-icons/fa";

import { CiUser } from "react-icons/ci";
import { BsBank2 } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { PiHourglassLowFill } from "react-icons/pi";
import { FaServer, FaBook } from "react-icons/fa6";

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const log = useSelector((state) => state.login);
    const user = useSelector((state) => state.userexplist?.user);

    const [adminOpen, setAdminOpen] = useState(false);
    const [serverOpen, setServerOpen] = useState(false);

    const menu = [
        { name: "Dashboard", link: "/", icon: <FaTachometerAlt /> },
        { name: "Expenses", link: "/expense", icon: <BsBank2 /> },
        { name: "Analysis", link: "/datanalysis", icon: <FaBook /> },
        { name: "Report", link: "/report", icon: <TbReportAnalytics /> }
    ];

    const logoutHandler = () => {
        swal({
            title: "Are you sure to Logout?",
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then((confirm) => {
            if (confirm) {
                dispatch(header("Login"));
                toast.success("Logout successful", { autoClose: 1300 });
                navigate("/logout");
            }
        });
    };

    const navLinkStyle = ({ isActive }) =>
        `group relative flex items-center gap-3 px-3 lg-px-4 py-2 lg-py-3 rounded-lg transition-all duration-200
     ${isActive
            ? "bg-white/10 text-white border-l-3 lg:border-l-4 border-cyan-400"
            : "text-gray-300 hover:bg-white/5 hover:text-white"
        }`;

    return (
        <div
            className={`fixed top-0 left-0 h-screen  z-102
  bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
  backdrop-blur-xl border-r border-white/10
  transition-all duration-200 flex flex-col overflow-x-hidden

  ${log.narrow
                    ? "w-0 lg:w-[var(--sidebarnarrow)]"
                    : "w-[180px] lg:w-[var(--sidebarwide)]"
                }
  `}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-white/10">
                <MdOutlineGrass className="text-6xl text-cyan-400" />
                {!log.narrow && (
                    <span className="ml-3 text-lg font-semibold text-white tracking-wide">
                        Accusoft
                    </span>
                )}
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto p-2 lg-p-4 space-y-2">

                {log.islogin &&
                    menu.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.link}
                            className={navLinkStyle}
                            onClick={() => dispatch(header(item.name))}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {!log.narrow && <span>{item.name}</span>}
                        </NavLink>
                    ))}

                {/* Admin Section */}
                {log.islogin && user?.isadmin && (
                    <>
                        <button
                            onClick={() => setAdminOpen(!adminOpen)}
                            className="flex items-center justify-between w-full px-3 lg-px-4 py-2 lg-py-3 text-gray-300 rounded-lg hover:bg-white/5 transition"
                        >
                            <div className="flex items-center gap-3">
                                <FaLock />
                                {!log.narrow && <span>Admin</span>}
                            </div>
                            {!log.narrow &&
                                (adminOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />)}
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-200 ${adminOpen ? "max-h-96 mt-1" : "max-h-0"
                                }`}
                        >
                            <div className="ml-2 space-y-1">
                                <NavLink to="/admin/dashboard" className={navLinkStyle}>
                                    <FaTachometerAlt />
                                    {!log.narrow && "Dashboard"}
                                </NavLink>

                                <NavLink to="/admin/users" className={navLinkStyle}>
                                    <CiUser />
                                    {!log.narrow && "Users"}
                                </NavLink>

                                <NavLink to="/admin/logs" className={navLinkStyle}>
                                    <CiUser />
                                    {!log.narrow && "Logs"}
                                </NavLink>

                                <NavLink to="/admin/tip" className={navLinkStyle}>
                                    <MdOutlineAttachMoney />
                                    {!log.narrow && "StreamElement"}
                                </NavLink>
                            </div>
                        </div>
                    </>
                )}

                {/* Server Section */}
                {log.islogin && user?.isadmin && (
                    <>
                        <button
                            onClick={() => setServerOpen(!serverOpen)}
                            className="flex items-center justify-between w-full px-3 lg-px-4 py-2 lg-py-3 text-gray-300 rounded-lg hover:bg-white/5 transition"
                        >
                            <div className="flex items-center gap-3">
                                <FaServer />
                                {!log.narrow && <span>Server</span>}
                            </div>
                            {!log.narrow &&
                                (serverOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />)}
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-200 ${serverOpen ? "max-h-40 mt-1" : "max-h-0"
                                }`}
                        >
                            <div className="ml-2 space-y-1">
                                <NavLink to="/slow" className={navLinkStyle}>
                                    <PiHourglassLowFill />
                                    {!log.narrow && "Server Slow"}
                                </NavLink>

                                <NavLink to="/slowworker" className={navLinkStyle}>
                                    <FaShippingFast />
                                    {!log.narrow && "Worker Fast"}
                                </NavLink>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                {log.islogin ? (
                    <button
                        onClick={logoutHandler}
                        className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 rounded-lg 
            bg-gray-500/10 text-red-400 hover:bg-gray-500/20 transition"
                    >
                        <FaSignOutAlt />
                        {!log.narrow && "Logout"}
                    </button>
                ) : (
                    <NavLink to="/login" className={navLinkStyle}>
                        <FaRegUser />
                        {!log.narrow && "Login"}
                    </NavLink>
                )}
            </div>
        </div>
    );
};

export default Sidebar;