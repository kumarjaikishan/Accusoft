import React, { useState, useEffect } from "react";
import { Leaf, ChevronDown, ChevronUp, Banknote, Lock, LayoutDashboard, Truck, LogOut, User, Landmark, BarChart, Hourglass, Server, Book } from 'lucide-react';

import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { header } from "../../store/login";

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const log = useSelector((state) => state.login);
    const user = useSelector((state) => state.userexplist?.user);
    const { mode, mainColor } = useSelector((state) => state.theme);

    const isAdminActive = location.pathname.startsWith("/admin");
    const isServerActive = location.pathname.startsWith("/slow") || location.pathname.startsWith("/slowworker");

    const [adminOpen, setAdminOpen] = useState(isAdminActive);
    const [serverOpen, setServerOpen] = useState(isServerActive);

    // Keep submenus alive dynamically based on route switching
    useEffect(() => {
        if (isAdminActive) setAdminOpen(true);
        if (isServerActive) setServerOpen(true);
    }, [isAdminActive, isServerActive]);

    const menu = [
        { name: "Dashboard", link: "/dashboard", icon: <LayoutDashboard /> },
        { name: "Expenses", link: "/expense", icon: <Landmark /> },
        { name: "Analysis", link: "/data_analysis", icon: <Book /> },
        { name: "Report", link: "/report", icon: <BarChart /> }
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

    const getNavLinkClass = (isActive) =>
        `group relative flex w-full items-center ${log.narrow ? "justify-center px-0" : "px-3 lg:px-4"} py-2 lg:py-3 rounded-lg transition-all duration-300
     ${isActive
            ? "" // Dynamic colors handled via style prop
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
        }`;

    const getNavLinkStyle = (isActive) => 
        isActive ? {
            backgroundColor: mode === 'dark' ? `${mainColor}22` : `${mainColor}11`,
            color: mainColor,
            borderLeft: `4px solid ${mainColor}`,
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            fontWeight: '600'
        } : {};

    const getSubmenuHeaderClass = (isActive) =>
        `flex items-center w-full ${log.narrow ? "justify-center px-0" : "justify-between px-3 lg:px-4"} py-2 lg:py-3 rounded-lg transition-all duration-300 ${isActive
            ? "font-medium shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)]"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
        }`;

    const getSubmenuHeaderStyle = (isActive) =>
        isActive ? {
            backgroundColor: mode === 'dark' ? `${mainColor}22` : `${mainColor}11`,
            color: mainColor,
        } : {};

    return (
        <div
            className={`fixed top-0 left-0 h-screen z-[102] print:hidden
            bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
            backdrop-blur-xl border-r border-gray-200 dark:border-white/10
            transition-all duration-300 flex flex-col overflow-x-hidden

            w-[var(--sidebarwidemobile)]
            ${log.narrow
                    ? "-translate-x-full lg:translate-x-0 lg:w-[var(--sidebarnarrow)]"
                    : "translate-x-0 lg:w-[var(--sidebarwide)]"
                }
            `}
        >
            {/* Logo */}
            <Link to="/">
                <div className="h-[var(--navheightmobile)] lg:h-[var(--navheight)] flex items-center px-6 border-b border-gray-200 dark:border-white/10">
                    <Leaf size={40} style={{ color: mainColor }} />
                    <span className={`text-lg font-bold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`} style={{ color: mainColor }}>
                        Accusoft
                    </span>
                </div>
            </Link>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-2">

                {log.islogin &&
                    menu.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.link}
                            className={({ isActive }) => getNavLinkClass(isActive)}
                            style={({ isActive }) => getNavLinkStyle(isActive)}
                            onClick={() => dispatch(header(item.name))}
                        >
                            <span className="text-lg min-w-[24px] flex justify-center">{item.icon}</span>
                            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>
                                {item.name}
                            </span>
                        </NavLink>
                    ))}

                {/* Admin Section */}
                {log.islogin && user?.isadmin && (
                    <>
                        <button
                            type="button"
                            onClick={() => setAdminOpen(!adminOpen)}
                            className={getSubmenuHeaderClass(isAdminActive)}
                            style={getSubmenuHeaderStyle(isAdminActive)}
                        >
                            <div className="flex items-center">
                                <span className="text-lg min-w-[24px] flex justify-center"><Lock /></span>
                                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>
                                    Admin
                                </span>
                            </div>
                            <span className={`transition-all duration-300 overflow-hidden ${log.narrow ? "max-w-0 opacity-0" : "opacity-100"}`}>
                                {adminOpen ? <ChevronUp /> : <ChevronDown />}
                            </span>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${adminOpen ? "max-h-96 mt-1" : "max-h-0"
                                }`}
                        >
                            <div className="ml-2 space-y-1">
                                <NavLink to="/admin/dashboard" className={({ isActive }) => getNavLinkClass(isActive)} style={({ isActive }) => getNavLinkStyle(isActive)}>
                                    <span className="text-lg min-w-[24px] flex justify-center"><LayoutDashboard /></span>
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>Dashboard</span>
                                </NavLink>

                                <NavLink to="/admin/logs" className={({ isActive }) => getNavLinkClass(isActive)} style={({ isActive }) => getNavLinkStyle(isActive)}>
                                    <span className="text-lg min-w-[24px] flex justify-center"><User /></span>
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>Logs</span>
                                </NavLink>

                                <NavLink to="/admin/tip" className={({ isActive }) => getNavLinkClass(isActive)} style={({ isActive }) => getNavLinkStyle(isActive)}>
                                    <span className="text-lg min-w-[24px] flex justify-center"><Banknote /></span>
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>StreamElement</span>
                                </NavLink>
                            </div>
                        </div>
                    </>
                )}

                {/* Server Section */}
                {log.islogin && user?.isadmin && (
                    <>
                        <button
                            type="button"
                            onClick={() => setServerOpen(!serverOpen)}
                            className={getSubmenuHeaderClass(isServerActive)}
                            style={getSubmenuHeaderStyle(isServerActive)}
                        >
                            <div className="flex items-center">
                                <span className="text-lg min-w-[24px] flex justify-center"><Server /></span>
                                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>
                                    Server
                                </span>
                            </div>
                            <span className={`transition-all duration-300 overflow-hidden ${log.narrow ? "max-w-0 opacity-0" : "opacity-100"}`}>
                                {serverOpen ? <ChevronUp /> : <ChevronDown />}
                            </span>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${serverOpen ? "max-h-40 mt-1" : "max-h-0"
                                }`}
                        >
                            <div className="ml-2 space-y-1">
                                <NavLink to="/admin/slow" className={({ isActive }) => getNavLinkClass(isActive)} style={({ isActive }) => getNavLinkStyle(isActive)}>
                                    <span className="text-lg min-w-[24px] flex justify-center"><Hourglass /></span>
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>Server Slow</span>
                                </NavLink>

                                <NavLink to="/admin/slowworker" className={({ isActive }) => getNavLinkClass(isActive)} style={({ isActive }) => getNavLinkStyle(isActive)}>
                                    <span className="text-lg min-w-[24px] flex justify-center"><Truck /></span>
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>Worker Fast</span>
                                </NavLink>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-white/10">
                {log.islogin ? (
                    <button
                        onClick={logoutHandler}
                        className={`w-full flex cursor-pointer items-center ${log.narrow ? 'justify-center px-0' : 'px-3 lg:px-4'} py-2 lg:py-3 rounded-lg 
            bg-red-50 dark:bg-gray-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-500/20 transition-all duration-200`}
                    >
                        <span className="text-lg min-w-[24px] flex justify-center"><LogOut /></span>
                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>Logout</span>
                    </button>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => getNavLinkClass(isActive)} style={({ isActive }) => getNavLinkStyle(isActive)}>
                        <span className="text-lg min-w-[24px] flex justify-center"><User /></span>
                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>Login</span>
                    </NavLink>
                )}
            </div>
        </div>
    );
};

export default Sidebar;