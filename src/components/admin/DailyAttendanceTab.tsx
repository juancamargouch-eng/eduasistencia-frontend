import React from 'react';

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
        status: 'PRESENT' | 'LATE' | 'ABSENT' | string;
        entry_time?: string | null;
    }>;
}

interface DailyAttendanceTabProps {
    dailyGrade: string;
    setDailyGrade: (val: string) => void;
    dailySection: string;
    setDailySection: (val: string) => void;
    dailyDate: string;
    setDailyDate: (val: string) => void;
    dailyStats: DailyAttendanceResponse | null;
    dailyLoading: boolean;
    grades: string[];
    sections: string[];
}

const DailyAttendanceTab: React.FC<DailyAttendanceTabProps> = ({
    dailyGrade, setDailyGrade,
    dailySection, setDailySection,
    dailyDate, setDailyDate,
    dailyStats,
    dailyLoading,
    grades, sections
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Grado</label>
                    <select className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={dailyGrade} onChange={e => setDailyGrade(e.target.value)}>
                        <option value="">Seleccionar</option>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Sección</label>
                    <select className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={dailySection} onChange={e => setDailySection(e.target.value)}>
                        <option value="">Seleccionar</option>
                        {sections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Fecha</label>
                    <input type="date" className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={dailyDate} onChange={e => setDailyDate(e.target.value)} />
                </div>
            </div>

            {dailyLoading ? (
                <div className="text-center py-20"><span className="material-icons-outlined animate-spin text-4xl text-primary">refresh</span></div>
            ) : dailyStats ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 p-6">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <SummaryBox label="Presentes" count={dailyStats.summary.present} color="green" />
                        <SummaryBox label="Tardanzas" count={dailyStats.summary.late} color="yellow" />
                        <SummaryBox label="Faltas" count={dailyStats.summary.absent} color="red" />
                        <SummaryBox label="Total" count={dailyStats.summary.total} color="blue" />
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-xs uppercase border-b border-slate-100">
                                <th className="py-4">Alumno</th>
                                <th className="py-4">Estado</th>
                                <th className="py-4">Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyStats.students.map((s) => (
                                <tr key={s.id} className="border-b border-slate-50">
                                    <td className="py-4 font-medium">{s.full_name}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                                            s.status === 'LATE' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>{s.status}</span>
                                    </td>
                                    <td className="py-4 text-xs text-slate-500">{s.entry_time || '--:--'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-20 text-slate-400">Seleccione los filtros para ver la asistencia.</div>
            )}
        </div>
    );
};

interface SummaryBoxProps {
    label: string;
    count: number;
    color: 'green' | 'yellow' | 'red' | 'blue';
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ label, count, color }) => (
    <div className={`p-4 rounded-xl border ${color === 'green' ? 'bg-green-50 border-green-100 text-green-700' : color === 'yellow' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' : color === 'red' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
        <p className="text-xs font-bold uppercase mb-1">{label}</p>
        <p className="text-2xl font-black">{count}</p>
    </div>
);

export default DailyAttendanceTab;
