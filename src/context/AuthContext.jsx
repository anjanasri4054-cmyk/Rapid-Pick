import React, { createContext, useContext, useState } from 'react';
import { getItem, setItem, KEYS } from '../lib/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getItem(KEYS.AUTH));

    const login = (email, password) => {
        const users = getItem(KEYS.USERS) || [];
        const found = users.find(u => u.email === email && u.password === password);

        if (!found) return { success: false, message: 'Invalid email or password' };

        const { password: _pwd, ...safeUser } = found;
        setItem(KEYS.AUTH, safeUser);
        setUser(safeUser);

        return { success: true, user: safeUser };
    };

    const signup = (data) => {
        const users = getItem(KEYS.USERS) || [];

        if (users.find(u => u.email === data.email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: 'u-' + Date.now(),
            ...data,
            role: 'user',
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        setItem(KEYS.USERS, users);

        const { password: _pwd, ...safeUser } = newUser;
        setItem(KEYS.AUTH, safeUser);
        setUser(safeUser);

        return { success: true, user: safeUser };
    };

    const logout = () => {
        localStorage.removeItem(KEYS.AUTH);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                isAdmin: user?.role === 'admin',

            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);