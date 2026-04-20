import React from 'react';
import { motion } from 'framer-motion';
import { useStudents } from '../../hooks/useStudents';
import TelegramAuthFlow from './telegram/TelegramAuthFlow';
import StudentTelegramTable from './telegram/StudentTelegramTable';

interface TelegramTabProps {
    grades: string[];
    sections: string[];
}

const TelegramTab: React.FC<TelegramTabProps> = ({ grades, sections }) => {
    const {
        loading,
        searchTerm,
        setSearchTerm,
        pagination,
        setPagination,
        filteredStudents,
        filters,
        setFilters,
        handleUpdateStudent,
        handleToggleNotify,
        handleSyncTelegram
    } = useStudents();

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-20"
        >
            <TelegramAuthFlow />

            <StudentTelegramTable
                students={filteredStudents}
                searchTerm={searchTerm}
                onSearchChange={(val: string) => {
                    setSearchTerm(val);
                    setPagination(p => ({ ...p, page: 0 }));
                }}
                onUpdateChatId={(student, chatId) => handleUpdateStudent(student.id, { telegram_chat_id: chatId })}
                onToggleNotify={handleToggleNotify}
                onSyncAll={handleSyncTelegram}
                pagination={pagination}
                onPageChange={(page: number) => setPagination(p => ({ ...p, page }))}
                filterGrade={filters.grade}
                setFilterGrade={(g: string) => {
                    setFilters(prev => ({ ...prev, grade: g }));
                    setPagination(p => ({ ...p, page: 0 }));
                }}
                filterSection={filters.section}
                setFilterSection={(s: string) => {
                    setFilters(prev => ({ ...prev, section: s }));
                    setPagination(p => ({ ...p, page: 0 }));
                }}
                grades={grades}
                sections={sections}
            />
        </motion.div>
    );
};

export default TelegramTab;
