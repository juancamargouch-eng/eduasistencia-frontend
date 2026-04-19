import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { authStorage } from '../utils/authStorage';

interface WebSocketMessage {
    event: string;
    data: {
        student_name: string;
        [key: string]: unknown;
    };
}

export const useAdminWebSocket = (onUpdate: () => void) => {
    const refreshAll = useCallback(() => {
        onUpdate();
    }, [onUpdate]);

    useEffect(() => {
        // Usar variable de entorno o cálculo dinámico como fallback
        const envWsUrl = import.meta.env.VITE_WS_URL;
        
        const fallbackProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const fallbackUrl = `${fallbackProtocol}//${window.location.host}/ws`;
        
        const wsUrl = envWsUrl || fallbackUrl;
        const token = authStorage.getToken();
        const authenticatedWsUrl = token ? `${wsUrl}?token=${token}` : wsUrl;

        let socket: WebSocket;
        let reconnectTimeout: NodeJS.Timeout;

        const connect = () => {
            socket = new WebSocket(authenticatedWsUrl);

            socket.onopen = () => {
                console.log('Connected to WebSocket');
            };

            socket.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    if (message.event === 'new_attendance' || message.event === 'log_validated') {
                        console.log('Real-time update received:', message.event);
                        refreshAll();
                        toast.success(`Actualización recibida: ${message.data.student_name}`, {
                            icon: '🔔',
                            duration: 3000
                        });
                    }
                } catch (error) {
                    console.error('Error parsing WS message:', error);
                }
            };

            socket.onclose = () => {
                console.log('WebSocket disconnected. Reconnecting...');
                reconnectTimeout = setTimeout(connect, 3000);
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                socket.close();
            };
        };

        connect();

        return () => {
            if (socket) socket.close();
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
        };
    }, [refreshAll]);
};
