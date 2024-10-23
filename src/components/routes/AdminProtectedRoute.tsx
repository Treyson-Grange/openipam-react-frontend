import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * For use with react-router-dom, this component will redirect the user to the
 * home page if they are not an admin.
 * @returns Redirect or Outlet
 */
const AdminRoute: React.FC = () => {
    const { user, isAdmin } = useAuth();

    if (!user || !isAdmin()) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default AdminRoute;
