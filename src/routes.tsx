import React from 'react';
import { RouteObject } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Dns = React.lazy(() => import('./pages/domains/Domains'));
const DomainDetail = React.lazy(() => import('./pages/domains/DomainDetail'));
const ProtectedRoute = React.lazy(() => import('./components/routes/UserProtectedRoute'));
const AdminProtectedRoute = React.lazy(() => import('./components/routes/AdminProtectedRoute'));
const AdminTest = React.lazy(() => import('./pages/TestAdmin'));
const UserHosts = React.lazy(() => import('./pages/hosts/UserHosts'));
const AllHosts = React.lazy(() => import('./pages/hosts/AllHosts'));

const routes: RouteObject[] = [
    { path: '/login', element: <Login /> },
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/domains', element: <Dns /> },
            {
                path: '/domains/:domain',
                element: <DomainDetail />
            },
            { path: '/hosts', element: <UserHosts /> },
            { path: '/hosts/all', element: <AllHosts /> },
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
