import React, { useState, useEffect } from 'react';
import { getPermissions, updatePermissions, type Permission } from '../../services/api';
import { toast } from 'sonner';
import type { TabName } from './Sidebar';

const PermissionsManager: React.FC = () => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const roles = ['ADMIN', 'DIRECTOR', 'DOCENTE'];
    const modules: TabName[] = [
        'dashboard', 'registration', 'students', 'daily_attendance', 
        'occupancy', 'tasks', 'announcements', 'reports', 
        'justifications', 'telegram', 'settings', 'users', 'academic', 'grades'
    ];

    const moduleTranslations: Record<TabName, string> = {
        dashboard: 'Panel Principal',
        registration: 'Registro',
        students: 'Estudiantes',
        daily_attendance: 'Asistencia Diaria',
        occupancy: 'Aforo en Vivo',
        tasks: 'Tareas Académicas',
        announcements: 'Comunicados',
        reports: 'Reportes',
        justifications: 'Justificaciones',
        telegram: 'Telegram (Bot)',
        settings: 'Ajustes',
        users: 'Usuarios (Personal)',
        academic: 'Gestión Académica',
        grades: 'Libreta de Calificaciones'
    };

    useEffect(() => {
        const fetchPerms = async () => {
            setLoading(true);
            try {
                const data = await getPermissions();
                setPermissions(data);
            } catch (error) {
                console.error("Error loading permissions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerms();
    }, []);

    const togglePermission = (role: string, module: string) => {
        setPermissions(prev => {
            const exists = prev.find(p => p.role === role && p.module_name === module);
            if (exists) {
                return prev.map(p => 
                    (p.role === role && p.module_name === module) 
                    ? { ...p, is_enabled: !p.is_enabled } 
                    : p
                );
            } else {
                return [...prev, { role, module_name: module, is_enabled: true }];
            }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updatePermissions(permissions);
            toast.success("Permisos actualizados con éxito. Los cambios se aplicarán en el próximo inicio de sesión o al refrescar.");
        } catch (error) {
            console.error("Error saving permissions:", error);
            toast.error("Error al guardar los permisos.");
        } finally {
            setSaving(false);
        }
    };

    const isEnabled = (role: string, module: string) => {
        const p = permissions.find(p => p.role === role && p.module_name === module);
        return p ? p.is_enabled : false;
    };

    if (loading) return <div className="p-10 text-center animate-pulse font-black text-slate-400 uppercase tracking-widest">Cargando Matriz de Permisos...</div>;

    return (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 lg:p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] mt-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                        <span className="material-icons-outlined text-3xl">hub</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                            Control de Módulos (RBAC)
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Configuración Dinámica de Pestañas</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Módulo / Pestaña</th>
                            {roles.map(r => (
                                <th key={r} className="px-6 py-4 text-[10px] font-black text-center text-slate-600 dark:text-slate-300 uppercase tracking-[0.3em] font-black">{r}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map(m => (
                            <tr key={m} className="group">
                                <td className="px-6 py-4 bg-white/50 dark:bg-slate-800/40 rounded-l-2xl border-y border-l border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-primary transition-colors"></div>
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">{moduleTranslations[m]}</span>
                                    </div>
                                </td>
                                {roles.map(r => (
                                    <td key={`${r}-${m}`} className={`px-6 py-4 bg-white/50 dark:bg-slate-800/40 border-y border-slate-100 dark:border-slate-800 text-center ${r === roles[roles.length -1] ? 'rounded-r-2xl border-r' : ''}`}>
                                        <button 
                                            onClick={() => togglePermission(r, m)}
                                            className={`w-12 h-6 rounded-full transition-all relative mx-auto ${isEnabled(r, m) ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isEnabled(r, m) ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-500/5 rounded-[2rem] border border-amber-200 dark:border-amber-500/20 flex gap-4 items-center">
                <span className="material-icons-outlined text-amber-500 text-2xl">info</span>
                <p className="text-[10px] font-black text-amber-700 dark:text-amber-500/80 uppercase tracking-widest leading-relaxed">
                    Nota: Los cambios en los permisos se aplican visualmente cuando el usuario refresca el dashboard o reinicia sesión. El blindaje en el servidor es instantáneo.
                </p>
            </div>
        </div>
    );
};

export default PermissionsManager;
