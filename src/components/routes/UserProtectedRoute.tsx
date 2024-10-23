import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * For use with react-router-dom, this component will redirect the user to the
 * home page if they are not logged in.
 * @returns Redirect or Outlet
 */
const ProtectedRoute: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
