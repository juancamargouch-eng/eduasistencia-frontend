const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Canal para sincronizar estados entre pestañas (Excelencia Punto 10)
const authChannel = new BroadcastChannel('auth_sync');

export const authStorage = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    
    setToken: (token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        authChannel.postMessage({ type: 'LOGIN' });
    },
    
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    
    setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
    
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        authChannel.postMessage({ type: 'LOGOUT' });
    },

    subscribe: (callback: (type: string) => void) => {
        const handler = (event: MessageEvent) => callback(event.data.type);
        authChannel.addEventListener('message', handler);
        return () => authChannel.removeEventListener('message', handler);
    }
};
