import React from 'react';
import { useAcademic } from './academic/useAcademic';
import MatrixSubTab from './academic/MatrixSubTab';
import AssignmentsSubTab from './academic/AssignmentsSubTab';
import SettingsSubTab from './academic/SettingsSubTab';
import AcademicModal from './academic/AcademicModal';

const AcademicTab: React.FC = () => {
    // Toda la lógica pesada, states y API se extrajeron a este Hook
    const logic = useAcademic();

    if (logic.loading) {
        return <div className="p-10 text-center animate-pulse font-black text-slate-400 uppercase tracking-widest">Sincronizando Malla Académica...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                        <span className="material-icons-outlined text-3xl">school</span>
                    </div>
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                            Gestión Académica
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                            {logic.courses.length} Cursos • {logic.criteria.length} Criterios • {logic.periods.length} Periodos
                        </p>
                    </div>
                </div>
            </div>

            {/* Sub Nav */}
            <div className="flex gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl w-fit">
                <button onClick={() => logic.setActiveSubTab('matrix')} className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${logic.activeSubTab === 'matrix' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700'}`}>
                    Malla y Criterios
                </button>
                <button onClick={() => logic.setActiveSubTab('assignments')} className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${logic.activeSubTab === 'assignments' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700'}`}>
                    Asignaciones Docentes
                </button>
                <button onClick={() => logic.setActiveSubTab('settings')} className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${logic.activeSubTab === 'settings' ? 'bg-white dark:bg-slate-700 shadow-md text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700'}`}>
                    Ajustes Globales
                </button>
            </div>

            {/* Contenedor Divisor */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {logic.activeSubTab === 'matrix' && <MatrixSubTab logic={logic} />}
                {logic.activeSubTab === 'assignments' && <AssignmentsSubTab logic={logic} />}
                {logic.activeSubTab === 'settings' && <SettingsSubTab logic={logic} />}
            </div>

            {/* Modal Centralizado de Ediciones */}
            <AcademicModal logic={logic} />
        </div>
    );
};

export default AcademicTab;
