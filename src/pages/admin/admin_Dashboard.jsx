import './admin_Dashboard.css';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers } from "react-icons/fa";
import { FaBalanceScale } from "react-icons/fa";
import { useApi } from '../../utils/useApi';

const Admin_Dashboard = () => {
    const dispatch = useDispatch();
    const userAllDetails = useSelector((state) => state.userexplist);

    const { request, loading, data } = useApi();

    useEffect(() => {
        request({ url:'admindash', method:'GET' });
        // console.log("mounted");

        // return () => console.log("unmounted");
    }, [])

    useEffect(() => {
        dispatch(setloader(loading))
    }, [loading])

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: '100%' }}  // Initial state
                animate={{ opacity: 1, x: 0 }}  // Animation state
                exit={{ opacity: 0, x: '-100%' }}  // Exit animation
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="admindashboard">
                <div className="card"  >
                    <div className="data">
                        <div className="amt"> {data ? data?.userlen : 0}</div>
                        <div className="day">Total Users</div>
                    </div>
                    <div className="icon" style={{ color: "white" }}>
                        <FaUsers />
                    </div>
                </div>
                <div className="card"  >
                    <div className="data">
                        <div className="amt"> {data ? data?.explen : 0}</div>
                        <div className="day">Total Expense Record</div>
                    </div>
                    <div className="icon" style={{ color: "white" }}>
                        <FaBalanceScale />
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default Admin_Dashboard;