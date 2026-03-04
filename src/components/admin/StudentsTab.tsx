import React, { useState } from 'react';
import type { Student } from '../../services/api';
import { BASE_URL } from '../../services/api';

interface StudentsTabProps {
    students: Student[];
    filterGrade: string;
    setFilterGrade: (val: string) => void;
    filterSection: string;
    setFilterSection: (val: string) => void;
    grades: string[];
    sections: string[];
    onImport: () => void;
    onSelectStudent: (student: Student) => void;
}

const StudentsTab: React.FC<StudentsTabProps> = ({
    students,
    filterGrade, setFilterGrade,
    filterSection, setFilterSection,
    grades, sections,
    onImport, onSelectStudent
}) => {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

    const filteredStudents = students.filter(s =>
        (!filterGrade || s.grade === filterGrade) &&
        (!filterSection || s.section === filterSection)
    );

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Estudiantes</h3>
                    <p className="text-sm text-slate-500 font-medium">{filteredStudents.length} registros encontrados</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* View Switcher */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            title="Vista Galería"
                        >
                            <span className="material-icons-outlined block">grid_view</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            title="Vista Lista"
                        >
                            <span className="material-icons-outlined block">reorder</span>
                        </button>
                    </div>

                    <button onClick={onImport} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20 active:scale-95">
                        <span className="material-icons-outlined text-lg">upload_file</span> Importar
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>

                    <select
                        className="px-4 py-2.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 outline-none text-sm font-bold focus:border-primary transition-all"
                        value={filterGrade}
                        onChange={e => setFilterGrade(e.target.value)}
                    >
                        <option value="">Todos los Grados</option>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select
                        className="px-4 py-2.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:border-slate-800 outline-none text-sm font-bold focus:border-primary transition-all"
                        value={filterSection}
                        onChange={e => setFilterSection(e.target.value)}
                    >
                        <option value="">Todas las Sec.</option>
                        {sections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-4">Estudiante</th>
                                <th className="px-6 py-4">DNI</th>
                                <th className="px-6 py-4 text-center">Grado / Sec.</th>
                                <th className="px-6 py-4 text-center">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                                {student.photo_url ? (
                                                    <img src={`${BASE_URL}${student.photo_url}`} alt={student.full_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <span className="material-icons text-2xl">person</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900 dark:text-white block leading-tight">{student.full_name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: #{student.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-black tracking-widest text-sm">{student.dni}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-center font-bold text-sm">
                                        {student.grade} <span className="text-primary opacity-50 ml-1">"{student.section}"</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                            {student.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onSelectStudent(student)}
                                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all inline-flex items-center justify-center group-hover:scale-110"
                                        >
                                            <span className="material-icons-outlined text-xl">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredStudents.map(student => (
                        <div
                            key={student.id}
                            onClick={() => onSelectStudent(student)}
                            className="group relative cursor-pointer bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-3 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 border-b-4 hover:border-b-primary"
                        >
                            {/* Card Status Badge */}
                            <div className="absolute top-5 right-5 z-10">
                                <div className={`w-3 h-3 rounded-full shadow-lg ${student.is_active ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
                            </div>

                            {/* Portrait Photo Wrapper */}
                            <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-slate-200 dark:bg-slate-800 mb-4 ring-2 ring-transparent group-hover:ring-primary/30 transition-all relative">
                                {student.photo_url ? (
                                    <img
                                        src={`${BASE_URL}${student.photo_url}`}
                                        alt={student.full_name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <span className="material-icons text-5xl">person</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            {/* Student Info */}
                            <div className="px-2 text-center pb-2">
                                <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                    {student.full_name.split(' ')[0]} {student.full_name.split(' ')[1] || ''}
                                </h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                    {student.grade} <span className="mx-1">•</span> "{student.section}"
                                </p>

                                <div className="inline-flex py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 tracking-widest uppercase">
                                    {student.dni}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentsTab;
