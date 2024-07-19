import React from 'react';
import Navbar from './Navbar';
import { LayoutRouteProps } from 'react-router-dom';

const Layout: React.FC<LayoutRouteProps> = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;
