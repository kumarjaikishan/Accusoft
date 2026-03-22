import React, { useEffect } from "react";
import { Menu, Sun, Moon } from 'lucide-react';

import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setnarrow } from "../../store/login";
import { toggleTheme } from "../../store/themeSlice";

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

  const defaultprofile =
    "https://res.cloudinary.com/dusxlxlvm/image/upload/v1699090690/just_yoljye.png";

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

        {/* 👤 USER INFO */}
        {log.islogin && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-sm font-semibold">
                {useralldetail?.user?.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {useralldetail?.user?.userType}
              </span>
            </div>

            <NavLink to="/photo">
              <div 
                className="w-10 h-10 rounded-full overflow-hidden ring-2 transition"
                style={{ ringColor: mainColor, '--tw-ring-color': mainColor }}
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
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;