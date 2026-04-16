import React from 'react';
import AuthScreen from '../components/Auth/AuthScreen';

const LoginPage = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
        }}>
            <AuthScreen />
        </div>
    );
};

export default LoginPage;