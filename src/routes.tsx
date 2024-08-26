import React from 'react';
import { RouteObject } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Dns = React.lazy(() => import('./pages/domains/Domains'));
const DomainDetail = React.lazy(() => import('./pages/domains/DomainDetail'));
const ProtectedRoute = React.lazy(
    () => import('./components/routes/UserProtectedRoute'),
);
const AdminProtectedRoute = React.lazy(
    () => import('./components/routes/AdminProtectedRoute'),
);
const AdminTest = React.lazy(() => import('./pages/TestAdmin'));
const UserHosts = React.lazy(() => import('./pages/hosts/UserHosts'));
const AllHosts = React.lazy(() => import('./pages/hosts/AllHosts'));
const HostDetail = React.lazy(() => import('./pages/hosts/HostDetail'));
const PageNotFound = React.lazy(() => import('./pages/PageNotFound'));
const AddHost = React.lazy(() => import('./pages/hosts/AddHost'));
const Users = React.lazy(() => import('./pages/admin/Users'));

const routes: RouteObject[] = [
    { path: '/login', element: <Login /> },
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            { path: '/', element: <Home /> },

            // DNS related routes.
            { path: '/domains', element: <Dns /> },
            {
                path: '/domains/:domain',
                element: <DomainDetail />,
            },

            // Hosts related routes
            { path: '/hosts', element: <UserHosts /> },
            {
                path: '/hosts/:host',
                element: <HostDetail />,
            },
            { path: '/hosts/all', element: <AllHosts /> },
            { path: '/hosts/add', element: <AddHost /> },

            // Admin only routes.
            {
                path: '/network',
                element: <AdminProtectedRoute />,
                children: [{ path: '/network', element: <AdminTest /> }],
            },
            {
                path: '/admin',
                element: <AdminProtectedRoute />,
                children: [
                    {
                        path: '/admin',
                        element: <AdminTest />,
                    },
                    {
                        path: '/admin/users',
                        element: <Users />,
                    },
                ],
            },
            {
                path: '/reports',
                element: <AdminProtectedRoute />,
                children: [{ path: '/reports', element: <AdminTest /> }],
            },
        ],
    },
    { path: '*', element: <PageNotFound /> },
];

export default routes;
