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
let isRefreshing = false;
let failedQueue: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

const processQueue = (error: any, token: string | null = null) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use((config) => {
    const token = authStorage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Inyectar credenciales de dispositivo (Excelencia Punto 3)
    const deviceId = localStorage.getItem('kiosk_device_id');
    const deviceSecret = localStorage.getItem('kiosk_device_secret');
    
    if (deviceId) {
        config.headers['X-Device-ID'] = deviceId;
    }
    if (deviceSecret) {
        config.headers['X-Device-Secret'] = deviceSecret;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Manejo de Errores de Red (Servidor Caído / Sin Internet)
        if (!error.response && !isLoggingOut) {
            const { toast } = await import('sonner');
            toast.error("Error de Red", {
                description: "No se pudo conectar con el servidor. Verifique su conexión.",
                duration: 5000,
            });
        }

        if (error.response?.status === 401 && !originalRequest._retry && !isLoggingOut) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = authStorage.getRefreshToken();
            if (refreshToken) {
                try {
                    // Usamos api.post directo para evitar ciclos si importáramos authService
                    const response = await axios.post(`${API_URL}/auth/refresh`, { 
                        refresh_token: refreshToken 
                    });
                    
                    const { access_token } = response.data;
                    authStorage.setToken(access_token);
                    api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    
                    processQueue(null, access_token);
                    isRefreshing = false;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;
                    // Si el refresh falla, procedemos al logout
                }
            }

            // Si llegamos aquí, el refresh falló o no había token
            if (!isLoggingOut) {
                isLoggingOut = true;
                authStorage.clear();
                userStorage.clear();
                window.dispatchEvent(new Event('logout'));
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
