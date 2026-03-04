import React, { useEffect, useState } from 'react';
import { type Device, getDevices } from '../../services/api';

const DeviceMonitor: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDevices = async () => {
        try {
            const data = await getDevices();
            setDevices(data);
        } catch (error) {
            console.error("Error fetching devices", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        const interval = setInterval(fetchDevices, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const isOnline = (lastHeartbeat: string) => {
        if (!lastHeartbeat) return false;
        const heartbeat = new Date(lastHeartbeat).getTime();
        const now = new Date().getTime();
        // Consider offline if no heartbeat in last 2 minutes
        return (now - heartbeat) < 2 * 60 * 1000;
    };

    if (loading && devices.length === 0) return <div className="animate-pulse h-20 bg-slate-100 rounded-xl"></div>;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Puntos de Acceso</h3>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                    {devices.length} Dispositivos
                </span>
            </div>

            <div className="space-y-3">
                {devices.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No hay dispositivos registrados</p>
                ) : (
                    devices.map(device => {
                        const online = isOnline(device.last_heartbeat);
                        return (
                            <div key={device.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500'}`}></div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{device.name}</p>
                                        <p className="text-xs text-slate-500">{device.location}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${online
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {online ? 'ONLINE' : 'OFFLINE'}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DeviceMonitor;
