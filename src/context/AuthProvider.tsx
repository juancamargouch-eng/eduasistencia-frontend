import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginService, getMe } from '../services/api';
import type { ModulePermission } from '../utils/permissions';
import axios from 'axios';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [isSuperuser, setIsSuperuser] = useState<boolean>(localStorage.getItem('is_superuser') === 'true');
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
    const [permissions, setPermissions] = useState<ModulePermission[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('is_superuser');
        localStorage.removeItem('role');
        setUser(null);
        setIsSuperuser(false);
        setRole(null);
        setIsAuthenticated(false);
        setPermissions([]);
    }, []);

    const fetchPermissions = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:8000/api/settings/permissions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPermissions(response.data);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getMe();
                    setIsAuthenticated(true);
                    setIsSuperuser(userData.is_superuser);
                    setRole(userData.role);
                    await fetchPermissions();
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [fetchPermissions, logout]);

    const login = async (u: string, p: string) => {
        const data = await loginService(u, p);
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', u);
            localStorage.setItem('is_superuser', String(data.is_superuser));
            localStorage.setItem('role', data.role || 'DOCENTE');
            setUser(u);
            setIsSuperuser(data.is_superuser);
            setRole(data.role);
            setIsAuthenticated(true);
            await fetchPermissions();
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isSuperuser, 
            role, 
            permissions, 
            loading, 
            login, 
            logout, 
            isAuthenticated 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
