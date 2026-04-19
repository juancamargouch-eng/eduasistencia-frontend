import React from 'react';

// Hooks & Layout
import AdminLayout from '../components/admin/AdminLayout';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useAuth } from '../context/AuthContext';
import { canAccessTab } from '../utils/permissions';

// Tabs
import DashboardTab from '../components/admin/DashboardTab';
import RegistrationTab from '../components/admin/RegistrationTab';
import StudentsTab from '../components/admin/StudentsTab';
import JustificationsTab from '../components/admin/JustificationsTab';
import DailyAttendanceTab from '../components/admin/DailyAttendanceTab';
import ReportsTab from '../components/admin/ReportsTab';
import SettingsTabContent from '../components/admin/SettingsTabContent';
import TelegramTab from '../components/admin/TelegramTab';
import OccupancyTab from '../components/admin/OccupancyTab';
import AnnouncementsTab from '../components/admin/AnnouncementsTab';
import UsersTab from '../components/admin/UsersTab';
import type { TabName } from '../components/admin/Sidebar';
import PermissionsManager from '../components/admin/PermissionsManager';
import TasksTab from '../components/admin/TasksTab';
import AcademicTab from '../components/admin/AcademicTab';
import GradesTab from '../components/admin/GradesTab';
import AuditLogsTab from '../components/admin/AuditLogsTab';

const AdminDashboard: React.FC = () => {
    const { isSuperuser, role, permissions } = useAuth();
    const {
        activeTab,
        schedules,
        logs,
        occupancy,
        percentageData,
        percentagePeriod,
        setPercentagePeriod,
        loadingPerc,
        refreshAnalytics
    } = useAdminDashboard();

    const grades = [
        "1 PRIMARIA", "2 PRIMARIA", "3 PRIMARIA", "4 PRIMARIA", "5 PRIMARIA", "6 PRIMARIA",
        "1 SECUNDARIA", "2 SECUNDARIA", "3 SECUNDARIA", "4 SECUNDARIA", "5 SECUNDARIA"
    ];
    const sections = ["A", "B", "C", "D", "E"];
    
    // Permission check
    const hasAccess = (tab: TabName) => canAccessTab(role, tab, isSuperuser, permissions);

    return (
        <AdminLayout activeTab={activeTab}>
            {activeTab === 'dashboard' && hasAccess('dashboard') && <DashboardTab 
                logs={logs} occupancy={occupancy} onRefresh={refreshAnalytics} 
                percentageData={percentageData} percentagePeriod={percentagePeriod} setPercentagePeriod={setPercentagePeriod} loadingPerc={loadingPerc}
            />}
            {activeTab === 'occupancy' && hasAccess('occupancy') && <OccupancyTab grades={grades} sections={sections} />}
            {activeTab === 'registration' && hasAccess('registration') && (
                <RegistrationTab grades={grades} sections={sections} schedules={schedules} isActiveTab={activeTab === 'registration'} />
            )}
            {activeTab === 'students' && hasAccess('students') && <StudentsTab grades={grades} sections={sections} />}
            {activeTab === 'daily_attendance' && hasAccess('daily_attendance') && <DailyAttendanceTab grades={grades} sections={sections} schedules={schedules} />}
            {activeTab === 'reports' && hasAccess('reports') && <ReportsTab grades={grades} sections={sections} schedules={schedules} />}
            {activeTab === 'justifications' && hasAccess('justifications') && <JustificationsTab />}
            
            {/* Pestañas académicas */}
            {activeTab === 'academic' && hasAccess('academic') && <AcademicTab />}
            {activeTab === 'grades' && hasAccess('grades') && <GradesTab />}
            {activeTab === 'tasks' && hasAccess('tasks') && <TasksTab grades={grades} sections={sections} />}
            {activeTab === 'announcements' && hasAccess('announcements') && <AnnouncementsTab grades={grades} sections={sections} />}

            {/* Pestañas restringidas */}
            {activeTab === 'settings' && hasAccess('settings') && (
                <div className="space-y-10">
                    <SettingsTabContent schedules={schedules} onRefreshSchedules={refreshAnalytics} />
                    {isSuperuser && <PermissionsManager />}
                </div>
            )}
            {activeTab === 'telegram' && hasAccess('telegram') && <TelegramTab grades={grades} sections={sections} />}
            
            {/* Gestión de Usuarios (Sólo para Super Admin) */}
            {activeTab === 'users' && hasAccess('users') && <UsersTab isActiveTab={activeTab === 'users'} />}
            
            {/* Registro de Auditoría */}
            {activeTab === 'audit' && hasAccess('audit') && <AuditLogsTab />}

        </AdminLayout>
    );
};

export default AdminDashboard;
