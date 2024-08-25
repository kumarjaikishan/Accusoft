import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoutes = () => {
    const log = useSelector((state) => state.login);
    const user = log.islogin;

    useEffect(() => {
        if (!user) {
            toast.warn('You are not Logged In.', { autoClose: 2300 });
        }
    }, []);

    return user ?  <Outlet /> :  <Navigate to="/login" />;
};

export default ProtectedRoutes;
