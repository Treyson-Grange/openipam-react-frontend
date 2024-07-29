import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute: React.FC = () => {
    const { user, isAdmin } = useAuth();

    if (!user || !isAdmin()) {
        return <Navigate to='/' replace />;
    }
    return <Outlet />;
};

export default AdminRoute;
