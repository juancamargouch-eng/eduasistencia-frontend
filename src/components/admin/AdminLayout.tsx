import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Sidebar, { type TabName } from './Sidebar';
import AdminHeader from './AdminHeader';
import ProfileEditModal from './ProfileEditModal';
import { getCurrentUser, type AdminUser } from '../../services/api';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: TabName;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const loadUser = async () => {
        try {
            const data = await getCurrentUser();
            setUser(data);
        } catch (error: unknown) {
            console.error("Error al cargar datos del perfil", error);
            toast.error("Error al cargar datos del perfil");
        }
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        loadUser();
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="font-display bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex relative overflow-x-hidden selection:bg-primary/20">
            {/* Overlay para móviles */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[40] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0">
                <AdminHeader
                    activeTab={activeTab}
                    currentTime={currentTime}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onOpenEditProfile={() => setIsEditModalOpen(true)}
                    user={user}
                />

                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    {children}
                </div>
            </main>

            <ProfileEditModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                onUpdate={(updatedUser) => setUser(updatedUser)} 
            />
        </div>
    );
};

export default AdminLayout;
