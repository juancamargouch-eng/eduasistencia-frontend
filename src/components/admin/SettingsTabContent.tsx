import React from 'react';
import { type Schedule } from '../../services/api';

import { useSettingsTab } from '../../hooks/tabs/useSettingsTab';

interface SettingsTabProps {
    schedules: Schedule[];
    onRefreshSchedules: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
    schedules,
    onRefreshSchedules
}) => {
    const {
        form, setName, setStart, setEnd, setTolerance,
        editingScheduleId,
        loading,
        handleEditSchedule,
        handleCancelEdit,
        handleSubmitSchedule
    } = useSettingsTab(onRefreshSchedules);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 lg:p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <span className="material-icons-outlined text-3xl">more_time</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                            {editingScheduleId ? 'Editar Horario' : 'Nuevo Horario'}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Configuración de turnos</p>
                    </div>
                </div>

                <form onSubmit={handleSubmitSchedule} className="space-y-8">
                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Identificador del Turno</p>
                        <input className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm" value={form.name} onChange={e => setName(e.target.value)} required placeholder="EJ: TURNO MAÑANA" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Hora Entrada</p>
                            <input type="time" className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-sm" value={form.start} onChange={e => setStart(e.target.value)} required />
                        </div>
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Hora Salida</p>
                            <input type="time" className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-sm" value={form.end} onChange={e => setEnd(e.target.value)} required />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Margen de Tolerancia (Minutos)</p>
                        <div className="relative">
                            <input type="number" className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-sm" value={form.tolerance} onChange={e => setTolerance(e.target.value)} required placeholder="0" />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-[10px] uppercase text-slate-400 opacity-50">MIN</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50">
                            {loading ? 'Procesando...' : (editingScheduleId ? 'Actualizar' : 'Crear Turno')}
                        </button>
                        {editingScheduleId && (
                            <button type="button" disabled={loading} onClick={handleCancelEdit} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all disabled:opacity-50">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 lg:p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                        <span className="material-icons-outlined text-3xl">event_available</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                            Turnos Activos
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Base de datos institucional</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {schedules.map(s => (
                        <div key={s.id} className="p-6 bg-white/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex justify-between items-center group transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-black/5">
                            <div className="flex items-center gap-5">
                                <div className="w-2 h-10 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-1">{s.name}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons text-[10px] text-primary">schedule</span>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {s.start_time} - {s.end_time || '--:--'} <span className="mx-2 opacity-20">|</span> Tol: {s.tolerance_minutes}m
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleEditSchedule(s)}
                                className="w-10 h-10 flex items-center justify-center text-primary bg-primary/10 dark:bg-primary/5 rounded-xl transition-all hover:bg-primary hover:text-white lg:opacity-0 lg:group-hover:opacity-100"
                                title="Editar Horario"
                            >
                                <span className="material-icons-outlined text-lg">edit</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
