import React, { useState, useEffect } from "react";
import {
    ChevronDown,
    LayoutDashboard,
    LogOut,
    User,
    Landmark,
    BarChart,
    Hourglass,
    Server,
    Book,
    Activity,
    MessageSquare,
    Shield,
    Radio,
    Lock,
    Zap
} from 'lucide-react';

import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { confirmDialog } from "../../utils/confirm";
import { toast } from "../../utils/toast";
import { header } from "../../store/login";

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const log = useSelector((state) => state.login);
    const user = useSelector((state) => state.userexplist?.user);
    const { mode, mainColor } = useSelector((state) => state.theme);

    const isAdminActive = location.pathname.startsWith("/admin") && !location.pathname.startsWith("/admin/slow");
    const isServerActive = location.pathname.startsWith("/admin/slow") || location.pathname.startsWith("/admin/slowworker");

    const [adminOpen, setAdminOpen] = useState(isAdminActive);
    const [serverOpen, setServerOpen] = useState(isServerActive);

    // Keep submenus open dynamically based on route switching
    useEffect(() => {
        if (isAdminActive) setAdminOpen(true);
        if (isServerActive) setServerOpen(true);
    }, [isAdminActive, isServerActive]);

    const menu = [
        { name: "Dashboard", link: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Expenses", link: "/expense", icon: <Landmark size={18} /> },
        { name: "Analysis", link: "/data_analysis", icon: <Book size={18} /> },
        { name: "Report", link: "/report", icon: <BarChart size={18} /> }
    ];

    const logoutHandler = async () => {
        const confirm = await confirmDialog({
            title: "Are you sure to Logout?",
            text: "You will be redirected to the login page.",
            icon: "warning",
            buttons: ["Cancel", "Logout"],
            dangerMode: true
        });

        if (confirm) {
            dispatch(header("Login"));
            toast.success("Logout successful", { autoClose: 1300 });
            navigate("/logout");
        }
    };

    // Top-Level Main Navigation Style (Semantic & Plain Color)
    const getNavLinkClass = (isActive) =>
        `group relative flex w-full items-center ${log.narrow ? "justify-center px-0" : "px-3"} py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200
     ${isActive
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-xs"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
        }`;

    const getNavLinkStyle = (isActive) =>
        isActive ? {
            backgroundColor: mode === 'dark' ? `${mainColor}22` : `${mainColor}15`,
            color: mainColor,
            borderLeft: `3px solid ${mainColor}`,
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
        } : {};

    // Submenu Group Header (Parent Button - Semantic & Plain Color)
    const getSubmenuHeaderClass = (isOpen, isChildActive) =>
        `flex items-center w-full ${log.narrow ? "justify-center px-0" : "justify-between px-3"} py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 cursor-pointer ${isChildActive
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
        }`;

    // Submenu Item (Child Links - Semantic & Plain Color)
    const getSubmenuLinkClass = (isActive) =>
        `group relative flex w-full items-center ${log.narrow ? "justify-center px-0" : "px-2.5"} py-2 rounded-lg text-[13px] transition-all duration-150
     ${isActive
            ? "font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 shadow-xs"
            : "font-normal text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 hover:translate-x-0.5"
        }`;

    const getSubmenuLinkStyle = (isActive) =>
        isActive ? {
            color: mainColor,
            backgroundColor: mode === 'dark' ? `${mainColor}25` : `${mainColor}18`,
        } : {};

    return (
        <div
            className={`fixed top-0 left-0 h-screen z-[102] print:hidden
            bg-white dark:bg-slate-900
            backdrop-blur-xl border-r border-slate-200 dark:border-slate-800
            transition-all duration-300 flex flex-col overflow-x-hidden

            w-[var(--sidebarwidemobile)]
            ${log.narrow
                    ? "-translate-x-full lg:translate-x-0 lg:w-[var(--sidebarnarrow)]"
                    : "translate-x-0 lg:w-[var(--sidebarwide)]"
                }
            `}
        >
            {/* Logo Header */}
            <Link to="/">
                <div className="h-[var(--navheightmobile)] lg:h-[var(--navheight)] flex items-center px-4 border-b border-slate-200 dark:border-slate-800 gap-2.5">
                    <img
                        src="/logo.webp"
                        alt="Accusoft"
                        className="w-8 h-8 object-contain shrink-0 rounded-lg"
                    />
                    <span className={`text-xl font-black tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>
                        <span className="text-[#0B1B3D] dark:text-white">Accu</span>
                        <span className="text-[#0070F3] dark:text-[#2E90FA]">soft</span>
                    </span>
                </div>
            </Link>

            {/* Menu Body */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 thin-scrollbar">

                {log.islogin &&
                    menu.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.link}
                            className={({ isActive }) => getNavLinkClass(isActive)}
                            style={({ isActive }) => getNavLinkStyle(isActive)}
                            onClick={() => dispatch(header(item.name))}
                        >
                            <span className="min-w-[20px] flex justify-center">{item.icon}</span>
                            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>
                                {item.name}
                            </span>
                        </NavLink>
                    ))}

                {/* 🛡️ Admin Parent Dropdown */}
                {log.islogin && user?.isadmin && (
                    <div className="space-y-0.5">
                        <button
                            type="button"
                            onClick={() => setAdminOpen(!adminOpen)}
                            className={getSubmenuHeaderClass(adminOpen, isAdminActive)}
                        >
                            <div className="flex items-center">
                                <span className="min-w-[20px] flex justify-center">
                                    <Shield size={18} />
                                </span>
                                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>
                                    Admin
                                </span>
                            </div>
                            <span className={`transition-transform duration-200 overflow-hidden text-slate-400 ${log.narrow ? "max-w-0 opacity-0" : "opacity-100"} ${adminOpen ? "rotate-180" : ""}`}>
                                <ChevronDown size={15} />
                            </span>
                        </button>

                        {/* ↳ Submenu Items with Tree Guide Line */}
                        <div
                            className={`overflow-hidden transition-all duration-200 ${adminOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            <div className="ml-4.5 pl-2.5 my-1 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
                                <NavLink
                                    to="/admin/dashboard"
                                    className={({ isActive }) => getSubmenuLinkClass(isActive)}
                                    style={({ isActive }) => getSubmenuLinkStyle(isActive)}
                                    onClick={() => dispatch(header("Admin Dashboard"))}
                                >
                                    <LayoutDashboard size={15} className="shrink-0" />
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-2"}`}>Dashboard</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/logs"
                                    className={({ isActive }) => getSubmenuLinkClass(isActive)}
                                    style={({ isActive }) => getSubmenuLinkStyle(isActive)}
                                    onClick={() => dispatch(header("System Logs"))}
                                >
                                    <Activity size={15} className="shrink-0" />
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-2"}`}>Logs</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/contacts"
                                    className={({ isActive }) => getSubmenuLinkClass(isActive)}
                                    style={({ isActive }) => getSubmenuLinkStyle(isActive)}
                                    onClick={() => dispatch(header("User Inquiries"))}
                                >
                                    <MessageSquare size={15} className="shrink-0" />
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-2"}`}>Inquiries</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/tip"
                                    className={({ isActive }) => getSubmenuLinkClass(isActive)}
                                    style={({ isActive }) => getSubmenuLinkStyle(isActive)}
                                    onClick={() => dispatch(header("StreamElement"))}
                                >
                                    <Radio size={15} className="shrink-0" />
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-2"}`}>StreamElement</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/vault"
                                    className={({ isActive }) => getSubmenuLinkClass(isActive)}
                                    style={({ isActive }) => getSubmenuLinkStyle(isActive)}
                                    onClick={() => dispatch(header("Credential Vault"))}
                                >
                                    <Lock size={15} className="shrink-0" />
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-2"}`}>Vault</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                )}

                {/* ⚙️ Server Testing Parent Dropdown */}
                {log.islogin && user?.isadmin && (
                    <div className="space-y-0.5">
                        <button
                            type="button"
                            onClick={() => setServerOpen(!serverOpen)}
                            className={getSubmenuHeaderClass(serverOpen, isServerActive)}
                        >
                            <div className="flex items-center">
                                <span className="min-w-[20px] flex justify-center">
                                    <Server size={18} />
                                </span>
                                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>
                                    Benchmarks
                                </span>
                            </div>
                            <span className={`transition-transform duration-200 overflow-hidden text-slate-400 ${log.narrow ? "max-w-0 opacity-0" : "opacity-100"} ${serverOpen ? "rotate-180" : ""}`}>
                                <ChevronDown size={15} />
                            </span>
                        </button>

                        {/* ↳ Submenu Items with Tree Guide Line */}
                        <div
                            className={`overflow-hidden transition-all duration-200 ${serverOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            <div className="ml-4.5 pl-2.5 my-1 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
                                <NavLink
                                    to="/admin/slow"
                                    className={({ isActive }) => getSubmenuLinkClass(isActive)}
                                    style={({ isActive }) => getSubmenuLinkStyle(isActive)}
                                    onClick={() => dispatch(header("Server Stress (Loop)"))}
                                >
                                    <Hourglass size={15} className="shrink-0" />
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-2"}`}>Server Slow</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/slowworker"
                                    className={({ isActive }) => getSubmenuLinkClass(isActive)}
                                    style={({ isActive }) => getSubmenuLinkStyle(isActive)}
                                    onClick={() => dispatch(header("Worker Threads"))}
                                >
                                    <Zap size={15} className="shrink-0" />
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-2"}`}>Worker Fast</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-slate-200 dark:border-slate-800">
                {log.islogin ? (
                    <button
                        onClick={logoutHandler}
                        className={`w-full flex cursor-pointer items-center ${log.narrow ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-xl 
            bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all duration-200 text-[13.5px] font-bold`}
                    >
                        <span className="min-w-[20px] flex justify-center"><LogOut size={18} /></span>
                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>Logout</span>
                    </button>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => getNavLinkClass(isActive)} style={({ isActive }) => getNavLinkStyle(isActive)}>
                        <span className="min-w-[20px] flex justify-center"><User size={18} /></span>
                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${log.narrow ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100 ml-3"}`}>Login</span>
                    </NavLink>
                )}
            </div>
        </div>
    );
};

export default Sidebar;