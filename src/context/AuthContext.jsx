import React, { createContext, useState, useContext, useEffect } from 'react';
import { INITIAL_BALANCE } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUsers = () => {
        const stored = localStorage.getItem('finDash_users');
        return stored ? JSON.parse(stored) : [];
    };

    const saveUsers = (users) => {
        localStorage.setItem('finDash_users', JSON.stringify(users));
    };

    // Обновление баланса пользователя
    const updateBalance = (newBalance) => {
        if (!currentUser) return false;

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
            users[userIndex].balance = newBalance;
            saveUsers(users);

            const updatedUser = { ...currentUser, balance: newBalance };
            setCurrentUser(updatedUser);
            localStorage.setItem('finDash_currentUser', JSON.stringify(updatedUser));
            return true;
        }
        return false;
    };

    // Пополнение баланса
    const deposit = (amount) => {
        if (!currentUser) return { success: false, error: 'Пользователь не авторизован' };
        if (amount <= 0) return { success: false, error: 'Сумма должна быть положительной' };

        const newBalance = (currentUser.balance || 0) + amount;
        updateBalance(newBalance);
        return { success: true, newBalance };
    };

    // Списание с баланса (для переводов)
    const withdraw = (amount) => {
        if (!currentUser) return { success: false, error: 'Пользователь не авторизован' };
        if (amount <= 0) return { success: false, error: 'Сумма должна быть положительной' };

        const currentBalance = currentUser.balance || 0;

        // Проверка на нулевой баланс
        if (currentBalance === 0) {
            return { success: false, error: 'У вас недостаточно средств. Пополните баланс.' };
        }

        // Проверка на недостаток средств
        if (currentBalance < amount) {
            return { success: false, error: `У вас недостаточно средств. Доступно: $${currentBalance.toFixed(2)}` };
        }

        const newBalance = currentBalance - amount;
        updateBalance(newBalance);
        return { success: true, newBalance };
    };

    useEffect(() => {
        const users = getUsers();
        if (users.length === 0) {
            const defaultUser = {
                id: 1,
                email: 'demo@finhub.com',
                password: 'demo123',
                name: 'Демо Пользователь',
                balance: INITIAL_BALANCE,
                cards: [
                    { id: 1, number: '4242', bank: 'Visa', full: '•••• 4242' },
                    { id: 2, number: '8888', bank: 'MasterCard', full: '•••• 8888' }
                ]
            };
            saveUsers([defaultUser]);
        }

        const savedUser = localStorage.getItem('finDash_currentUser');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                const freshUsers = getUsers();
                const freshUser = freshUsers.find(u => u.id === parsedUser.id);
                if (freshUser) {
                    setCurrentUser(freshUser);
                }
            } catch (e) {
                console.error('Failed to parse saved user', e);
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('finDash_currentUser', JSON.stringify(user));
            return { success: true };
        }
        return { success: false, error: 'Неверный email или пароль' };
    };

    const register = (email, password, name) => {
        const users = getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Пользователь уже существует' };
        }

        const newUser = {
            id: Date.now(),
            email,
            password,
            name: name || 'Пользователь',
            balance: INITIAL_BALANCE,
            cards: [
                { id: Date.now(), number: '4242', bank: 'Visa', full: '•••• 4242' }
            ]
        };

        const updatedUsers = [...users, newUser];
        saveUsers(updatedUsers);
        setCurrentUser(newUser);
        localStorage.setItem('finDash_currentUser', JSON.stringify(newUser));
        return { success: true };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('finDash_currentUser');
    };

    const updateUserCards = (newCards) => {
        if (!currentUser) return;

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex !== -1) {
            users[userIndex].cards = newCards;
            saveUsers(users);

            const updatedUser = { ...currentUser, cards: newCards };
            setCurrentUser(updatedUser);
            localStorage.setItem('finDash_currentUser', JSON.stringify(updatedUser));
        }
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        updateUserCards,
        updateBalance,
        deposit,
        withdraw,
        loading,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};