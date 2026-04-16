import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserInitials } from '../../utils/helpers';

const ProfileBadge = () => {
    const { currentUser, logout } = useAuth();

    if (!currentUser) return null;

    const initials = getUserInitials(currentUser.name);

    return (
        <div className="profile-badge">
            <div className="avatar">{initials}</div>
            <div className="user-info">
                <div>{currentUser.name}</div>
                <button className="logout-btn" onClick={logout}>
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default ProfileBadge;