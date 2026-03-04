import { useNavigate, useLocation } from 'react-router-dom';

export type TabName = 'dashboard' | 'registration' | 'students' | 'reports' | 'justifications' | 'settings' | 'daily_attendance' | 'telegram';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab from URL
    const currentPath = location.pathname.split('/').pop() || 'dashboard';
    const activeTab = currentPath as TabName;
    return (
        <aside className="w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0">
            <div className="p-6 flex items-center justify-center">
                <img src="/logo_eduasistencia.png" alt="EduAsistencia Logo" className="h-12 w-auto object-contain" />
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <NavItem
                    id="dashboard"
                    icon="dashboard"
                    label="Panel Principal"
                    activeTab={activeTab}
                    navigate={navigate}
                />
                <NavItem
                    id="registration"
                    icon="person_add"
                    label="Registro"
                    activeTab={activeTab}
                    navigate={navigate}
                />
                <NavItem
                    id="students"
                    icon="people"
                    label="Estudiantes"
                    activeTab={activeTab}
                    navigate={navigate}
                />
                <NavItem
                    id="daily_attendance"
                    icon="event_available"
                    label="Control Asistencia"
                    activeTab={activeTab}
                    navigate={navigate}
                />
                <NavItem
                    id="reports"
                    icon="assignment"
                    label="Reportes"
                    activeTab={activeTab}
                    navigate={navigate}
                />
                <NavItem
                    id="justifications"
                    icon="medical_services"
                    label="Justificaciones"
                    activeTab={activeTab}
                    navigate={navigate}
                />
                <NavItem
                    id="telegram"
                    icon="send"
                    label="Telegram"
                    activeTab={activeTab}
                    navigate={navigate}
                />
                <NavItem
                    id="settings"
                    icon="settings"
                    label="Configuración"
                    activeTab={activeTab}
                    navigate={navigate}
                />
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

const NavItem: React.FC<NavItemProps> = ({ id, icon, label, activeTab, navigate }) => (
    <button
        onClick={() => navigate(`/admin/${id}`)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === id
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
            }`}
    >
        <span className="material-icons-outlined">{icon}</span>
        <span className="font-medium">{label}</span>
    </button>
);

export default Sidebar;
