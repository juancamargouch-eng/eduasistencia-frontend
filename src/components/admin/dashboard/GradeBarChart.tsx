import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export interface GradeStats {
    name: string;
    present: number;
    late: number;
}

interface GradeBarChartProps {
    data: GradeStats[];
    width: number;
    loading: boolean;
}

const GradeBarChart: React.FC<GradeBarChartProps> = ({ data, width, loading }) => {
    return (
        <div className="min-h-[400px] w-full relative" style={{ minHeight: '400px' }}>
            {(loading || width === 0) ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] animate-pulse">
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Calculando...</span>
                </div>
            ) : (
                <div className="absolute inset-0">
                    <BarChart
                        width={width}
                        height={400}
                        data={data}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
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
                            cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                            contentStyle={{ borderRadius: '1rem', border: 'none' }}
                        />
                        <Bar dataKey="present" name="Puntual" radius={[0, 6, 6, 0]} barSize={10}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill="#6366f1" />
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
