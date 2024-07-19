import React from "react";
import { RouteObject } from "react-router-dom";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));

const routes: RouteObject[] = [
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
];

export default routes;
