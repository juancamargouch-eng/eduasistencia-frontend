import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getDevices, enrollDevice, revokeDevice, type Device } from '../../../services/adminService';
import ConfirmModal from '../../ui/ConfirmModal';

export const DeviceManagement: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [enrollName, setEnrollName] = useState('');
    const [isEnrolling, setIsEnrolling] = useState(false);

    // Modal de confirmación
    const [confirmRevoke, setConfirmRevoke] = useState<{ open: boolean; deviceId: number | null; uniqueId: string }>({
        open: false,
        deviceId: null,
        uniqueId: ''
    });

    // Identificación del dispositivo actual
    const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(localStorage.getItem('kiosk_device_id'));
    const [isCurrentAuthorized, setIsCurrentAuthorized] = useState(false);

    const loadDevices = async () => {
        try {
            const data = await getDevices();
            setDevices(data);

            // Verificar si el dispositivo actual está en la lista de activos
            if (currentDeviceId) {
                const isAuth = data.find((d: Device) => d.unique_id === currentDeviceId && d.is_active);
                setIsCurrentAuthorized(!!isAuth);
            }
        } catch {
            toast.error("Error al cargar dispositivos");
        }
    };

    useEffect(() => {
        loadDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!enrollName.trim()) return toast.warning("Asigne un nombre al dispositivo");

        setIsEnrolling(true);
        try {
            // Generar un ID único para esta computadora si no tiene uno
            let uniqueId = localStorage.getItem('kiosk_device_id');
            if (!uniqueId) {
                uniqueId = `pc_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
                localStorage.setItem('kiosk_device_id', uniqueId);
            }

            const result = await enrollDevice({
                unique_id: uniqueId,
                name: enrollName
            });

            // Guardar el secreto permanentemente en esta PC
            localStorage.setItem('kiosk_device_secret', result.secret_token);
            setCurrentDeviceId(uniqueId);
            setIsCurrentAuthorized(true);
            setEnrollName('');
            
            toast.success("Dispositivo autorizado con éxito");
            loadDevices();
        } catch (err: unknown) {
            toast.error((err as any).response?.data?.detail || "Error en el enrolamiento");
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleRevoke = async () => {
        const { deviceId, uniqueId } = confirmRevoke;
        if (!deviceId) return;

        try {
            await revokeDevice(deviceId);
            if (uniqueId === currentDeviceId) {
                // Si nos revocamos a nosotros mismos, limpiamos localS
                localStorage.removeItem('kiosk_device_secret');
                setIsCurrentAuthorized(false);
            }
            toast.success("Dispositivo revocado");
            loadDevices();
        } catch {
            toast.error("Error al revocar");
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto w-full px-4 lg:px-0">
            {/* Modal de Confirmación */}
            <ConfirmModal 
                isOpen={confirmRevoke.open}
                onClose={() => setConfirmRevoke({ ...confirmRevoke, open: false })}
                onConfirm={handleRevoke}
                title="Revocar Acceso"
                description="¿Está seguro de revocar el acceso a este dispositivo? No podrá capturar asistencias hasta ser autorizado nuevamente."
                type="danger"
            />
            
            {/* Estado del Dispositivo Actual */}
            <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${isCurrentAuthorized ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isCurrentAuthorized ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'}`}>
                            <span className="material-icons-outlined text-4xl">
                                {isCurrentAuthorized ? 'verified_user' : 'report_problem'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                                {isCurrentAuthorized ? 'Esta computadora está Autorizada' : 'Esta computadora no está Autorizada'}
                            </h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                {isCurrentAuthorized ? 'Puede capturar asistencias en el Kiosko' : 'Requiere enrolamiento para funcionar como Kiosko'}
                            </p>
                        </div>
                    </div>

                    {!isCurrentAuthorized && (
                        <form onSubmit={handleEnroll} className="flex gap-2 w-full lg:w-auto">
                            <input 
                                type="text"
                                placeholder="Nombre: Ej. Portería"
                                value={enrollName}
                                onChange={(e) => setEnrollName(e.target.value)}
                                className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={isEnrolling}
                                className="px-8 py-3 bg-amber-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                Autorizar PC
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Lista de Dispositivos */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 lg:p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <span className="material-icons-outlined text-3xl">devices_other</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">Puntos de Acceso</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dispositivos autorizados</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devices.map((d) => (
                        <div key={d.id} className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl group relative transition-all hover:shadow-2xl hover:shadow-black/5">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                    <span className="material-icons text-xl">computer</span>
                                </div>
                                <button 
                                    onClick={() => setConfirmRevoke({ open: true, deviceId: d.id, uniqueId: d.unique_id || '' })}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    title="Revocar Acceso"
                                >
                                    <span className="material-icons-outlined text-xl">no_accounts</span>
                                </button>
                            </div>
                            
                            <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-wider mb-1">{d.name}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{d.unique_id}</p>
                            
                            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-900 flex items-center justify-between">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${d.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {d.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">
                                    {d.last_heartbeat ? new Date(d.last_heartbeat).toLocaleTimeString() : 'Nunca'}
                                </span>
                            </div>
                        </div>
                    ))}

                    {devices.length === 0 && (
                        <div className="col-span-full py-12 text-center">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No hay dispositivos enrolados</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
