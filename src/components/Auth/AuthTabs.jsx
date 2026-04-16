import React from 'react';

const AuthTabs = ({ mode, onModeChange }) => {
    return (
        <div className="auth-tabs">
            <button
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => onModeChange('login')}
            >
                Вход
            </button>
            <button
                className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => onModeChange('register')}
            >
                Регистрация
            </button>
        </div>
    );
};

export default AuthTabs;