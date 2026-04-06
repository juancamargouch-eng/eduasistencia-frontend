import React from 'react';
import type { useAcademic } from './useAcademic';

interface SettingsSubTabProps {
    logic: ReturnType<typeof useAcademic>;
}

const SettingsSubTab: React.FC<SettingsSubTabProps> = ({ logic }) => {
    const { settings, handleToggleGradingSystem, isSubmitting } = logic;

    return (
        <div className="xl:col-span-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl max-w-2xl mx-auto w-full">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
                    <span className="material-icons-outlined text-4xl">tune</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Reglas de Calificación</h3>
                <p className="text-xs font-medium text-slate-500 mt-2">Determina cómo toda la institución registrará sus calificaciones.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => handleToggleGradingSystem('NUMERIC')}
                    disabled={isSubmitting}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${settings?.grading_system === 'NUMERIC' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}
                >
                    <span className={`text-4xl font-black ${settings?.grading_system === 'NUMERIC' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>0-20</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sistema Numérico</span>
                </button>

                <button 
                    onClick={() => handleToggleGradingSystem('LITERAL')}
                    disabled={isSubmitting}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${settings?.grading_system === 'LITERAL' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}
                >
                    <span className={`text-4xl font-black ${settings?.grading_system === 'LITERAL' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>A-D</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sistema Literal</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsSubTab;
