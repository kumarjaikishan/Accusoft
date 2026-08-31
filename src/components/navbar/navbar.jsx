import React, { useEffect, useState, useRef } from "react";
import { Menu, Sun, Moon, Leaf, User, Palette, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setnarrow } from "../../store/login";
import { toggleTheme, setMainColor } from "../../store/themeSlice";
import Breadcrumbs from "../Breadcrumb";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoginPage = location?.pathname?.includes('login');

  const log = useSelector((state) => state.login);
  const useralldetail = useSelector((state) => state.userexplist);
  const { mode, mainColor } = useSelector((state) => state.theme);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const defaultprofile =
    "https://res.cloudinary.com/dusxlxlvm/image/upload/v1699090690/just_yoljye.png";

  const presets = [
    { name: "Indigo", color: "#4f46e5" },
    { name: "Slate", color: "#334155" },
    { name: "Obsidian", color: "#0f172a" },
    { name: "Emerald", color: "#059669" },
    { name: "Cyan", color: "#0ea5e9" },
    { name: "Violet", color: "#7c3aed" },
    { name: "Rose", color: "#e11d48" },
    { name: "Amber", color: "#d97706" },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSidebar = (e) => {
    e?.stopPropagation();
    dispatch(setnarrow(!log.narrow));
  };

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav
      className={`fixed top-0 h-[var(--navheightmobile)] lg:h-[var(--navheight)] w-full left-0 print:hidden
      ${isLoginPage ? "w-full" : log.narrow
          ? "lg:w-[calc(100%-var(--sidebarnarrow))] lg:left-[var(--sidebarnarrow)]"
          : "lg:w-[calc(100%-var(--sidebarwide))] lg:left-[var(--sidebarwide)]"
        }
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
      border-b border-slate-200/80 dark:border-slate-800
      flex items-center justify-between px-3 sm:px-5 lg:px-6
      transition-all duration-300 z-50 shadow-xs`}
    >
      {/* ---------- LEFT: MENU TOGGLE & BREADCRUMBS ---------- */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {!log.islogin && (
          <Link to="/" className="shrink-0 flex items-center">
            <Leaf size={24} style={{ color: mainColor }} />
          </Link>
        )}

        <button
          onClick={toggleSidebar}
          aria-label="Toggle Navigation"
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 truncate">
          <Breadcrumbs />
        </div>
      </div>

      {/* ---------- RIGHT: THEME TOGGLE & USER PROFILE ---------- */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* 🌙 THEME TOGGLE BUTTON */}
        <button
          onClick={handleTheme}
          aria-label="Toggle Color Theme"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/90 border border-slate-200/70 dark:border-slate-700/70 transition-all duration-200 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200"
        >
          {mode === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* 👤 USER PROFILE & THEME PALETTE DROPDOWN */}
        {log.islogin && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="hidden md:flex flex-col text-right leading-tight min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[130px]">
                  {useralldetail?.user?.name || "Account"}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 capitalize font-medium">
                  {useralldetail?.user?.userType || "User"}
                </span>
              </div>

              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-indigo-500/20 dark:ring-indigo-400/20 shrink-0">
                <img
                  src={
                    useralldetail?.profilepic
                      ? useralldetail.profilepic
                      : defaultprofile
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile & Color Customizer Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[100]"
                >
                  {/* Account Header */}
                  <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 dark:ring-slate-700">
                        <img
                          src={useralldetail?.profilepic || defaultprofile}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                          {useralldetail?.user?.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {useralldetail?.user?.email}
                        </p>
                      </div>
                    </div>

                    <NavLink
                      to="/photo"
                      onClick={() => setIsProfileOpen(false)}
                      className="mt-3 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      <User size={13} /> Edit Profile Photo
                    </NavLink>
                  </div>

                  {/* Brand Color Swatches */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Palette size={14} style={{ color: mainColor }} />
                        <span>Accent Color</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{mainColor}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {presets.map((item) => (
                        <button
                          key={item.color}
                          onClick={() => dispatch(setMainColor(item.color))}
                          title={item.name}
                          className="w-full h-7 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-xs relative overflow-hidden transition-transform hover:scale-105 cursor-pointer flex items-center justify-center"
                          style={{ backgroundColor: item.color }}
                        >
                          {mainColor.toLowerCase() === item.color.toLowerCase() && (
                            <Check size={13} className="text-white drop-shadow-sm" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom Color Input */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-400 font-medium text-[11px]">Custom Hex:</span>
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <input
                          type="color"
                          value={mainColor}
                          onChange={(e) => dispatch(setMainColor(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                          className="w-full h-full shadow-inner"
                          style={{ backgroundColor: mainColor }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;