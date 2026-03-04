import React from 'react';
import { motion } from 'framer-motion';
import { useStudents } from '../../hooks/useStudents';
import TelegramAuthFlow from './telegram/TelegramAuthFlow';
import StudentTelegramTable from './telegram/StudentTelegramTable';

const TelegramTab: React.FC = () => {
    const {
        loading,
        searchTerm,
        setSearchTerm,
        filteredStudents,
        handleUpdateStudent,
        handleToggleNotify
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
                onSearchChange={setSearchTerm}
                onUpdateChatId={(student, chatId) => handleUpdateStudent(student.id, { telegram_chat_id: chatId })}
                onToggleNotify={handleToggleNotify}
            />
        </motion.div>
    );
};

export default TelegramTab;
