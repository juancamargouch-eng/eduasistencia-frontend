import React from 'react';
import type { useAcademic } from './useAcademic';

interface MatrixSubTabProps {
    logic: ReturnType<typeof useAcademic>;
}

const MatrixSubTab: React.FC<MatrixSubTabProps> = ({ logic }) => {
    const {
        periods, courses, criteria,
        newPeriodName, setNewPeriodName, newPeriodStart, setNewPeriodStart, newPeriodEnd, setNewPeriodEnd,
        newCourseName, setNewCourseName,
        newCriteriaName, setNewCriteriaName, newCriteriaWeight, setNewCriteriaWeight,
        isSubmitting,
        handleCreatePeriod, handleCreateCourse, handleCreateCriteria,
        handleEditPeriod, handleEditCourse, handleEditCriteria,
        handleDeletePeriod, handleDeleteCourse, handleDeleteCriteria
    } = logic;

    return (
        <>
            {/* Periodos */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-icons-outlined text-indigo-500">date_range</span> Periodos</h3>
                <form onSubmit={handleCreatePeriod} className="space-y-3 mb-6">
                    <input required type="text" value={newPeriodName} onChange={e => setNewPeriodName(e.target.value)} placeholder="Ej. I Bimestre" className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                    <div className="grid grid-cols-2 gap-2">
                        <input required type="date" value={newPeriodStart} onChange={e => setNewPeriodStart(e.target.value)} className="w-full text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                        <input required type="date" value={newPeriodEnd} onChange={e => setNewPeriodEnd(e.target.value)} className="w-full text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-500 text-white rounded-xl py-3 text-xs font-black uppercase shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Crear Periodo</button>
                </form>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {periods.map(p => (
                        <div key={p.id} className="group flex justify-between items-center p-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 transition-all">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">{p.name}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">{p.start_date} - {p.end_date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] px-2 py-1 rounded-md font-black uppercase ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.is_active ? 'Activo' : 'Cerrado'}</span>
                                <button onClick={() => handleEditPeriod(p)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-indigo-500 transition-all" title="Editar Periodo">
                                    <span className="material-icons-outlined text-sm">edit</span>
                                </button>
                                <button onClick={() => handleDeletePeriod(p.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-all" title="Eliminar Periodo">
                                    <span className="material-icons-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cursos */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-icons-outlined text-fuchsia-500">menu_book</span> Cursos (Malla)</h3>
                <form onSubmit={handleCreateCourse} className="flex gap-2 mb-6">
                    <input required type="text" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} placeholder="Ej. Álgebra" className="flex-1 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-500" />
                    <button type="submit" disabled={isSubmitting} className="bg-fuchsia-500 text-white rounded-xl px-4 font-black shadow-lg shadow-fuchsia-500/20 active:scale-95 transition-all"><span className="material-icons-outlined">add</span></button>
                </form>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {courses.map(c => (
                        <div key={c.id} className="group flex justify-between items-center p-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-fuchsia-300 transition-all">
                            <span className="text-sm font-bold">{c.name}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleEditCourse(c)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-fuchsia-500 transition-all" title="Renombrar Curso">
                                    <span className="material-icons-outlined text-sm">edit</span>
                                </button>
                                <button onClick={() => handleDeleteCourse(c.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-all" title="Eliminar Curso">
                                    <span className="material-icons-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Criterios */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-icons-outlined text-rose-500">fact_check</span> Rubros y Criterios</h3>
                <form onSubmit={handleCreateCriteria} className="space-y-3 mb-6">
                    <input required type="text" value={newCriteriaName} onChange={e => setNewCriteriaName(e.target.value)} placeholder="Ej. Cuaderno" className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-rose-500" />
                    <div className="flex items-center gap-2">
                        <input type="number" min="0" max="100" value={newCriteriaWeight} onChange={e => setNewCriteriaWeight(parseInt(e.target.value)||0)} className="w-24 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-center" />
                        <span className="text-xs font-bold text-slate-400">% de peso (opcional)</span>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-rose-500 text-white rounded-xl py-3 text-xs font-black uppercase shadow-lg shadow-rose-500/20 active:scale-95 transition-all">Crear Criterio</button>
                </form>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {criteria.map(c => (
                        <div key={c.id} className="group flex justify-between items-center p-3 bg-rose-50/50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30 hover:border-rose-300 transition-all">
                            <span className="text-sm font-bold text-rose-900 dark:text-rose-400">{c.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-rose-500 bg-rose-100 dark:bg-rose-900/50 px-2 py-1 rounded-md">{c.weight_percentage}%</span>
                                <button onClick={() => handleEditCriteria(c)} className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-300 hover:text-rose-600 transition-all" title="Editar Criterio">
                                    <span className="material-icons-outlined text-sm">edit</span>
                                </button>
                                <button onClick={() => handleDeleteCriteria(c.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-300 hover:text-rose-600 transition-all" title="Eliminar Criterio">
                                    <span className="material-icons-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MatrixSubTab;
