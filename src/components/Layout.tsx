import React from 'react';
import Header from './Header';
import { LayoutRouteProps } from 'react-router-dom';

const Layout: React.FC<LayoutRouteProps> = ({ children }) => {
    return (
        <div>
            <Header />
            <main>{children}</main>
        </div>
    );
};

export default Layout;
