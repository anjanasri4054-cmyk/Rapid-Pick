import React, { createContext, useState, useContext, useEffect } from 'react';
import { getItem, setItem, KEYS } from './storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const savedUser = getItem(KEYS.AUTH);
            if (savedUser) {
                setUser(savedUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        } finally {
            setIsLoadingAuth(false);
        }
    };

    const login = (email, password) => {
        setAuthError(null);
        const users = getItem(KEYS.USERS) || [];
        const foundUser = users.find(u =>
            u.email === email && u.password === password
        );

        if (foundUser) {
            setItem(KEYS.AUTH, foundUser);
            setUser(foundUser);
            setIsAuthenticated(true);
            return { success: true, user: foundUser };
        } else {
            setAuthError("Invalid email or password");
            return { success: false, message: "Invalid email or password" };
        }
    };

    const logout = () => {
        setItem(KEYS.AUTH, null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
    };

    const register = (newUserData) => {
        const users = getItem(KEYS.USERS) || [];

        // Check if user already exists
        if (users.some(u => u.email === newUserData.email)) {
            return { success: false, message: "User already exists" };
        }

        const newUser = {
            id: 'user-' + Date.now(),
            role: 'user',
            ...newUserData
        };

        users.push(newUser);
        setItem(KEYS.USERS, users);

        return { success: true, user: newUser };
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoadingAuth,
            authError,
            login,
            logout,
            register,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};