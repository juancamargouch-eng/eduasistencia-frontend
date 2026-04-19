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

const CustomTooltip = ({ active, payload, label }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-white dark:border-slate-800 shadow-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                        <div key={index} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{entry.name}</span>
                            </div>
                            <span className="text-xs font-black text-slate-900 dark:text-white">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data, loading }) => {
    const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

    return (
        <div ref={containerRef} className="w-full h-full min-w-0 relative">
            {loading || width === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2.5rem] animate-pulse">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sincronizando Tendencias...</span>
                </div>
            ) : (
                <div className="w-full h-full">
                    <AreaChart
                        width={width}
                        height={height}
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                            <defs>
                                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e10521" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#e10521" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.1)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }}
                                dy={15}
                                interval="preserveStartEnd"
                                minTickGap={30}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(225,5,33,0.1)', strokeWidth: 2 }} />
                            <Area
                                type="monotone"
                                dataKey="present"
                                name="Asistencias"
                                stroke="#e10521"
                                strokeWidth={4}
                                strokeLinecap="round"
                                fillOpacity={1}
                                fill="url(#colorPresent)"
                                animationDuration={2000}
                            />
                            <Area
                                type="monotone"
                                dataKey="late"
                                name="Tardanzas"
                                stroke="#fb923c"
                                strokeWidth={4}
                                strokeLinecap="round"
                                fillOpacity={1}
                                fill="url(#colorLate)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                </div>
            )}
        </div>
    );
};

export default AttendanceChart;
