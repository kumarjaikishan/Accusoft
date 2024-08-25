import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminRoute = () => {
    const log = useSelector((state) => state.login);
    const useralldetail = useSelector((state) => state.userexplist);
    const admin = log.islogin && useralldetail.user.isadmin;

    useEffect(() => {
        if (!admin) {
            toast.warn('Access Denied, Admin Authorization is required.', { autoClose: 2300 });
        }
    }, []);

    return admin ? (
        <>
            <Outlet />
        </>
    ) : (
        <Navigate to="/logout" />
    );
};

export default AdminRoute;
