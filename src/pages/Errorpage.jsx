import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { header } from "../store/login";
import { motion } from "framer-motion";

export const Errorpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const log = useSelector((state) => state.login);

  useEffect(() => {
    if (!log.islogin) {
      navigate("/login");
    }
    dispatch(header("Not Found"));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-fit flex items-center justify-center px-3 bg-white"
    >
      <div className="max-w-3xl  w-full text-center bg-white rounded-3xl p-4 md:p-8">
        
        {/* Image */}
        <div className="flex justify-center mb-6">
          <img
            src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1720767933/accusoft/assets/404_page_1_kjlifa.svg"
            alt="404 Not Found"
            className="w-full lg:w-[300px] max-w-md"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed">
          Sorry, the page you are looking for does not exist or has been moved.
          If you believe this is a mistake, please report it and we’ll fix it
          as soon as possible.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink
            to="/"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition"
          >
            Return Home
          </NavLink>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </motion.div>
  );
};