import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type AttendanceLog } from '../../../services/api';

interface LatestLogSummaryProps {
    logs: AttendanceLog[];
}

const LatestLogSummary: React.FC<LatestLogSummaryProps> = ({ logs }) => {
    if (logs.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-500/40 border border-indigo-400/30"
            >
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <span className="material-icons-outlined text-4xl">history</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight leading-none mb-1">Último Registro</h4>
                        <p className="text-indigo-100/80 font-bold text-sm">
                            {logs[0].student?.full_name} — {new Date(logs[0].timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase opacity-60">Confianza</p>
                        <p className="text-lg font-black">{(logs[0].confidence_score * 100).toFixed(0)}%</p>
                    </div>
                    <div className="w-[1px] h-10 bg-white/20"></div>
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase opacity-60">Status</p>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${logs[0].status === 'LATE' ? 'bg-orange-500' : 'bg-green-500'}`}>
                            {logs[0].status === 'LATE' ? 'Tardanza' : 'Puntual'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LatestLogSummary;
