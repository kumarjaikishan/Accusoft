import './admin_Dashboard.css';
import apiWrapper from '../addexp/apiWrapper';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Admin_Dashboard = () => {
    const dispatch = useDispatch();
    const userAllDetails = useSelector((state) => state.userexplist);

    useEffect(() => {
        feteche();
    }, [])
    const [leng, setleng] = useState({})

    const feteche = async () => {
        const url = `${import.meta.env.VITE_API_ADDRESS}admindash`;
        const method = 'GET';
        const body = null;

        const successAction = (data) => {
            // console.log(data);
            setleng(data)
        };

        const loaderAction = (isLoading) => dispatch(setloader(isLoading));

        await apiWrapper(url, method, body, dispatch, successAction, loaderAction);
    }

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
                        <div className="amt"> {leng ? leng.userlen : 0}</div>
                        <div className="day">Total Users</div>
                    </div>
                    <div className="icon" style={{ color: "white" }}><i className="fa fa-users" aria-hidden="true"></i></div>
                </div>
                <div className="card"  >
                    <div className="data">
                        <div className="amt"> {leng ? leng.explen : 0}</div>
                        <div className="day">Total Expense Record</div>
                    </div>
                    <div className="icon" style={{ color: "white" }}><i className="fa fa-balance-scale" aria-hidden="true"></i></div>
                </div>
            </motion.div>
        </>
    )
}

export default Admin_Dashboard;