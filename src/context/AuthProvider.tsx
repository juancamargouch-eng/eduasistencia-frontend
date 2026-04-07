import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginService, getMe, default as api } from '../services/api';
import type { ModulePermission } from '../utils/permissions';
import { authStorage } from '../utils/authStorage';
import { userStorage } from '../utils/userStorage';
import { DEFAULT_ROLE, PERMISSIONS_TTL } from '../utils/constants';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string | null>(userStorage.getUser());
    const [isSuperuser, setIsSuperuser] = useState<boolean>(userStorage.getIsSuperuser());
    const [role, setRole] = useState<string | null>(userStorage.getRole());
    const [permissions, setPermissions] = useState<ModulePermission[]>(userStorage.getPermissions() || []);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!authStorage.getToken());

    const logout = useCallback(() => {
        authStorage.clear();
        userStorage.clear();
        setUser(null);
        setIsSuperuser(false);
        setRole(null);
        setIsAuthenticated(false);
        setPermissions([]);
    }, []);

    const fetchPermissions = useCallback(async () => {
        // Lógica de Cache Inteligente (TTL)
        const cachedPermissions = userStorage.getPermissions();
        const lastFetch = userStorage.getPermissionsTimestamp();
        
        if (cachedPermissions && (Date.now() - lastFetch < PERMISSIONS_TTL)) {
            setPermissions(cachedPermissions);
            return;
        }

        try {
            const response = await api.get('/settings/permissions');
            setPermissions(response.data);
            userStorage.setPermissions(response.data);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    }, []);

    // Sincronización proactiva (Nivel Senior)
    useEffect(() => {
        const handleLogoutEvent = () => logout();
        
        // Listener para eventos internos (interceptores)
        window.addEventListener('logout', handleLogoutEvent);
        
        // Sincronización entre pestañas (Storage Event)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' && !e.newValue) {
                logout();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('logout', handleLogoutEvent);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [logout]);

    useEffect(() => {
        const initAuth = async () => {
            const token = authStorage.getToken();
            
            // Salida temprana: Mejora UX y evita carga innecesaria
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const userData = await getMe();
                setIsAuthenticated(true);
                setIsSuperuser(userData.is_superuser);
                setRole(userData.role || DEFAULT_ROLE);
                
                // Persistencia de respaldo
                userStorage.setUser(userData.username);
                userStorage.setIsSuperuser(userData.is_superuser);
                userStorage.setRole(userData.role || DEFAULT_ROLE);

                await fetchPermissions();
            } catch (error) {
                console.error('Auth initialization failed:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, [fetchPermissions, logout]);

    const login = async (u: string, p: string) => {
        try {
            const data = await loginService(u, p);
            if (data.access_token) {
                const roleValue = data.role || DEFAULT_ROLE;

                authStorage.setToken(data.access_token);
                userStorage.setUser(u);
                userStorage.setIsSuperuser(data.is_superuser);
                userStorage.setRole(roleValue);

                setUser(u);
                setIsSuperuser(data.is_superuser);
                setRole(roleValue);
                setIsAuthenticated(true);
                
                await fetchPermissions();
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
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
