import type { ModulePermission } from './permissions';

const USER_KEY = 'user';
const ROLE_KEY = 'role';
const SUPERUSER_KEY = 'is_superuser';
const PERMISSIONS_KEY = 'permissions_cache';

interface PermissionsCache {
    data: ModulePermission[];
    timestamp: number;
}

export const userStorage = {
    getUser: () => localStorage.getItem(USER_KEY),
    setUser: (user: string) => localStorage.setItem(USER_KEY, user),
    
    getRole: () => localStorage.getItem(ROLE_KEY),
    setRole: (role: string) => localStorage.setItem(ROLE_KEY, role),
    
    getIsSuperuser: () => localStorage.getItem(SUPERUSER_KEY) === 'true',
    setIsSuperuser: (val: boolean) => localStorage.setItem(SUPERUSER_KEY, String(val)),

    // Cache de Permisos con TTL
    getPermissions: (): ModulePermission[] | null => {
        const cached = localStorage.getItem(PERMISSIONS_KEY);
        if (!cached) return null;
        try {
            const parsed: PermissionsCache = JSON.parse(cached);
            return parsed.data;
        } catch {
            return null;
        }
    },
    getPermissionsTimestamp: (): number => {
        const cached = localStorage.getItem(PERMISSIONS_KEY);
        if (!cached) return 0;
        try {
            const parsed: PermissionsCache = JSON.parse(cached);
            return parsed.timestamp;
        } catch {
            return 0;
        }
    },
    setPermissions: (data: ModulePermission[]) => {
        const cache: PermissionsCache = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(cache));
    },

    clear: () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(SUPERUSER_KEY);
        localStorage.removeItem(PERMISSIONS_KEY);
    }
};
