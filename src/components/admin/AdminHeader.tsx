import React, { useState } from 'react';
import { toast } from 'sonner';
import type { TabName } from './Sidebar';
import { type AdminUser } from '../../services/api';

interface AdminHeaderProps {
    activeTab: TabName;
    currentTime: Date;
    onMenuClick: () => void;
    onOpenEditProfile: () => void;
    user: AdminUser | null;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, currentTime, onMenuClick, onOpenEditProfile, user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success("Sesión cerrada correctamente");
        window.location.href = '/login';
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Resumen del Panel';
            case 'registration': return 'Registro de Estudiantes';
            case 'students': return 'Gestión de Estudiantes';
            case 'daily_attendance': return 'Asistencia Diaria';
            case 'reports': return 'Generación de Reportes';
            case 'justifications': return 'Justificaciones';
            case 'telegram': return 'Configuración de Telegram';
            case 'settings': return 'Configuración';
            default: return 'Panel de Administración';
        }
    };

    return (
        <header className="h-16 sm:h-20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 lg:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <span className="material-icons-outlined">menu</span>
                </button>
                <div>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
                        {getTitle()}
                    </h1>
                    <p className="text-[10px] sm:text-sm text-slate-500 capitalize line-clamp-1">
                        {currentTime.toLocaleDateString('es-PE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden xs:flex items-center gap-2 mr-2 sm:mr-4">
                    <button
                        className="px-2 sm:px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-200 transition-colors border border-red-200"
                        onClick={() => toast.error("¡Alerta enviada!")}
                    >
                        <span className="material-icons-outlined text-[14px] sm:text-sm align-middle mr-1">warning</span>
                        SOS
                    </button>
                    <button
                        className="hidden sm:inline-flex px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200"
                        onClick={() => toast.info("Puertas Bloqueadas")}
                    >
                        <span className="material-icons-outlined text-sm align-middle mr-1">lock</span>
                        BLOQUEO
                    </button>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                    <span className="material-icons-outlined">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

                {/* Profile Section with Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-xl transition-all group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1 max-w-[150px]">
                                {user?.full_name || user?.username || 'Administrador'}
                            </p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest opacity-60">
                                {user?.is_superuser ? 'Super Usuario' : 'Admin Sistema'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-primary/50 transition-colors overflow-hidden">
                            <span className="material-icons-outlined text-slate-400 font-bold">person</span>
                        </div>
                        <span className={`material-icons-outlined text-slate-400 text-sm transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1 sm:hidden">
                                     <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                                        {user?.full_name || user?.username}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                        Admin Dashboard
                                    </p>
                                </div>
                                <button 
                                    onClick={() => { onOpenEditProfile(); setIsMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                                >
                                    <span className="material-icons-outlined text-lg text-primary">manage_accounts</span>
                                    <span className="font-semibold">Editar Perfil</span>
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2 my-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-3 transition-colors"
                                >
                                    <span className="material-icons-outlined text-lg">logout</span>
                                    <span className="font-semibold">Cerrar Sesión</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;

