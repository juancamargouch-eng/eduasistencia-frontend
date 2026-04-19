import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { getStudentPhotoUrl } from '../../services/api';

import { useStudentsTab } from '../../hooks/tabs/useStudentsTab';
import ImportModal from '../ImportStudentsModal';
import BulkPhotoCaptureModal from './BulkPhotoEnrollment';
import StudentDetailsModal from '../StudentDetailsModal';
import ConfirmModal from '../ui/ConfirmModal';

interface StudentsTabProps {
    grades: string[];
    sections: string[];
}

const StudentsTab: React.FC<StudentsTabProps> = ({
    grades, sections
}) => {
    const {
        students,
        filterGrade, setFilterGrade,
        filterSection, setFilterSection,
        search, setSearch,
        pagination, handlePageChange,
        showImportModal, setShowImportModal,
        showBulkPhotoModal, setShowBulkPhotoModal,
        selectedStudent, setSelectedStudent,
        handleStudentUpdate,
        studentToDelete,
        setStudentToDelete,
        handleDelete,
        refresh
    } = useStudentsTab();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

    const filteredStudents = students; // Ya filtrados en servidor

    return (
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-8 lg:p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">Padrón de Estudiantes</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        {pagination.total} registros sincronizados
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* View Switcher Premium */}
                    <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl mr-2 border border-slate-200/50 dark:border-slate-700/50">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-xl text-primary scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            title="Vista Galería"
                        >
                            <span className="material-icons-outlined block text-xl">grid_view</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-xl text-primary scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            title="Vista Lista"
                        >
                            <span className="material-icons-outlined block text-xl">reorder</span>
                        </button>
                    </div>

                    <button onClick={() => setShowImportModal(true)} className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-[0_15px_30px_-5px_rgba(16,185,129,0.3)] active:scale-95 group">
                        <span className="material-icons-outlined text-xl group-hover:rotate-12 transition-transform">upload_file</span> Importar
                    </button>

                    <button onClick={() => setShowBulkPhotoModal(true)} className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-[0_15px_30px_-5px_rgba(79,70,229,0.3)] active:scale-95 group">
                        <span className="material-icons-outlined text-xl group-hover:scale-125 transition-transform">add_a_photo</span> Enrolamiento Masivo
                    </button>

                    <div className="h-10 w-[2px] bg-slate-200/50 dark:bg-slate-700/50 mx-2 hidden xl:block"></div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                            <input
                                type="text"
                                placeholder="Buscar por DNI o Nombre..."
                                className="pl-12 pr-6 py-3.5 rounded-2xl border-none bg-slate-100/50 dark:bg-slate-800/80 outline-none text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all min-w-[250px]"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <select
                                className="pl-6 pr-10 py-3.5 rounded-2xl border-none bg-slate-100/50 dark:bg-slate-800/80 outline-none text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                                value={filterGrade}
                                onChange={e => setFilterGrade(e.target.value)}
                            >
                                <option value="">Todos los Grados</option>
                                {grades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none text-base">expand_more</span>
                        </div>
                        <div className="relative">
                            <select
                                className="pl-6 pr-10 py-3.5 rounded-2xl border-none bg-slate-100/50 dark:bg-slate-800/80 outline-none text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                                value={filterSection}
                                onChange={e => setFilterSection(e.target.value)}
                            >
                                <option value="">Todas las Sec.</option>
                                {sections.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none text-base">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
                                <th className="px-8 py-6 rounded-tl-3xl">Estudiante Académico</th>
                                <th className="px-6 py-6">Identidad</th>
                                <th className="px-6 py-6 text-center">Nivel Educativo</th>
                                <th className="px-6 py-6 text-center">Estado Biométrico</th>
                                <th className="px-8 py-6 text-right rounded-tr-3xl">Acciones de Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="group hover:bg-white/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden ring-4 ring-transparent group-hover:ring-primary/10 transition-all duration-500 shadow-sm">
                                                {student.photo_url ? (
                                                    <img
                                                        src={getStudentPhotoUrl(student.photo_url) || ''}
                                                        alt={student.full_name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-700 bg-slate-50 dark:bg-slate-800">
                                                        <span className="material-icons text-3xl">account_circle</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight mb-1 select-none leading-none">
                                                    {student.full_name.split(' ')[0]} <span className="opacity-40">{student.full_name.split(' ').slice(1).join(' ')}</span>
                                                </span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md self-start">ID: {student.id.toString().padStart(6, '0')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 mb-0.5">DNI INSTITUCIONAL</span>
                                            <span className="text-slate-600 dark:text-slate-400 font-mono font-black tracking-widest text-sm">{student.dni}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 px-4 py-2 rounded-xl group-hover:bg-primary/5 transition-colors">
                                            <span className="font-black text-slate-900 dark:text-white text-xs tracking-tight">{student.grade}</span>
                                            <span className="text-primary font-black text-xs">"{student.section}"</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-transform hover:scale-105 select-none ${student.is_active ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/20'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${student.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                            {student.is_active ? 'OPERATIVO' : 'SUSPENDIDO'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all inline-flex items-center justify-center group-hover:scale-110 shadow-sm"
                                                title="Ver Detalle"
                                            >
                                                <span className="material-icons-outlined text-xl">visibility</span>
                                            </button>
                                            <button
                                                onClick={() => setStudentToDelete(student.id)}
                                                className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all inline-flex items-center justify-center group-hover:scale-110 shadow-sm"
                                                title="Eliminar Estudiante"
                                            >
                                                <span className="material-icons-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {filteredStudents.map(student => (
                        <div
                            key={student.id}
                            onClick={() => setSelectedStudent(student)}
                            className="group relative cursor-pointer bg-white/40 dark:bg-slate-800/20 border border-white dark:border-slate-800 rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-3 hover:bg-white dark:hover:bg-slate-800"
                        >
                            {/* Card Status Indicator */}
                            <div className="absolute top-6 right-6 z-20">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow-xl ${student.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                            </div>

                            {/* Portrait Photo Wrapper Premium */}
                            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-white dark:bg-slate-700/50 mb-6 ring-4 ring-transparent group-hover:ring-primary/20 transition-all duration-700 relative shadow-inner">
                                {student.photo_url ? (
                                    <img
                                        src={getStudentPhotoUrl(student.photo_url) || ''}
                                        alt={student.full_name}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-125"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-100 dark:text-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                        <span className="material-icons text-6xl opacity-20">person</span>
                                    </div>
                                )}
                                {/* Overlay gradiente sutil */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                    <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] mb-1">Ver Perfil Académico</span>
                                    <div className="w-8 h-1 bg-primary rounded-full"></div>
                                </div>
                            </div>

                            {/* Student Info Premium */}
                            <div className="px-2 text-center pb-2">
                                <div className="flex flex-col items-center mb-4">
                                    <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tighter line-clamp-1 group-hover:text-primary transition-colors leading-none mb-1">
                                        {student.full_name.split(' ')[0]} {student.full_name.split(' ')[1] || ''}
                                    </h4>
                                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em]">{student.full_name.split(' ').slice(2).join(' ')}</span>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg tracking-tight">{student.grade}</span>
                                    <span className="text-primary font-black text-[10px] bg-primary/5 px-2 py-1 rounded-lg">"{student.section}"</span>
                                </div>

                                <div className="inline-flex py-2 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300 tracking-[0.2em] transition-colors border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-800">
                                    {student.dni}
                                </div>
                            </div>
                            
                            {/* Grid Delete Overlay */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); setStudentToDelete(student.id); }}
                                className="absolute -top-1 -left-1 w-10 h-10 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-30"
                                title="Eliminar Estudiante"
                            >
                                <span className="material-icons text-xl">delete_outline</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls Premium */}
            {pagination.total > pagination.limit && (
                <div className="mt-12 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Mostrando <span className="text-slate-900 dark:text-white">{students.length}</span> de <span className="text-slate-900 dark:text-white">{pagination.total}</span> alumnos
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={pagination.page === 0}
                            onClick={() => handlePageChange(pagination.page - 1)}
                            className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <span className="material-icons">chevron_left</span>
                        </button>
                        <div className="flex items-center px-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-black text-primary">
                            Página {pagination.page + 1}
                        </div>
                        <button
                            disabled={(pagination.page + 1) * pagination.limit >= pagination.total}
                            onClick={() => handlePageChange(pagination.page + 1)}
                            className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <span className="material-icons">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Modales Locales */}
            {showImportModal && createPortal(
                <ImportModal onClose={() => setShowImportModal(false)} onImportSuccess={refresh} />, document.body
            )}
            
            {showBulkPhotoModal && createPortal(
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl relative">
                        <button onClick={() => setShowBulkPhotoModal(false)} className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-full flex items-center justify-center transition-all">
                            <span className="material-icons">close</span>
                        </button>
                        <BulkPhotoCaptureModal
                            onComplete={() => { setShowBulkPhotoModal(false); refresh(); }}
                        />
                    </div>
                </div>, document.body
            )}
            
            {selectedStudent && (
                <StudentDetailsModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onUpdate={handleStudentUpdate}
                />
            )}

            <ConfirmModal
                isOpen={!!studentToDelete}
                onClose={() => setStudentToDelete(null)}
                onConfirm={handleDelete}
                title="¿Eliminar Estudiante?"
                description="Esta acción eliminará permanentemente al estudiante y sus registros de asistencia. ¿Deseas continuar?"
                confirmText="Sí, Eliminar"
                cancelText="Mantener"
                type="danger"
            />
        </div>
    );
};

export default StudentsTab;
