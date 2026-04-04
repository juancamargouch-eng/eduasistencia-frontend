import { createContext, useContext } from 'react';
import type { ModulePermission } from '../utils/permissions';

export interface AuthContextType {
    user: string | null;
    isSuperuser: boolean;
    role: string | null;
    permissions: ModulePermission[];
    loading: boolean;
    login: (u: string, p: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
