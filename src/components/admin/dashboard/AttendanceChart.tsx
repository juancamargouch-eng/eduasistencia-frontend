import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useMeasure } from '../../../hooks/useMeasure';

export interface DailyStats {
    date: string;
    present: number;
    late: number;
}

interface AttendanceChartProps {
    data: DailyStats[];
    loading: boolean;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data, loading }) => {
    const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

    return (
        <div ref={containerRef} className="w-full h-full min-w-0 relative">
            {loading || width === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] animate-pulse">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Generando Análisis Vital...</span>
                </div>
            ) : (
                <div className="w-full h-full">
                    <AreaChart
                        width={width}
                        height={height}
                        data={data}
                        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                    >
                            <defs>
                                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e10521" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#e10521" stopOpacity={0} />
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
                                tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }}
                                dy={10}
                                interval="preserveStartEnd"
                                minTickGap={30}
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
                                stroke="#e10521"
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
