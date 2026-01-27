import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoutes = () => {
    const isLogin = useSelector(state => state.login.islogin);

    if (!isLogin) {
        toast.warn("You are not logged in", { autoClose: 2300 });
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};


export default ProtectedRoutes;
