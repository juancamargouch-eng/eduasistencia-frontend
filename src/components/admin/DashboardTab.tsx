import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getMonthlyStats, type AttendanceLog } from '../../services/api';

// Sub-componentes refactorizados
import MetricCard from './dashboard/MetricCard';
import AttendanceChart, { type DailyStats } from './dashboard/AttendanceChart';
import GradeBarChart, { type GradeStats } from './dashboard/GradeBarChart';
import LatestLogSummary from './dashboard/LatestLogSummary';

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
    occupancy: { entries: number; exits: number; current_occupancy: number };
    onRefresh: () => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ logs, occupancy }) => {
    const [stats, setStats] = useState<MonthlyStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [areaWidth, setAreaWidth] = useState(0);
    const [barWidth, setBarWidth] = useState(0);

    const areaRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                if (width > 0) {
                    if (entry.target === areaRef.current) setAreaWidth(width);
                    if (entry.target === barRef.current) setBarWidth(width);
                }
            }
        });
        if (areaRef.current) observer.observe(areaRef.current);
        if (barRef.current) observer.observe(barRef.current);
        return () => observer.disconnect();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Panel de Control</h1>
                    <p className="text-slate-500 font-medium italic mt-1">Análisis inteligente del rendimiento institucional</p>
                </div>
                <div className="px-5 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Estado del Sistema</span>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sincronizado</span>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon="login" label="Accesos Hoy" value={logs.length} subValue={`${occupancy.entries} totales`} color="blue" delay={0} />
                <MetricCard icon="meeting_room" label="En Campus" value={occupancy.current_occupancy} subValue="Aforo actual" color="indigo" delay={0.1} />
                <MetricCard icon="assignment_turned_in" label="Puntualidad" value={stats?.summary.avg_punctuality ? `${stats.summary.avg_punctuality}%` : '--'} subValue="Promedio mensual" color="green" delay={0.2} />
                <MetricCard icon="trending_up" label="Tendencia" value={stats?.summary.trend || '--'} subValue="Rendimiento" color="amber" delay={0.3} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                            <span className="material-icons-outlined text-indigo-500">show_chart</span>Tendencia
                        </h3>
                    </div>
                    <div ref={areaRef}><AttendanceChart data={stats?.daily || []} width={areaWidth} loading={loading} /></div>
                </div>

                <div className="xl:col-span-4 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3 mb-10">
                        <span className="material-icons-outlined text-green-500">bar_chart</span>Por Grado
                    </h3>
                    <div ref={barRef}><GradeBarChart data={stats?.grades || []} width={barWidth} loading={loading} /></div>
                </div>
            </div>

            <LatestLogSummary logs={logs} />
        </motion.div>
    );
};

export default DashboardTab;
