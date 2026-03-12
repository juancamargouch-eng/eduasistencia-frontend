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

const GradeBarChart: React.FC<GradeBarChartProps> = ({ data, loading }) => {
    const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

    return (
        <div ref={containerRef} className="w-full h-full min-w-0 relative">
            {loading || width === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] animate-pulse">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Calculando...</span>
                </div>
            ) : (
                <div className="w-full h-full">
                    <BarChart
                        width={width}
                        height={height}
                        data={data}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                    >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(200,200,200,0.1)" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                width={80}
                                tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(225,5,33,0.05)' }}
                                contentStyle={{ borderRadius: '1rem', border: 'none' }}
                            />
                            <Bar dataKey="present" name="Puntual" radius={[0, 6, 6, 0]} barSize={10}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill="#e10521" />
                                ))}
                            </Bar>
                            <Bar dataKey="late" name="Tardanza" radius={[0, 6, 6, 0]} barSize={10}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-late-${index}`} fill="#fb923c" />
                                ))}
                            </Bar>
                        </BarChart>
                </div>
            )}
        </div>
    );
};

export default GradeBarChart;
