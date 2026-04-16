import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthTabs from './AuthTabs';
import Input from '../UI/Input';
import Button from '../UI/Button';

const AuthScreen = () => {
    const { login, register } = useAuth();
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({
        email: 'demo@finhub.com',
        password: 'demo123',
        name: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id.replace('auth', '').toLowerCase()]: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Заполните все обязательные поля');
            return;
        }

        let result;
        if (mode === 'login') {
            result = login(formData.email, formData.password);
        } else {
            result = register(formData.email, formData.password, formData.name);
        }

        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <div className="auth-container">
            <AuthTabs mode={mode} onModeChange={setMode} />

            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="demo@finhub.com"
                    required
                />

                <Input
                    label="Пароль"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />

                {mode === 'register' && (
                    <Input
                        label="Имя"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Иван Иванов"
                    />
                )}

                {error && (
                    <div style={{ color: 'var(--danger)', marginBottom: 16, fontSize: 14 }}>
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <Button type="submit">
                    {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </Button>

                <div className="demo-hint">
                    <i className="far fa-circle-info"></i> Демо: demo@finhub.com / demo123
                </div>
            </form>
        </div>
    );
};

export default AuthScreen;