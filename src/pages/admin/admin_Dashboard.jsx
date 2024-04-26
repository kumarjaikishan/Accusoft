import './admin_Dashboard.css';
import apiWrapper from '../addexp/apiWrapper';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../../store/login';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Admin_Dashboard = () => {
    const dispatch = useDispatch();
    const userAllDetails = useSelector((state) => state.userexplist);

    useEffect(() => {
        feteche();
    }, [])
    const [leng, setleng] = useState({})

    const feteche = async () => {
        const url = `${userAllDetails.apiadress}/admindash`;
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
            <div className="admindashboard">
                <div className="card"  >
                    <div className="data">
                        <div className="amt"> {leng ? leng.userlen : 0}</div>
                        <div className="day">Total Users</div>
                    </div>
                    <div className="icon" style={{ color: "white" }}><i class="fa fa-users" aria-hidden="true"></i></div>
                </div>
                <div className="card"  >
                    <div className="data">
                        <div className="amt"> {leng ? leng.explen : 0}</div>
                        <div className="day">Total Expense Record</div>
                    </div>
                    <div className="icon" style={{ color: "white" }}><i className="fa fa-balance-scale" aria-hidden="true"></i></div>
                </div>
            </div>
        </>
    )
}

export default Admin_Dashboard;