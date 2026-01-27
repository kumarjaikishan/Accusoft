import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminRoute = () => {
    const isAdmin = useSelector(state => state.userexplist?.user?.isadmin);

    if (!isAdmin) {
        toast.warn("Admin access required",{autoClose:2300});
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};


export default AdminRoute;
