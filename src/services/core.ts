import axios from 'axios';

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

    const token = localStorage.getItem('token');
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

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
