import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canAccessTab } from '../../utils/permissions';

export type TabName = 'dashboard' | 'registration' | 'students' | 'reports' | 'justifications' | 'settings' | 'daily_attendance' | 'telegram' | 'occupancy' | 'tasks' | 'announcements' | 'users' | 'academic' | 'grades' | 'audit';

interface SidebarProps {
    isOpen: boolean;
    closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperuser, role, permissions } = useAuth();
    
    // Check if the current user has access to a specific tab
    const hasAccess = (tab: TabName) => canAccessTab(role, tab, isSuperuser, permissions);

    // Determine active tab from URL
    const currentPath = location.pathname.split('/').pop() || 'dashboard';
    const activeTab = currentPath as TabName;

    return (
        <aside className={`
            fixed lg:sticky top-0 left-0 z-50
            w-64 h-screen bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 
            flex flex-col transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            <div className="pt-10 pb-6 flex items-center justify-center">
                <img src="/logo_eduasistencia.png" alt="EduAsistencia Logo" className="h-24 w-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105" />
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                {hasAccess('dashboard') && (
                    <NavItem id="dashboard" icon="dashboard" label="Panel Principal" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                )}
                
                {hasAccess('registration') && (
                    <NavItem id="registration" icon="person_add" label="Registro" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                )}

                {hasAccess('students') && (
                    <NavItem id="students" icon="people" label="Estudiantes" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                )}

                {hasAccess('daily_attendance') && (
                    <NavItem id="daily_attendance" icon="event_available" label="Asistencia" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                )}
                
                {hasAccess('occupancy') && (
                    <NavItem id="occupancy" icon="groups" label="Aforo" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                )}
                
                {/* Académico */}
                {(hasAccess('tasks') || hasAccess('announcements') || hasAccess('academic') || hasAccess('grades')) && (
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <p className="px-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Académico</p>
                        {hasAccess('academic') && (
                            <NavItem id="academic" icon="school" label="Gestión Académica" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                        )}
                        {hasAccess('grades') && (
                            <NavItem id="grades" icon="grading" label="Calificaciones" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                        )}
                        {hasAccess('tasks') && (
                            <NavItem id="tasks" icon="assignment" label="Tareas" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                        )}
                        {hasAccess('announcements') && (
                            <NavItem id="announcements" icon="campaign" label="Comunicados" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                        )}
                    </div>
                )}

                {hasAccess('reports') && (
                    <NavItem id="reports" icon="bar_chart" label="Reportes" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                )}
                
                {hasAccess('justifications') && (
                    <NavItem id="justifications" icon="medical_services" label="Justificaciones" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                )}

                {hasAccess('users') && (
                    <NavItem id="users" icon="manage_accounts" label="Usuarios" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                )}

                {hasAccess('audit') && (
                    <NavItem id="audit" icon="history_edu" label="Auditoría" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                )}
                
                {(hasAccess('telegram') || hasAccess('settings')) && (
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <p className="px-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Avanzado</p>
                        {hasAccess('telegram') && (
                            <NavItem id="telegram" icon="send" label="Telegram" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                        )}
                        {hasAccess('settings') && (
                            <NavItem id="settings" icon="settings" label="Ajustes" activeTab={activeTab} navigate={navigate} onClick={closeSidebar} />
                        )}
                    </div>
                )}
            </nav>
            <div className="p-6">
                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Estado del Sistema</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">En Línea</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

interface NavItemProps {
    id: TabName;
    icon: string;
    label: string;
    activeTab: TabName;
    navigate: (path: string) => void;
}

const NavItem: React.FC<NavItemProps & { onClick: () => void }> = ({ id, icon, label, activeTab, navigate, onClick }) => (
    <button
        onClick={() => {
            navigate(`/admin/${id}`);
            onClick();
        }}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 group ${activeTab === id
            ? 'bg-primary text-white shadow-[0_10px_25px_-5px_rgba(225,5,33,0.3)]'
            : 'text-slate-500 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
            }`}
    >
        <span className={`material-icons-outlined text-xl transition-transform group-hover:scale-110 ${activeTab === id ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>{icon}</span>
        <span className="font-black uppercase tracking-widest text-[10px]">{label}</span>
    </button>
);

export default Sidebar;
