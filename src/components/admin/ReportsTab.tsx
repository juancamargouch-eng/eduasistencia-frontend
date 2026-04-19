import React from 'react';
import { type Schedule } from '../../services/api';
import { useReportsTab } from '../../hooks/tabs/useReportsTab';

interface ReportsTabProps {
    grades: string[];
    sections: string[];
    schedules: Schedule[];
}

const ReportsTab: React.FC<ReportsTabProps> = ({
    grades, sections, schedules
}) => {
    const { 
        reportFilters, setReportFilters, handleExportReport, 
        handleExportReportPDF, loading 
    } = useReportsTab();

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
                                    value={reportFilters.search} 
                                    onChange={e => setReportFilters(prev => ({ ...prev, search: e.target.value }))} 
                                />
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 material-icons text-slate-400">search</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Rango Inicial</label>
                                <input type="date" className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-sm tracking-widest" value={reportFilters.from} onChange={e => setReportFilters(prev => ({ ...prev, from: e.target.value }))} />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Rango Final</label>
                                <input type="date" className="w-full px-6 py-4 rounded-[2xl] bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-sm tracking-widest" value={reportFilters.to} onChange={e => setReportFilters(prev => ({ ...prev, to: e.target.value }))} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Grado</label>
                                <div className="relative">
                                    <select className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" value={reportFilters.grade} onChange={e => setReportFilters(prev => ({ ...prev, grade: e.target.value }))}>
                                        <option value="">TODOS</option>
                                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-400">Sección</label>
                                <div className="relative">
                                    <select className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" value={reportFilters.section} onChange={e => setReportFilters(prev => ({ ...prev, section: e.target.value }))}>
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
                                        value={reportFilters.status} 
                                        onChange={e => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
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
                                    value={reportFilters.scheduleId} 
                                    onChange={e => setReportFilters(prev => ({ ...prev, scheduleId: e.target.value }))}
                                >
                                    <option value="">TODOS LOS TURNOS</option>
                                    {schedules.map(sch => (
                                        <option key={sch.id} value={sch.id}>{sch.name} ({sch.start_time} - {sch.end_time})</option>
                                    ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons text-slate-400 pointer-events-none">schedule</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                            <button 
                                onClick={handleExportReport} 
                                disabled={loading}
                                className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-4 group ${
                                    loading 
                                        ? 'bg-slate-300 text-white/70 cursor-wait' 
                                        : 'bg-emerald-600 text-white shadow-[0_20px_40px_-12px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.5)] hover:-translate-y-1 active:scale-95'
                                }`}
                            >
                                <span className={`material-icons-outlined text-xl ${!loading && 'group-hover:animate-bounce'}`}>
                                    {loading ? 'hourglass_empty' : 'table_view'}
                                </span>
                                {loading ? 'ESPERE...' : 'EXCEL (.XLSX)'}
                            </button>

                            <button 
                                onClick={handleExportReportPDF} 
                                disabled={loading}
                                className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-4 group ${
                                    loading 
                                        ? 'bg-primary/50 text-white/70 cursor-wait' 
                                        : 'bg-primary text-white shadow-[0_20px_40px_-12px_rgba(225,5,33,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(225,5,33,0.5)] hover:-translate-y-1 active:scale-95'
                                }`}
                            >
                                <span className={`material-icons-outlined text-xl ${!loading && 'group-hover:animate-bounce'}`}>
                                    {loading ? 'hourglass_empty' : 'picture_as_pdf'}
                                </span>
                                {loading ? 'ESPERE...' : 'REPORTE PDF'}
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
