import React from 'react';
import StudentTelegramRow from './StudentTelegramRow';
import Input from '../../ui/Input';
import { type Student } from '../../../services/api';

interface StudentTelegramTableProps {
    students: Student[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onUpdateChatId: (student: Student, chatId: string) => void;
    onToggleNotify: (student: Student) => void;
}

const StudentTelegramTable: React.FC<StudentTelegramTableProps> = ({
    students,
    searchTerm,
    onSearchChange,
    onUpdateChatId,
    onToggleNotify
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold">Gestión de Notificaciones</h3>
                    <p className="text-slate-500 text-sm">Vincule a los alumnos con sus apoderados</p>
                </div>
                <div className="w-full md:w-64">
                    <Input
                        placeholder="Buscar alumno..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        icon="search"
                        className="py-2.5"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 text-sm">
                            <th className="pb-4 font-semibold">Estudiante</th>
                            <th className="pb-4 font-semibold">Grado/Sección</th>
                            <th className="pb-4 font-semibold">Username / Phone</th>
                            <th className="pb-4 font-semibold">Estado</th>
                            <th className="pb-4 font-semibold text-right">Interruptor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {students.map((student) => (
                            <StudentTelegramRow
                                key={student.id}
                                student={student}
                                onUpdateChatId={onUpdateChatId}
                                onToggleNotify={onToggleNotify}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentTelegramTable;
