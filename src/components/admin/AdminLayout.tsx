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

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminHeader activeTab={activeTab} currentTime={currentTime} />

                <div className="p-8 space-y-8 overflow-y-auto flex-1 min-h-[600px] custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
