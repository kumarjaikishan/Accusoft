import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoutes = () => {
    const log = useSelector((state) => state.login);
    const user = log.islogin;

    useEffect(() => {
        if (!user) {
            toast.warn('You are not Logged In protected.', { autoClose: 2700 });
        }
    }, []);

    return user ? (
        <div>
            <Outlet />
        </div>
    ) : (
        <Navigate to="/login" />
    );
};

export default ProtectedRoutes;
