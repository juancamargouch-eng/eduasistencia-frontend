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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-primary rounded-[3rem] p-8 lg:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_30px_60px_-15px_rgba(225,5,33,0.3)] border border-white/10 relative overflow-hidden group"
            >
                {/* Decorative glow */}
                <div className="absolute -top-1/2 -left-1/4 w-full h-[200%] bg-white/5 rounded-full blur-3xl pointer-events-none rotate-12" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />

                <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                    <div className="w-20 h-20 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <span className="material-icons-outlined text-5xl">history</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200/60 mb-2">Último Movimiento</p>
                        <h4 className="text-2xl lg:text-3xl font-black tracking-tighter leading-none mb-2 select-none">
                            {logs[0].student?.full_name?.split(' ')[0]} <span className="opacity-40">{logs[0].student?.full_name?.split(' ').slice(1).join(' ')}</span>
                        </h4>
                        <div className="flex items-center gap-3">
                            <span className="material-icons text-sm opacity-50">schedule</span>
                            <p className="text-indigo-50/80 font-black text-xs uppercase tracking-widest">
                                {new Date(logs[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-10 relative z-10 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200/60 mb-1">Confianza</p>
                        <p className="text-2xl font-black">{(logs[0].confidence_score * 100).toFixed(0)}<span className="text-sm opacity-50 ml-0.5">%</span></p>
                    </div>
                    
                    <div className="w-[1px] h-12 bg-white/20 hidden md:block"></div>
                    
                    <div className="text-right sm:text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200/60 mb-2">Estado</p>
                        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                            logs[0].status === 'LATE' 
                            ? 'bg-orange-500 shadow-orange-500/20' 
                            : 'bg-emerald-500 shadow-emerald-500/20'
                        }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            {logs[0].status === 'LATE' ? 'Tardanza' : 'Puntual'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LatestLogSummary;
