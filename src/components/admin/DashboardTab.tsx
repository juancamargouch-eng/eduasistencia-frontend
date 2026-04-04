import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getMonthlyStats, type AttendanceLog } from '../../services/api';

// Sub-componentes refactorizados
import MetricCard from './dashboard/MetricCard';
import AttendanceChart, { type DailyStats } from './dashboard/AttendanceChart';
import GradeBarChart, { type GradeStats } from './dashboard/GradeBarChart';
import AttendancePercentageChart from './dashboard/AttendancePercentageChart';
import LatestLogSummary from './dashboard/LatestLogSummary';
import { type AttendancePercentageData } from '../../services/api';

interface MonthlyStats {
    daily: DailyStats[];
    grades: GradeStats[];
    summary: {
        total_days: number;
        avg_punctuality: number;
        trend: string;
    };
}

interface DashboardTabProps {
    logs: AttendanceLog[];
    occupancy: { total_entries: number; total_exits: number; current_count: number };
    onRefresh: () => void;
    percentageData: AttendancePercentageData | null;
    percentagePeriod: 'day' | 'week' | 'month';
    setPercentagePeriod: (p: 'day' | 'week' | 'month') => void;
    loadingPerc: boolean;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ 
    logs, occupancy,
    percentageData, percentagePeriod, setPercentagePeriod, loadingPerc
}) => {
    const [stats, setStats] = useState<MonthlyStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCharts, setShowCharts] = useState(false);

    const areaRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowCharts(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getMonthlyStats();
                setStats(data);
            } catch (err) {
                console.error("Error fetching stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter select-none">Panel VerifID</h1>
                    <p className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-primary"></span>
                        Gestión Biométrica Centralizada
                    </p>
                </div>
                <div className="hidden xs:block px-6 py-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">Estado en Tiempo Real</span>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">Vincular Activo</span>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard icon="login" label="Ingresos Hoy" value={logs.length} subValue={`${occupancy.total_entries} Registrados`} color="blue" delay={0} />
                <MetricCard icon="meeting_room" label="Aforo Actual" value={occupancy.current_count} subValue="Estudiantes en campus" color="indigo" delay={0.1} />
                <MetricCard icon="assignment_turned_in" label="Puntualidad" value={stats?.summary.avg_punctuality ? `${stats.summary.avg_punctuality}%` : '--'} subValue="Promedio del Mes" color="green" delay={0.2} />
                <MetricCard icon="trending_up" label="Rendimiento" value={stats?.summary.trend || '--'} subValue="Tendencia de Asistencia" color="amber" delay={0.3} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-10">
                <div className="xl:col-span-8 min-w-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] p-8 sm:p-12 border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2">Visualización de Datos</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter">
                                <span className="material-icons-outlined text-primary bg-primary/10 p-2 rounded-xl">show_chart</span>
                                Tendencia Diaria
                            </h3>
                        </div>
                    </div>
                    <div ref={areaRef} className="h-[350px] sm:h-[400px] min-w-0 relative">
                        {showCharts && <AttendanceChart data={stats?.daily || []} loading={loading} />}
                    </div>
                </div>

                <div className="xl:col-span-4 min-w-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] p-8 sm:p-12 border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group">
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2">Desglose Académico</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter mb-12">
                        <span className="material-icons-outlined text-primary bg-primary/10 p-2 rounded-xl">bar_chart</span>
                        Por Grado
                    </h3>
                    <div ref={barRef} className="h-[350px] sm:h-[400px] min-w-0 relative">
                        {showCharts && <GradeBarChart data={stats?.grades || []} loading={loading} />}
                    </div>
                </div>

                {/* Pie Chart: Porcentajes de Asistencia */}
                <div className="xl:col-span-5 min-w-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group overflow-hidden">
                    {showCharts && <AttendancePercentageChart data={percentageData} period={percentagePeriod} onPeriodChange={setPercentagePeriod} loading={loadingPerc} />}
                </div>
            </div>

            <LatestLogSummary logs={logs} />
        </motion.div>
    );
};

export default DashboardTab;
