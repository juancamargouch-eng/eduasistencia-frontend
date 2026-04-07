import axios from 'axios';
import { authStorage } from '../utils/authStorage';
import { userStorage } from '../utils/userStorage';

export type TabName = 'dashboard' | 'registration' | 'students' | 'reports' | 'justifications' | 'settings' | 'daily_attendance' | 'telegram' | 'occupancy' | 'tasks' | 'announcements' | 'users' | 'academic' | 'grades';

const API_URL = import.meta.env.VITE_API_BASE_URL;
export const BASE_URL = API_URL ? API_URL.replace('/api', '') : '';

export const getStudentPhotoUrl = (photoUrl?: string) => {
    if (!photoUrl) return null;

    if (photoUrl.startsWith('http')) {
        return photoUrl;
    }

    if (photoUrl.startsWith('/api/') || photoUrl.startsWith('api/')) {
        const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
        const cleanPath = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
        return `${cleanBase}${cleanPath}`;
    }

    const token = authStorage.getToken();
    const cleanApiUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const encodedKey = encodeURIComponent(photoUrl);
    const authParam = token ? `&token=${encodeURIComponent(token)}` : '';
    
    return `${cleanApiUrl}/students/photo-proxy?key=${encodedKey}${authParam}`;
};

if (!API_URL) {
    console.warn("VITE_API_BASE_URL no está definida en el archivo .env");
}

const api = axios.create({
    baseURL: API_URL?.endsWith('/') ? API_URL : `${API_URL}/`,
});

let isLoggingOut = false;

api.interceptors.request.use((config) => {
    const token = authStorage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        // Reset flag on successful responses if needed (or just keep it per-401 cycle)
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401 && !isLoggingOut) {
            isLoggingOut = true;
            
            // Limpieza integral
            authStorage.clear();
            userStorage.clear();
            
            // Sincronización reactiva con AuthProvider y otras pestañas
            window.dispatchEvent(new Event('logout'));
            
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
