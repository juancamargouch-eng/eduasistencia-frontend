import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import { type TabName } from './Sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: TabName;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex relative overflow-x-hidden">
            {/* Overlay para móviles */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0">
                <AdminHeader
                    activeTab={activeTab}
                    currentTime={currentTime}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
