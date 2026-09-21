import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { header } from "../store/login";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass } from "lucide-react";

export const Errorpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const log = useSelector((state) => state.login);
  const mainColor = useSelector((state) => state.theme?.mainColor || "#4f46e5");

  useEffect(() => {
    if (!log.islogin) {
      navigate("/login");
    }
    dispatch(header("Page Not Found"));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 min-h-[calc(100vh-var(--navheight)-40px)] flex items-center justify-center px-4 overflow-hidden py-4"
    >
      <div className="max-w-2xl w-full text-center flex flex-col items-center">

        {/* Floating Animated Illustration with Glow */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-6 flex justify-center"
        >
          <div
            className="absolute inset-0 blur-3xl opacity-20 dark:opacity-30 rounded-full"
            style={{ backgroundColor: mainColor }}
          />
          <img
            src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1720767933/accusoft/assets/404_page_1_kjlifa.svg"
            alt="404 Not Found"
            className="w-64 sm:w-80 md:w-96 max-h-[60vh] object-contain relative z-10 drop-shadow-md transition-transform hover:scale-105 duration-300"
          />
        </motion.div>

        {/* Badge Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 mb-4 border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-sm">
          <Compass size={14} className="animate-spin" style={{ color: mainColor, animationDuration: '8s' }} />
          <span>Error 404 • Page Missing</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Lost in Space?
        </h1>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
          The page you are trying to reach doesn't exist, was renamed, or requires administrative permissions.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <NavLink
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            style={{ backgroundColor: mainColor }}
          >
            <Home size={18} />
            <span>Return Home</span>
          </NavLink>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 hover:bg-slate-300/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold border border-slate-300/60 dark:border-slate-700/60 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};