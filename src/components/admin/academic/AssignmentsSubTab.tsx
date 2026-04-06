import React from 'react';
import type { useAcademic } from './useAcademic';

interface AssignmentsSubTabProps {
    logic: ReturnType<typeof useAcademic>;
}

const AssignmentsSubTab: React.FC<AssignmentsSubTabProps> = ({ logic }) => {
    const {
        assignments, teachers, courses,
        assignTeacherId, setAssignTeacherId,
        assignCourseId, setAssignCourseId,
        assignGrade, setAssignGrade,
        assignSection, setAssignSection,
        isSubmitting,
        handleCreateAssignment,
        handleEditAssignment,
        handleDeleteAssignment
    } = logic;

    const gradeOptions = [
        "1 PRIMARIA", "2 PRIMARIA", "3 PRIMARIA", "4 PRIMARIA", "5 PRIMARIA", "6 PRIMARIA",
        "1 SECUNDARIA", "2 SECUNDARIA", "3 SECUNDARIA", "4 SECUNDARIA", "5 SECUNDARIA"
    ];
    const sectionOptions = ["A", "B", "C", "D", "E"];

    return (
        <>
            <div className="xl:col-span-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl h-fit">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-icons-outlined text-amber-500">person_add</span> Nueva Asignación</h3>
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Docente</label>
                        <select required value={assignTeacherId} onChange={e => setAssignTeacherId(e.target.value)} className="w-full mt-1 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500">
                            <option value="">Seleccione Docente...</option>
                            {teachers.map(t => <option key={t.id} value={t.id.toString()}>{t.full_name || t.username}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Curso</label>
                        <select required value={assignCourseId} onChange={e => setAssignCourseId(e.target.value)} className="w-full mt-1 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500">
                            <option value="">Seleccione Curso...</option>
                            {courses.map(c => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grado</label>
                            <select required value={assignGrade} onChange={e => setAssignGrade(e.target.value)} className="w-full mt-1 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500">
                                <option value="">...</option>
                                {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sección</label>
                            <select required value={assignSection} onChange={e => setAssignSection(e.target.value)} className="w-full mt-1 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500">
                                <option value="">...</option>
                                {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 text-white rounded-xl py-3 text-xs font-black uppercase shadow-lg shadow-amber-500/20 active:scale-95 transition-all mt-4">Vincular Docente</button>
                </form>
            </div>
            
            <div className="xl:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-icons-outlined text-slate-400">route</span> Carga Horaria de la Institución</h3>
                <div className="overflow-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profesor Asignado</th>
                                <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Materia / Curso</th>
                                <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Salón Objetivo</th>
                                <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(ass => {
                                const teacherFullName = teachers.find(t => t.id === ass.user_id)?.full_name || 'Desconocido';
                                const courseName = courses.find(c => c.id === ass.course_id)?.name || 'Desconocido';
                                return (
                                    <tr key={ass.id} className="bg-slate-50 dark:bg-slate-800/40">
                                        <td className="px-4 py-3 rounded-l-xl border-y border-l border-slate-100 dark:border-slate-700/30 text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div>{teacherFullName}</div>
                                        </td>
                                        <td className="px-4 py-3 border-y border-slate-100 dark:border-slate-700/30 text-xs font-bold text-indigo-600 dark:text-indigo-400">{courseName}</td>
                                        <td className="px-4 py-3 border-y border-slate-100 dark:border-slate-700/30 text-xs font-black bg-slate-100/50 dark:bg-slate-900/50">{ass.grade} "{ass.section}"</td>
                                        <td className="px-4 py-3 rounded-r-xl border-y border-r border-slate-100 dark:border-slate-700/30 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleEditAssignment(ass)} className="p-1.5 text-slate-300 hover:text-amber-500 transition-all" title="Editar Asignación">
                                                    <span className="material-icons-outlined text-sm">edit</span>
                                                </button>
                                                <button onClick={() => handleDeleteAssignment(ass.id!)} className="p-1.5 text-slate-300 hover:text-red-500 transition-all" title="Eliminar Asignación">
                                                    <span className="material-icons-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {assignments.length === 0 && (
                                <tr><td colSpan={4} className="text-center p-8 text-slate-400 font-bold text-sm">No hay asignaciones registradas en el sistema.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AssignmentsSubTab;
