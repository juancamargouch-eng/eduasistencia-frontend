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
        <div className="space-y-6 pb-20">
            {/* Filtros Avanzados */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Grado</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/50 font-bold text-sm" value={dailyGrade} onChange={e => setDailyGrade(e.target.value)}>
                        <option value="">Seleccionar</option>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[100px]">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Sección</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/50 font-bold text-sm" value={dailySection} onChange={e => setDailySection(e.target.value)}>
                        <option value="">Seleccionar</option>
                        {sections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex-2 min-w-[180px]">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Turno / Horario</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/50 font-bold text-sm" value={dailyScheduleId} onChange={e => setDailyScheduleId(e.target.value)}>
                        <option value="">Todos los Turnos</option>
                        {schedules.map(sch => <option key={sch.id} value={sch.id}>{sch.name} ({sch.start_time})</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Fecha de Consulta</label>
                    <input type="date" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/50 font-mono font-bold text-sm" value={dailyDate} onChange={e => setDailyDate(e.target.value)} />
                </div>
            </div>

            {dailyLoading ? (
                <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-700">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Sincronizando Asistencia...</p>
                </div>
            ) : dailyStats ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Alertas de Día */}
                    {dailyStats.is_non_working_day && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-4 rounded-2xl flex items-center gap-4 text-amber-700 dark:text-amber-400">
                            <span className="material-icons-outlined">event_busy</span>
                            <span className="text-sm font-bold uppercase tracking-wide">Día no laborable: {dailyStats.holiday_name}</span>
                        </div>
                    )}

                    {/* Dashboard de Resumen */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <SummaryCard label="Presentes" count={dailyStats.summary.present} icon="check_circle" color="green" />
                        <SummaryCard label="Tardanzas" count={dailyStats.summary.late} icon="history" color="amber" />
                        <SummaryCard label="Faltas" count={dailyStats.summary.absent} icon="cancel" color="red" />
                        <SummaryCard label="Matrícula" count={dailyStats.summary.total} icon="groups" color="slate" />
                        <div className="col-span-2 lg:col-span-1 bg-primary p-6 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 flex flex-col justify-center">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Tasa de Asistencia</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black leading-none">{attendanceRate}%</span>
                                <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden mb-1">
                                    <div className="h-full bg-white transition-all duration-1000" style={{ width: `${attendanceRate}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Alumnos */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="py-6 px-8 rounded-tl-[2.5rem]">Alumno</th>
                                        <th className="py-6 px-4 text-center">Estado de Ingreso</th>
                                        <th className="py-6 px-8 text-right rounded-tr-[2.5rem]">Hora Exacta</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {dailyStats.students.length > 0 ? dailyStats.students.map((s) => (
                                        <tr key={s.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                                            <td className="py-4 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                                        {s.photo_url ? (
                                                            <img src={getStudentPhotoUrl(s.photo_url) || ''} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <span className="material-icons text-2xl">person</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-black text-slate-800 dark:text-slate-100 uppercase text-xs tracking-tight">{s.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <StatusBadge status={s.status} />
                                            </td>
                                            <td className="py-4 px-8 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className={`font-mono font-black text-sm ${s.entry_time ? 'text-primary' : 'text-slate-300'}`}>
                                                        {s.entry_time ? new Date(s.entry_time).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '--:--:--'}
                                                    </span>
                                                    {s.status === 'LATE' && <span className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">Retraso detectado</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No hay alumnos en este grupo</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800 text-slate-300">
                    <span className="material-icons-outlined text-6xl mb-6 opacity-20 rotate-12">fact_check</span>
                    <p className="font-black uppercase tracking-[0.3em] text-[10px]">Filtre para visualizar la asistencia</p>
                </div>
            )}
        </div>
    );
};

// Sub-componentes estilizados
const SummaryCard = ({ label, count, icon, color }: { label: string, count: number, icon: string, color: string }) => {
    const colors: Record<string, string> = {
        green: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:border-green-800/20',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/20',
        red: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:border-red-800/20',
        slate: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:border-slate-700/50'
    };
    return (
        <div className={`p-6 rounded-[2rem] border-2 flex flex-col gap-3 transition-all hover:scale-105 ${colors[color]}`}>
            <div className="flex justify-between items-start">
                <span className="material-icons-outlined text-3xl">{icon}</span>
                <span className="text-3xl font-black leading-none">{count}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</p>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        PRESENT: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        LATE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        ABSENT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels: Record<string, string> = {
        PRESENT: 'Presente',
        LATE: 'Tardanza',
        ABSENT: 'Falta',
    };
    return (
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border border-black/5 ${styles[status] || styles.ABSENT}`}>
            {labels[status] || 'Desconocido'}
        </span>
    );
};

export default DailyAttendanceTab;
