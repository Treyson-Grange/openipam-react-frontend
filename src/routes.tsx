import React from 'react';
import { RouteObject } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Dns = React.lazy(() => import('./pages/Dns'));
const ProtectedRoute = React.lazy(() => import('./utilities/routes/UserProtectedRoute'));
const AdminProtectedRoute = React.lazy(() => import('./utilities/routes/AdminProtectedRoute'));
const AdminTest = React.lazy(() => import('./pages/TestAdmin'));

const routes: RouteObject[] = [
    { path: '/login', element: <Login /> },
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/dns', element: <Dns /> },
            {
                path: '/admin',
                element: <AdminProtectedRoute />,
                children: [
                    { path: 'asdf', element: <AdminTest /> }
                ]
            }
        ]
    }
];


export default routes;
