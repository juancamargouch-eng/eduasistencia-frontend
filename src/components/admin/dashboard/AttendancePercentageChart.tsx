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

const CustomPieTooltip = ({ active, payload }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (active && payload && payload.length) {
        const { name, value, payload: entry } = payload[0];
        return (
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white dark:border-slate-800 shadow-xl flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{name}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{value}%</span>
                </div>
            </div>
        );
    }
    return null;
};

const AttendancePercentageChart: React.FC<AttendancePercentageChartProps> = ({ data, period, onPeriodChange, loading }) => {
    const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

    const chartData = [
        { name: 'Puntual', value: data?.present || 0, color: '#e10521' },
        { name: 'Tardanza', value: data?.late || 0, color: '#fb923c' },
        { name: 'Falta', value: data?.absent || 0, color: '#64748b' }
    ];

    const hasData = (data?.total_expected || 0) > 0;
    const avgPunctuality = data?.present || 0;

    return (
        <div className="w-full h-full flex flex-col group relative overflow-hidden">
            {/* Header y Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mb-4 z-10 px-8 pt-8">
                <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
                        <span className="material-icons-outlined text-primary bg-primary/10 p-2.5 rounded-2xl">pie_chart</span>
                        Distribución
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Análisis de Puntualidad</p>
                </div>

                <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl shadow-inner-sm border border-white/20">
                    {(['day', 'week', 'month'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => onPeriodChange(p)}
                            disabled={loading}
                            className={`px-4 xl:px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                period === p
                                    ? 'bg-white dark:bg-slate-600 text-primary shadow-lg scale-100'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 scale-95 opacity-60'
                            }`}
                        >
                            {p === 'day' ? 'Hoy' : p === 'week' ? 'Semana' : 'Mes'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grafico */}
            <div ref={containerRef} className="flex-1 min-h-[300px] relative w-full mb-8">
                {loading || width === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Calculando...</span>
                    </div>
                ) : !hasData ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-60">
                        <span className="material-icons-outlined text-4xl text-slate-300 dark:text-slate-600">event_busy</span>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Sin actividad</span>
                    </div>
                ) : (
                    <div className="absolute inset-0 w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={height > 300 ? 90 : 70}
                                    outerRadius={height > 300 ? 125 : 100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 12px 20px ${entry.color}30)` }} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        
                        {/* Indicador Central Premium */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center group-hover:scale-110 transition-transform duration-500">
                            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{avgPunctuality}%</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.34em]">Puntualidad</span>
                        </div>
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
