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
    pagination: { page: number, total: number, limit: number };
    onPageChange: (page: number) => void;
    filterGrade: string;
    setFilterGrade: (grade: string) => void;
    filterSection: string;
    setFilterSection: (section: string) => void;
    grades: string[];
    sections: string[];
}

const StudentTelegramTable: React.FC<StudentTelegramTableProps> = ({
    students,
    searchTerm,
    onSearchChange,
    onUpdateChatId,
    onToggleNotify,
    pagination,
    onPageChange,
    filterGrade,
    setFilterGrade,
    filterSection,
    setFilterSection,
    grades,
    sections
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold">Gestión de Notificaciones</h3>
                        <p className="text-slate-500 text-sm">Vincule a los alumnos con sus apoderados</p>
                    </div>
                    <div className="w-full md:w-80">
                        <Input
                            placeholder="Buscar por nombre o DNI..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            icon="search"
                            className="py-2.5"
                        />
                    </div>
                </div>

                {/* Academic Filters */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                    <div className="flex-1 min-w-[180px]">
                        <select 
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold text-xs appearance-none cursor-pointer"
                            value={filterGrade}
                            onChange={(e) => setFilterGrade(e.target.value)}
                        >
                            <option value="">Todos los Grados</option>
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="w-32">
                        <select 
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold text-xs appearance-none cursor-pointer"
                            value={filterSection}
                            onChange={(e) => setFilterSection(e.target.value)}
                        >
                            <option value="">Sección</option>
                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
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

            {/* Pagination Controls */}
            {pagination.total > pagination.limit && (
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                    <p className="text-xs text-slate-500">
                        Mostrando {students.length} de {pagination.total} alumnos
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={pagination.page === 0}
                            onClick={() => onPageChange(pagination.page - 1)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-icons text-sm">chevron_left</span>
                        </button>
                        <div className="flex items-center px-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold text-primary">
                            Página {pagination.page + 1}
                        </div>
                        <button
                            disabled={(pagination.page + 1) * pagination.limit >= pagination.total}
                            onClick={() => onPageChange(pagination.page + 1)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-icons text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentTelegramTable;
