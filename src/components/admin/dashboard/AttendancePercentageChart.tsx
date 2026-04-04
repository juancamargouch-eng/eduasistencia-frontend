import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMeasure } from '../../../hooks/useMeasure';
import { type AttendancePercentageData } from '../../../services/api';

interface AttendancePercentageChartProps {
    data: AttendancePercentageData | null;
    period: 'day' | 'week' | 'month';
    onPeriodChange: (p: 'day' | 'week' | 'month') => void;
    loading: boolean;
}

const AttendancePercentageChart: React.FC<AttendancePercentageChartProps> = ({ data, period, onPeriodChange, loading }) => {
    const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

    const chartData = [
        { name: 'Puntual', value: data?.present || 0, color: '#e10521' }, // EduAsistencia Primary Red
        { name: 'Tardanza', value: data?.late || 0, color: '#fb923c' },   // Orange
        { name: 'Falta', value: data?.absent || 0, color: '#64748b' }     // Slate
    ];

    const hasData = (data?.total_expected || 0) > 0;

    return (
        <div className="w-full h-full flex flex-col group relative">
            {/* Header y Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mb-8 z-10 px-6 pt-6">
                <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
                        <span className="material-icons-outlined text-primary bg-primary/10 p-2 rounded-[1rem]">pie_chart</span>
                        Tasa de Asistencia
                    </h3>
                    <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Estrictamente Mes Actual</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-[1.2rem] shadow-inner self-start">
                    {(['day', 'week', 'month'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => onPeriodChange(p)}
                            disabled={loading}
                            className={`px-4 xl:px-6 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                period === p
                                    ? 'bg-white dark:bg-slate-700 text-primary shadow-lg scale-100 ring-1 ring-slate-200 dark:ring-slate-600'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 scale-95 opacity-70 hover:opacity-100 cursor-pointer'
                            }`}
                        >
                            {p === 'day' ? 'Hoy' : p === 'week' ? 'Semana' : 'Mes'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grafico */}
            <div ref={containerRef} className="flex-1 min-h-[250px] relative mt-2 w-full pb-6">
                {loading || width === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Calculando Proporciones...</span>
                    </div>
                ) : !hasData ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-60">
                        <span className="material-icons-outlined text-4xl text-slate-300 dark:text-slate-600">event_busy</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Sin días<br/>laborables validos</span>
                    </div>
                ) : (
                    <div className="absolute inset-0 w-full h-full">
                        <ResponsiveContainer width={width > 0 ? width : '100%'} height={height > 0 ? height : '100%'}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={height > 300 ? 90 : 60}
                                    outerRadius={height > 300 ? 120 : 85}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    animationDuration={1000}
                                    animationEasing="ease"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 10px 15px ${entry.color}40)` }} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number | string | undefined) => [`${value ?? 0}%`, '']}
                                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '15px' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
            
            {/* Background Glow Opcional */}
            {hasData && !loading && (
                <div 
                    className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-[0.02] mix-blend-overlay transition-opacity duration-1000"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${chartData.reduce((prev, curr) => curr.value > prev.value ? curr : prev).color}, transparent 70%)` }}
                />
            )}
        </div>
    );
};

export default AttendancePercentageChart;
