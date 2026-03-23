import React, { useEffect, useState, useRef } from "react";
import { Menu, Sun, Moon, Leaf, User, Palette, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setnarrow } from "../../store/login";
import { toggleTheme, setMainColor } from "../../store/themeSlice";

import Breadcrumbs from "../Breadcrumb";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  //  console.log(location)
  let isLoginPage = location?.pathname?.includes('login')
  //  console.log(isLoginPage)

  const log = useSelector((state) => state.login);
  const useralldetail = useSelector((state) => state.userexplist);
  const { mode, mainColor } = useSelector((state) => state.theme);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const defaultprofile =
    "https://res.cloudinary.com/dusxlxlvm/image/upload/v1699090690/just_yoljye.png";

  const presets = [
    '#1e293b', // Slate
    '#0a3d62', // Default Blue
    '#7c3aed', // Violet
    '#db2777', // Pink
    '#059669', // Emerald
    '#ea580c', // Orange
    '#2563eb', // Blue
    '#4f46e5', // Indigo
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

  // Sidebar toggle
  const fun = () => {
    dispatch(setnarrow(!log.narrow));
  };

  // 🎯 Toggle theme
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
       bg-white dark:bg-slate-900
      text-[var(--contrast)]
      shadow-sm border-b border-[var(--tableborder)]
      flex items-center justify-between px-2 lg:px-6
      transition-all duration-300 z-50`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-1 lg:gap-4">
        {!log.islogin &&
          <Link to="/">
            <Leaf size={30} style={{ color: mainColor }} />
          </Link>
        }
        <Menu
          onClick={(e) => {
            e.stopPropagation();
            fun();
          }}
          className="text-2xl cursor-pointer transition"
          style={{ color: log.narrow ? 'inherit' : mainColor }}
          onMouseOver={(e) => e.currentTarget.style.color = mainColor}
          onMouseOut={(e) => e.currentTarget.style.color = log.narrow ? 'inherit' : mainColor}
        />

        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          <Breadcrumbs />
        </div>
      </div>

      {/* RIGHT */}
      <div
        className={`flex items-center gap-6 transition-transform duration-300
        ${!log.narrow
            ? "translate-x-[400px] lg:translate-x-0"
            : "translate-x-0"
          }`}
      >
        {/* 🌙 THEME TOGGLE */}
        <div
          onClick={handleTheme}
          className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg 
  bg-slate-100 dark:bg-slate-800/70
  hover:bg-slate-200 dark:hover:bg-slate-700/80
  border border-slate-200 dark:border-slate-700
  transition-all duration-300"
        >
          {mode === "dark" ? (
            <>
              <Sun className="text-amber-400 text-lg" />
              <span className="text-slate-700 dark:text-slate-200">Light</span>
            </>
          ) : (
            <>
              <Moon style={{ color: mainColor }} className="text-lg" />
              <span className="text-slate-700 dark:text-slate-200">Dark</span>
            </>
          )}
        </div>

        {/* 👤 USER INFO & DROPDOWN */}
        {log.islogin && (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="hidden md:flex flex-col text-right leading-tight">
                <span className="text-sm font-semibold">
                  {useralldetail?.user?.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {useralldetail?.user?.userType}
                </span>
              </div>

              <div
                className={`w-12 h-12 rounded-full border-1 border-dashed border-[var(--maincolor)] overflow-hidden transition-all duration-300 ${isProfileOpen ? 'scale-110 shadow-lg' : ''}`}
                style={{ borderColor: mainColor }}
              >
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
            </div>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[100]"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Profile & Theme</p>
                    
                    <NavLink
                      to="/photo"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">Account Settings</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">View and edit profile</p>
                      </div>
                    </NavLink>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-white">
                      <Palette size={16} style={{ color: mainColor }} />
                      <span className="text-sm font-bold">Brand Color</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {presets.map((color) => (
                        <button
                          key={color}
                          onClick={() => dispatch(setMainColor(color))}
                          className="w-full aspect-square rounded-lg border-2 border-white dark:border-slate-800 shadow-sm relative overflow-hidden transition-transform hover:scale-110 cursor-pointer"
                          style={{ backgroundColor: color }}
                        >
                          {mainColor === color && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Custom:</span>
                      <div className="relative flex-1 h-8">
                        <input
                          type="color"
                          value={mainColor}
                          onChange={(e) => dispatch(setMainColor(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                          className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner"
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