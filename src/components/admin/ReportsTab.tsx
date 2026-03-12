import React from 'react';
import { type Schedule } from '../../services/api';

interface ReportsTabProps {
    reportDateFrom: string;
    setReportDateFrom: (val: string) => void;
    reportDateTo: string;
    setReportDateTo: (val: string) => void;
    reportGrade: string;
    setReportGrade: (val: string) => void;
    reportSection: string;
    setReportSection: (val: string) => void;
    reportSearch: string;
    setReportSearch: (val: string) => void;
    reportStatus: string;
    setReportStatus: (val: string) => void;
    reportScheduleId: string | number;
    setReportScheduleId: (val: string | number) => void;
    grades: string[];
    sections: string[];
    schedules: Schedule[];
    onExport: () => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({
    reportDateFrom, setReportDateFrom,
    reportDateTo, setReportDateTo,
    reportGrade, setReportGrade,
    reportSection, setReportSection,
    reportSearch, setReportSearch,
    reportStatus, setReportStatus,
    reportScheduleId, setReportScheduleId,
    grades, sections, schedules,
    onExport
}) => {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 lg:p-14 rounded-[4rem] border border-white dark:border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] group relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                            <span className="material-icons-outlined text-4xl">analytics</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">VerifID Intelligence</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Generador de Reportes y Auditoría Avanzada</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Search Bar */}
                        <div className="space-y-3">
                            <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Buscar Estudiante (Nombre o DNI)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="EJ. JUAN PEREZ O 72839405..."
                                    className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-xs tracking-widest uppercase placeholder:text-slate-300 dark:placeholder:text-slate-600" 
                                    value={reportSearch} 
                                    onChange={e => setReportSearch(e.target.value)} 
                                />
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 material-icons text-slate-400">search</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Rango Inicial</label>
                                <input type="date" className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-sm tracking-widest" value={reportDateFrom} onChange={e => setReportDateFrom(e.target.value)} />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Rango Final</label>
                                <input type="date" className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-sm tracking-widest" value={reportDateTo} onChange={e => setReportDateTo(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Grado</label>
                                <div className="relative">
                                    <select className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" value={reportGrade} onChange={e => setReportGrade(e.target.value)}>
                                        <option value="">TODOS</option>
                                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Sección</label>
                                <div className="relative">
                                    <select className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" value={reportSection} onChange={e => setReportSection(e.target.value)}>
                                        <option value="">TODAS</option>
                                        {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Estado de Asistencia</label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" 
                                        value={reportStatus} 
                                        onChange={e => setReportStatus(e.target.value)}
                                    >
                                        <option value="">CUALQUIER ESTADO</option>
                                        <option value="PRESENT">PRESENTE (A TIEMPO)</option>
                                        <option value="LATE">TARDANZA</option>
                                        <option value="ABSENT">FALTA</option>
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">filter_list</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Filtrar por Turno (Opcional)</label>
                            <div className="relative">
                                <select 
                                    className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" 
                                    value={reportScheduleId} 
                                    onChange={e => setReportScheduleId(e.target.value)}
                                >
                                    <option value="">TODOS LOS TURNOS</option>
                                    {schedules.map(sch => (
                                        <option key={sch.id} value={sch.id}>{sch.name} ({sch.start_time} - {sch.end_time})</option>
                                    ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">schedule</span>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                onClick={onExport} 
                                className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-[0_25px_50px_-12px_rgba(225,5,33,0.4)] hover:shadow-[0_30px_60px_-12px_rgba(225,5,33,0.6)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                            >
                                <span className="material-icons-outlined text-2xl group-hover:animate-bounce">cloud_download</span>
                                GENERAR AUDITORÍA EXCEL (.XLSX)
                            </button>
                        </div>
                        
                        <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 opacity-40">VerifID Security Engine v4.0 • 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsTab;
