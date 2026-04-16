import React from 'react';
import { useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

function App() {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                color: 'var(--text-primary)'
            }}>
                <i className="fas fa-spinner fa-spin"></i> Загрузка...
            </div>
        );
    }

    return (
        <div id="app">
            {currentUser ? <DashboardPage /> : <LoginPage />}
        </div>
    );
}

export default App;