import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const isAdmin = useSelector(state => state.userexplist?.user?.isadmin);

    if (!isAdmin) {
        return <Navigate to="/404" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
