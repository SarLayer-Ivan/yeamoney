import React from 'react';
import ThemeToggle from './ThemeToggle';
import ProfileBadge from './ProfileBadge';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <i className="fas fa-chart-line"></i> YeaMoney
            </div>
            <div className="nav-actions">
                <ThemeToggle />
                <ProfileBadge />
            </div>
        </div>
    );
};

export default Navbar;