import { Domain } from 'domain';
import React from 'react';
import { RouteObject } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Dns = React.lazy(() => import('./pages/Domains'));
const DomainDetail = React.lazy(() => import('./pages/DomainDetail'));
const ProtectedRoute = React.lazy(() => import('./components/routes/UserProtectedRoute'));
const AdminProtectedRoute = React.lazy(() => import('./components/routes/AdminProtectedRoute'));
const AdminTest = React.lazy(() => import('./pages/TestAdmin'));

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
