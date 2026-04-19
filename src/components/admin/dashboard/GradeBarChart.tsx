import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useMeasure } from '../../../hooks/useMeasure';

export interface GradeStats {
    name: string;
    present: number;
    late: number;
}

interface GradeBarChartProps {
    data: GradeStats[];
    loading: boolean;
}

const CustomGradeTooltip = ({ active, payload, label }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white dark:border-slate-800 shadow-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                <div className="space-y-1">
                    {payload.map((entry: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                        <div key={index} className="flex items-center justify-between gap-4">
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{entry.name}:</span>
                            <span className="text-[11px] font-black text-slate-900 dark:text-white">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const GradeBarChart: React.FC<GradeBarChartProps> = ({ data, loading }) => {
    const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

    return (
        <div ref={containerRef} className="w-full h-full min-w-0 relative">
            {loading || width === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2.5rem] animate-pulse">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Procesando...</span>
                </div>
            ) : (
                <div className="w-full h-full">
                    <BarChart
                        width={width}
                        height={height}
                        data={data}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                        barGap={8}
                    >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(200,200,200,0.1)" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                width={70}
                                tick={{ fontSize: 10, fontStyle: 'normal', fontWeight: 900, fill: '#64748b' }}
                            />
                            <Tooltip content={<CustomGradeTooltip />} cursor={{ fill: 'rgba(225,5,33,0.03)' }} />
                            <Bar dataKey="present" name="Puntual" radius={[0, 10, 10, 0]} barSize={8}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill="#e10521" fillOpacity={0.9} />
                                ))}
                            </Bar>
                            <Bar dataKey="late" name="Tardanza" radius={[0, 10, 10, 0]} barSize={8}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-late-${index}`} fill="#fb923c" fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                </div>
            )}
        </div>
    );
};

export default GradeBarChart;
