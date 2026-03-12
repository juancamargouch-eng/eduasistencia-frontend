import React from 'react';
import { getStudentPhotoUrl, type Schedule } from '../../services/api';

export interface DailyAttendanceResponse {
    is_non_working_day?: boolean;
    holiday_name?: string | null;
    summary: {
        present: number;
        late: number;
        absent: number;
        total: number;
    };
    students: Array<{
        id: number;
        full_name: string;
        photo_url?: string;
        status: 'PRESENT' | 'LATE' | 'ABSENT' | string;
        entry_time?: string | null;
    }>;
}

interface DailyAttendanceTabProps {
    dailyGrade: string;
    setDailyGrade: (val: string) => void;
    dailySection: string;
    setDailySection: (val: string) => void;
    dailyScheduleId: string | number;
    setDailyScheduleId: (val: string | number) => void;
    dailyDate: string;
    setDailyDate: (val: string) => void;
    dailyStats: DailyAttendanceResponse | null;
    dailyLoading: boolean;
    grades: string[];
    sections: string[];
    schedules: Schedule[];
}

const DailyAttendanceTab: React.FC<DailyAttendanceTabProps> = ({
    dailyGrade, setDailyGrade,
    dailySection, setDailySection,
    dailyScheduleId, setDailyScheduleId,
    dailyDate, setDailyDate,
    dailyStats,
    dailyLoading,
    grades, sections, schedules
}) => {

    const attendanceRate = dailyStats && dailyStats.summary.total > 0
        ? Math.round(((dailyStats.summary.present + dailyStats.summary.late) / dailyStats.summary.total) * 100)
        : 0;

    return (
        <div className="space-y-10 pb-20">
            {/* Filtros Avanzados - Glass Design */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-wrap gap-8 items-end group transition-all hover:bg-white/60 dark:hover:bg-slate-900/60">
                <div className="flex-1 min-w-[180px] space-y-3">
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400 group-hover:text-primary transition-colors">Grado Académico</label>
                    <div className="relative">
                        <select className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 font-black text-xs tracking-tight transition-all appearance-none" value={dailyGrade} onChange={e => setDailyGrade(e.target.value)}>
                            <option value="">Seleccionar Grado</option>
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                </div>
                <div className="flex-1 min-w-[120px] space-y-3">
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Sección</label>
                    <div className="relative">
                        <select className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 font-black text-xs tracking-tight transition-all appearance-none" value={dailySection} onChange={e => setDailySection(e.target.value)}>
                            <option value="">Sección</option>
                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                </div>
                <div className="flex-[1.5] min-w-[200px] space-y-3">
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Turno Operativo</label>
                    <div className="relative">
                        <select className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 font-black text-xs tracking-tight transition-all appearance-none" value={dailyScheduleId} onChange={e => setDailyScheduleId(e.target.value)}>
                            <option value="">Todos los Turnos</option>
                            {schedules.map(sch => <option key={sch.id} value={sch.id}>{sch.name} [{sch.start_time}]</option>)}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                </div>
                <div className="flex-1 min-w-[200px] space-y-3">
                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-primary">Fecha de Auditoría</label>
                    <input type="date" className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 font-black text-xs tracking-widest transition-all" value={dailyDate} onChange={e => setDailyDate(e.target.value)} />
                </div>
            </div>

            {dailyLoading ? (
                <div className="flex flex-col items-center justify-center py-40 animate-in fade-in zoom-in duration-1000">
                    <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 border-4 border-primary/10 dark:border-slate-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-4 bg-primary/5 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
                            <span className="material-icons text-primary animate-pulse">sync</span>
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Sincronizando Base de Datos</p>
                </div>
            ) : dailyStats ? (
                <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                    {/* Alertas de Día - Tech Style */}
                    {dailyStats.is_non_working_day && (
                        <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 px-8 py-5 rounded-[2rem] flex items-center gap-6 text-amber-600 dark:text-amber-400 shadow-xl shadow-amber-500/5 overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                            <span className="material-icons-outlined text-3xl group-hover:rotate-12 transition-transform">event_busy</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Calendario Académico</span>
                                <span className="text-sm lg:text-base font-black uppercase tracking-tight">Día no laborable detectado: {dailyStats.holiday_name}</span>
                            </div>
                        </div>
                    )}

                    {/* Dashboard de Resumen - Premium Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                        <SummaryCard label="Presentes" count={dailyStats.summary.present} icon="check_circle" color="green" />
                        <SummaryCard label="Tardanzas" count={dailyStats.summary.late} icon="history" color="amber" />
                        <SummaryCard label="Faltas" count={dailyStats.summary.absent} icon="cancel" color="red" />
                        <SummaryCard label="Matrícula" count={dailyStats.summary.total} icon="groups" color="slate" />
                        <div className="col-span-2 lg:col-span-1 bg-primary p-8 rounded-[2.5rem] text-white shadow-[0_25px_50px_-12px_rgba(225,5,33,0.35)] flex flex-col justify-center gap-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] translate-x-12 -translate-y-12"></div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1 opacity-60 relative z-10">Tasa de Asistencia</p>
                            <div className="relative z-10">
                                <span className="text-5xl font-black leading-none tracking-tighter">{attendanceRate}<span className="text-xl opacity-40">%</span></span>
                                <div className="mt-4 h-2.5 bg-white/20 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-white transition-all duration-[1.5s] ease-out shadow-lg" style={{ width: `${attendanceRate}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Alumnos - Dense Corporate Style */}
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] border border-white dark:border-slate-800 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
                                        <th className="py-8 px-10">Estudiante Académico</th>
                                        <th className="py-8 px-6 text-center">Estatus Biométrico</th>
                                        <th className="py-8 px-10 text-right">Marca de Tiempo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                                    {dailyStats.students.length > 0 ? dailyStats.students.map((s) => (
                                        <tr key={s.id} className="group hover:bg-white/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                                            <td className="py-5 px-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden ring-4 ring-transparent group-hover:ring-primary/10 transition-all duration-500 shadow-sm">
                                                        {s.photo_url ? (
                                                            <img src={getStudentPhotoUrl(s.photo_url) || ''} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-700 bg-slate-50 dark:bg-slate-800">
                                                                <span className="material-icons text-3xl">account_circle</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight mb-1 select-none">
                                                            {s.full_name.split(' ')[0]} <span className="opacity-40">{s.full_name.split(' ').slice(1).join(' ')}</span>
                                                        </span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md self-start">ID: {s.id.toString().padStart(6, '0')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <StatusBadge status={s.status} />
                                            </td>
                                            <td className="py-5 px-10 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-icons text-sm text-primary opacity-40">schedule</span>
                                                        <span className={`font-mono font-black text-base lg:text-lg tracking-tight ${s.entry_time ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-800'}`}>
                                                            {s.entry_time ? new Date(s.entry_time).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '--:--:--'}
                                                        </span>
                                                    </div>
                                                    {s.status === 'LATE' && <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.1em] bg-orange-500/10 px-2 py-0.5 rounded-full">+ TARDANZA</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="py-32 text-center text-slate-300">
                                                <div className="flex flex-col items-center gap-4">
                                                    <span className="material-icons text-6xl opacity-10">search_off</span>
                                                    <p className="font-black uppercase tracking-[0.4em] text-xs opacity-50">No se encontraron registros para este grupo</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-48 bg-white/40 dark:bg-slate-900/20 rounded-[4rem] border-4 border-dashed border-slate-200/50 dark:border-slate-800/50 text-slate-300 backdrop-blur-md animate-in fade-in duration-1000">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-10 border border-slate-200 dark:border-slate-800 shadow-inner">
                        <span className="material-icons-outlined text-6xl opacity-20 rotate-12">fact_check</span>
                    </div>
                    <p className="font-black uppercase tracking-[0.5em] text-[11px] opacity-40 mb-3">Auditoría de Asistencia</p>
                    <p className="text-[10px] font-bold opacity-30 max-w-[250px] text-center leading-relaxed italic">Seleccione los parámetros académicos para desplegar el análisis de registros biométricos del día.</p>
                </div>
            )}
        </div>
    );
};

// Sub-componentes estilizados - Premium Refinement
const SummaryCard = ({ label, count, icon, color }: { label: string, count: number, icon: string, color: string }) => {
    const colors: Record<string, string> = {
        green: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/20',
        amber: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/5 dark:text-orange-400 dark:border-orange-500/20',
        red: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-400 dark:border-rose-500/20',
        slate: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50'
    };
    return (
        <div className={`p-8 rounded-[2.5rem] border-2 flex flex-col gap-5 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5 cursor-default ${colors[color]} group`}>
            <div className="flex justify-between items-center">
                <div className={`p-3 rounded-2xl bg-white/40 dark:bg-black/20 shadow-sm group-hover:scale-110 transition-transform`}>
                    <span className="material-icons-outlined text-3xl block">{icon}</span>
                </div>
                <span className="text-4xl lg:text-5xl font-black leading-none tracking-tighter">{count}</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 ml-1">{label}</p>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        PRESENT: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20',
        LATE: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-orange-500/20',
        ABSENT: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/20',
    };
    const labels: Record<string, string> = {
        PRESENT: 'Puntual',
        LATE: 'Tardanza',
        ABSENT: 'Falta',
    };
    return (
        <span className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm transition-transform hover:scale-105 select-none ${styles[status] || styles.ABSENT}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current`}></span>
            {labels[status] || 'Pendiente'}
        </span>
    );
};

export default DailyAttendanceTab;
