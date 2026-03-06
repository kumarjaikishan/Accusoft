import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setnarrow } from "../../store/login";
import { IoMenu } from "react-icons/io5";
import { MdLightMode, MdBedtime } from "react-icons/md";
import Breadcrumbs from "../Breadcrumb";

const Navbar = ({ setIsDarkMode }) => {
  const dispatch = useDispatch();
  const [darkmode, setdarkmode] = useState(true);

  const log = useSelector((state) => state.login);
  const useralldetail = useSelector((state) => state.userexplist);

  const defaultprofile =
    "https://res.cloudinary.com/dusxlxlvm/image/upload/v1699090690/just_yoljye.png";

  const fun = () => {
    dispatch(setnarrow(!log.narrow));
  };

  /* ========= KEEPING YOUR ORIGINAL DARK MODE SYSTEM ========= */
  useEffect(() => {
    let modee = localStorage.getItem("mode");
    if (modee === "true") {
      setIsDarkMode(true);
      setdarkmode(true);
      document.body.className = "dark-theme";
    } else {
      setIsDarkMode(false);
      setdarkmode(false);
      document.body.className = "light-theme";
    }
  }, []);

  const handle = (e) => {
    if (e.target.checked) {
      setdarkmode(true);
      setIsDarkMode(true);
      document.body.className = "dark-theme";
      localStorage.setItem("mode", true);
    } else {
      document.body.className = "light-theme";
      setdarkmode(false);
      setIsDarkMode(false);
      localStorage.setItem("mode", false);
    }
  };

  return (
    <nav
      className={`fixed top-0  h-16 
      ${log.narrow
          ? "w-full lg:w-[calc(100%-var(--sidebarnarrow))]"
          : " lg:w-[calc(100%-var(--sidebarwide))]"
        }
       ${log.narrow
          ? "left-0 lg:left-[var(--sidebarnarrow)]"
          : "left-[var(--sidebarwidemobile)] lg:left-[var(--sidebarwide)]"
        }
      ml-0 
      bg-white shadow-sm border-b border-gray-200
      flex items-center justify-between px-2 lg:px-6
      transition-all duration-200 z-50`}
    >
      {/* LEFT SECTION (UNCHANGED STRUCTURE) */}
      <div className="flex items-center gap-1 lg:gap-4 ">
        <IoMenu
          onClick={fun}
          title="menu"
          className="text-2xl text-gray-700 cursor-pointer hover:text-indigo-600 transition"
        />

        <div className="text-gray-600 font-medium text-sm">
          <Breadcrumbs />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        className={`flex items-center gap-6 transition-transform duration-300
      ${!log.narrow
            ? "translate-x-[400px] lg:translate-x-0"
            : "translate-x-0"
          } `
        }
      >
        {/* THEME TOGGLE (Modern but same logic) */}
        <div className="flex items-center gap-2 text-sm">
          <input
            onChange={handle}
            id="checkbox"
            name="checkbox"
            checked={darkmode}
            type="checkbox"
            className="hidden"
          />

          <label
            htmlFor="checkbox"
            className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            {darkmode ? (
              <>
                <MdLightMode className="text-yellow-500 text-lg" />
                <span>Light</span>
              </>
            ) : (
              <>
                <MdBedtime className="text-indigo-500 text-lg" />
                <span>Dark</span>
              </>
            )}
          </label>
        </div>

        {/* USER INFO */}
        {log.islogin && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-sm font-semibold text-gray-800">
                {useralldetail?.user?.name}
              </span>
              <span className="text-xs text-gray-500">
                {useralldetail?.user?.userType}
              </span>
            </div>

            <NavLink to="/photo">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500 hover:ring-indigo-600 transition">
                <img
                  src={
                    useralldetail?.profilepic
                      ? useralldetail.profilepic
                      : defaultprofile
                  }
                  alt="Profile Pic"
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