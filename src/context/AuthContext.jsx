import React, { createContext, useState, useContext, useEffect } from 'react';

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

    // Загрузка пользователей из localStorage
    const getUsers = () => {
        const stored = localStorage.getItem('finDash_users');
        return stored ? JSON.parse(stored) : [];
    };

    // Сохранение пользователей в localStorage
    const saveUsers = (users) => {
        localStorage.setItem('finDash_users', JSON.stringify(users));
    };

    // Инициализация БД с демо-пользователем
    useEffect(() => {
        const users = getUsers();
        if (users.length === 0) {
            const defaultUser = {
                id: 1,
                email: 'demo@finhub.com',
                password: 'demo123',
                name: 'Демо Пользователь',
                cards: [
                    { id: 1, number: '4242', bank: 'Visa', full: '•••• 4242' },
                    { id: 2, number: '8888', bank: 'MasterCard', full: '•••• 8888' }
                ]
            };
            saveUsers([defaultUser]);
        }

        // Проверка сохраненной сессии
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
        loading,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};