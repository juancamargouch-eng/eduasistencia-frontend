import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export interface DailyStats {
    date: string;
    present: number;
    late: number;
}

interface AttendanceChartProps {
    data: DailyStats[];
    width: number;
    loading: boolean;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data, width, loading }) => {
    return (
        <div className="min-h-[400px] w-full relative" style={{ minHeight: '400px' }}>
            {(loading || width === 0) ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] animate-pulse">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Generando Análisis Vital...</span>
                </div>
            ) : (
                <div className="absolute inset-0">
                    <AreaChart
                        width={width}
                        height={400}
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(200,200,200,0.15)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '15px' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="present"
                            name="Asistencia"
                            stroke="#6366f1"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorPresent)"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="late"
                            name="Tardanza"
                            stroke="#fb923c"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorLate)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </div>
            )}
        </div>
    );
};

export default AttendanceChart;
