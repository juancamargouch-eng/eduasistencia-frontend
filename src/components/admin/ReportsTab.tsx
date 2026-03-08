import React from 'react';

interface ReportsTabProps {
    reportDateFrom: string;
    setReportDateFrom: (val: string) => void;
    reportDateTo: string;
    setReportDateTo: (val: string) => void;
    reportGrade: string;
    setReportGrade: (val: string) => void;
    reportSection: string;
    setReportSection: (val: string) => void;
    grades: string[];
    sections: string[];
    onExport: () => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({
    reportDateFrom, setReportDateFrom,
    reportDateTo, setReportDateTo,
    reportGrade, setReportGrade,
    reportSection, setReportSection,
    grades, sections,
    onExport
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-6">Generar Reporte de Asistencia</h3>
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Desde</label>
                        <input type="date" className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value={reportDateFrom} onChange={e => setReportDateFrom(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Hasta</label>
                        <input type="date" className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value={reportDateTo} onChange={e => setReportDateTo(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Grado (Opcional)</label>
                        <select className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value={reportGrade} onChange={e => setReportGrade(e.target.value)}>
                            <option value="">Todos</option>
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Sección (Opcional)</label>
                        <select className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value={reportSection} onChange={e => setReportSection(e.target.value)}>
                            <option value="">Todas</option>
                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={onExport} className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                    <span className="material-icons-outlined">download</span> Descargar Excel (.xlsx)
                </button>
            </div>
        </div>
    );
};

export default ReportsTab;
