import React from 'react';
import type { useAcademic } from './useAcademic';

interface SettingsSubTabProps {
    logic: ReturnType<typeof useAcademic>;
}

const SettingsSubTab: React.FC<SettingsSubTabProps> = ({ logic }) => {
    const { settings, handleUpdateSettings, isSubmitting } = logic;

    const insertTag = (field: 'template_entry' | 'template_exit' | 'template_late', tag: string) => {
        const currentText = settings?.[field] || '';
        handleUpdateSettings({ [field]: currentText + tag });
    };

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
            {/* Sistema de Calificación */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
                        <span className="material-icons-outlined text-4xl">tune</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Reglas de Calificación</h3>
                    <p className="text-xs font-medium text-slate-500 mt-2">Determina cómo toda la institución registrará sus calificaciones.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleUpdateSettings({ grading_system: 'NUMERIC' })}
                        disabled={isSubmitting}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${settings?.grading_system === 'NUMERIC' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}
                    >
                        <span className={`text-4xl font-black ${settings?.grading_system === 'NUMERIC' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>0-20</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sistema Numérico</span>
                    </button>

                    <button 
                        onClick={() => handleUpdateSettings({ grading_system: 'LITERAL' })}
                        disabled={isSubmitting}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${settings?.grading_system === 'LITERAL' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}
                    >
                        <span className={`text-4xl font-black ${settings?.grading_system === 'LITERAL' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>A-D</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sistema Literal</span>
                    </button>
                </div>
            </div>

            {/* Tolerancia de Asistencia */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl w-full">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                        <span className="material-icons-outlined text-3xl">schedule</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white">Tolerancia de Entrada</h3>
                        <p className="text-xs font-medium text-slate-500">Minutos permitidos antes de marcar tardanza.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <input 
                        type="range" 
                        min="0" 
                        max="60" 
                        step="5"
                        value={settings?.late_tolerance_minutes || 0}
                        onChange={(e) => handleUpdateSettings({ late_tolerance_minutes: parseInt(e.target.value) })}
                        className="flex-1 accent-amber-500"
                    />
                    <div className="w-20 text-center py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-slate-800 dark:text-white">
                        {settings?.late_tolerance_minutes}m
                    </div>
                </div>
            </div>

            {/* Plantillas de Telegram */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl w-full">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                        <span className="material-icons-outlined text-3xl">chat_bubble_outline</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white">Mensajes de Telegram</h3>
                        <p className="text-xs font-medium text-slate-500">Personaliza lo que reciben los padres.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {[
                        { id: 'template_entry', label: 'Plantilla de Ingreso', color: 'text-emerald-500' },
                        { id: 'template_late', label: 'Plantilla de Tardanza', color: 'text-amber-500' },
                        { id: 'template_exit', label: 'Plantilla de Salida', color: 'text-blue-500' }
                    ].map((tpl) => (
                        <div key={tpl.id} className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full bg-current ${tpl.color}`}></span>
                                {tpl.label}
                            </label>
                            <div className="relative group">
                                <textarea 
                                    value={settings?.[tpl.id as key_of_settings] || ''}
                                    onChange={(e) => handleUpdateSettings({ [tpl.id]: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20 transition-all resize-none h-24"
                                    placeholder="Escribe el mensaje..."
                                />
                                <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                    {['{nombre}', '{hora}', '{fecha}'].map(tag => (
                                        <button 
                                            key={tag}
                                            onClick={() => insertTag(tpl.id as any, tag)}
                                            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-[9px] font-bold text-slate-600 dark:text-slate-400 transition-colors"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

type key_of_settings = 'grading_system' | 'late_tolerance_minutes' | 'template_entry' | 'template_exit' | 'template_late';

export default SettingsSubTab;
