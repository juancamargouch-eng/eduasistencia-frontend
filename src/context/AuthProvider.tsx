import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginService } from '../services/api';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [isSuperuser, setIsSuperuser] = useState<boolean>(localStorage.getItem('is_superuser') === 'true');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

    const login = async (u: string, p: string) => {
        const data = await loginService(u, p);
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', u);
            localStorage.setItem('is_superuser', String(data.is_superuser));

            setUser(u);
            setIsSuperuser(data.is_superuser);
            setIsAuthenticated(true);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('is_superuser');
        setUser(null);
        setIsSuperuser(false);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isSuperuser, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
