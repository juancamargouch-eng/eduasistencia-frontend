import React from 'react';
import { useHolidays } from '../../hooks/tabs/useHolidays';

export const HolidayManagement: React.FC = () => {
    const { holidays, loading, form, setForm, handleCreateHoliday, handleDeleteHoliday } = useHolidays();

    return (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 lg:p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <span className="material-icons-outlined text-3xl">event_busy</span>
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                        Gestión de Feriados
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Calendario Institucional Dinámico</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Formulario */}
                <form onSubmit={handleCreateHoliday} className="lg:col-span-1 space-y-6">
                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Fecha del Feriado</p>
                        <input 
                            type="date" 
                            className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm" 
                            value={form.date} 
                            onChange={e => setForm(p => ({ ...p, date: e.target.value }))} 
                            required 
                        />
                    </div>
                    <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Nombre / Motivo</p>
                        <input 
                            className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm" 
                            value={form.name} 
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
                            required 
                            placeholder="EJ: ANIVERSARIO COLEGIO"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'AGREGANDO...' : 'AGREGAR FERIADO'}
                    </button>
                </form>

                {/* Lista */}
                <div className="lg:col-span-2 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {holidays.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-30">
                            <span className="material-icons-outlined text-5xl mb-2">calendar_today</span>
                            <p className="text-[10px] font-black uppercase tracking-widest">No hay feriados registrados</p>
                        </div>
                    ) : (
                        holidays.map(h => (
                            <div key={h.id} className="p-5 bg-white/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex justify-between items-center group transition-all hover:bg-white dark:hover:bg-slate-800">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center">
                                        <p className="text-[8px] font-black uppercase text-slate-400 leading-none mb-1">
                                            {new Date(h.date + 'T00:00:00').toLocaleDateString('es-PE', { month: 'short' })}
                                        </p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
                                            {new Date(h.date + 'T00:00:00').getDate()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-1">{h.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{h.date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteHoliday(h.id)}
                                    className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-500/10 rounded-xl transition-all hover:bg-red-500 hover:text-white lg:opacity-0 lg:group-hover:opacity-100"
                                >
                                    <span className="material-icons-outlined text-lg">delete</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
