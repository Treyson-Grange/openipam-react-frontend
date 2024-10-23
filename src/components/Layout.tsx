import React from 'react';
import Navbar from './Navbar';
import { LayoutRouteProps } from 'react-router-dom';
/**
 * Simple layout component that wraps the Navbar.
 * @param children The children components to render.
 * @returns The layout component.
 */
const Layout: React.FC<LayoutRouteProps> = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;
