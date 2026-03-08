import { toast } from 'sonner';
import type { TabName } from './Sidebar';

interface AdminHeaderProps {
    activeTab: TabName;
    currentTime: Date;
    onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, currentTime, onMenuClick }) => {
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
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">Administrador</p>
                        <p className="text-xs text-slate-500 uppercase font-medium">Admin Sistema</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <span className="material-icons-outlined text-slate-500">person</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
