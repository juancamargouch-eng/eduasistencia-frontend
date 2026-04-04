import React from 'react';
import { getStudentPhotoUrl } from '../../services/api';
import { useOccupancyTab } from '../../hooks/tabs/useOccupancyTab';

interface OccupancyTabProps {
    grades: string[];
    sections: string[];
}

const OccupancyTab: React.FC<OccupancyTabProps> = ({ 
    grades,
    sections
}) => {
    const {
        occupancy,
        pagination,
        setPagination,
        filterGrade,
        setFilterGrade,
        filterSection,
        setFilterSection,
        refresh
    } = useOccupancyTab();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Filtros de Búsqueda Académica */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-sm flex flex-wrap gap-6 items-end">
                <div className="flex-1 min-w-[200px] space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Filtrar por Grado</label>
                    <div className="relative">
                        <select 
                            className="w-full px-5 py-3 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 font-black text-xs tracking-tight transition-all appearance-none cursor-pointer"
                            value={filterGrade}
                            onChange={(e) => setFilterGrade(e.target.value)}
                        >
                            <option value="">Todos los Grados</option>
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                </div>
                <div className="flex-1 min-w-[150px] space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Sección</label>
                    <div className="relative">
                        <select 
                            className="w-full px-5 py-3 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 font-black text-xs tracking-tight transition-all appearance-none cursor-pointer"
                            value={filterSection}
                            onChange={(e) => setFilterSection(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                </div>
            </div>

            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Entradas Hoy</p>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{occupancy.total_entries}</span>
                        <span className="text-green-500 mb-1 material-icons">login</span>
                    </div>
                </div>
                
                <div className="bg-primary p-8 rounded-[2rem] shadow-2xl shadow-primary/20 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="opacity-80 font-bold text-xs uppercase tracking-widest mb-2">Aforo Actual</p>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black">{occupancy.current_count}</span>
                            <span className="mb-1 material-icons text-3xl">groups</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Salidas Hoy</p>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{occupancy.total_exits}</span>
                        <span className="text-blue-500 mb-1 material-icons">logout</span>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Alumnos en el Campus</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Lista de alumnos que marcaron entrada y aún están presentes.</p>
                    </div>
                    <button 
                        onClick={refresh}
                        className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        <span className="material-icons">refresh</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estudiante</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Grado / Sección</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Hora de Ingreso</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {occupancy.items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        No hay alumnos registrados actualmente en el campus.
                                    </td>
                                </tr>
                            ) : (
                                occupancy.items.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                    <img 
                                                        src={getStudentPhotoUrl(student.photo_url) || 'https://www.w3schools.com/howto/img_avatar.png'} 
                                                        alt="" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{student.full_name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium lowercase">DNI: {student.dni || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                                {student.grade} • {student.section}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="inline-flex items-center gap-2 text-primary font-black text-sm">
                                                <span className="material-icons text-sm">schedule</span>
                                                {new Date(student.entry_time).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-icons">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination.total > pagination.limit && (
                    <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Mostrando {occupancy.items.length} de {pagination.total} en campus
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                disabled={pagination.page === 0}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-inherit transition-all shadow-sm"
                            >
                                <span className="material-icons text-sm">chevron_left</span> Anterior
                            </button>
                            <div className="flex items-center px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Página {pagination.page + 1}
                            </div>
                            <button
                                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                disabled={(pagination.page + 1) * pagination.limit >= pagination.total}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-inherit transition-all shadow-sm"
                            >
                                Siguiente <span className="material-icons text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OccupancyTab;
