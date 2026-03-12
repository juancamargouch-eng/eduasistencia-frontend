import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
    icon: string;
    label: string;
    value: string | number;
    subValue: string;
    color: 'blue' | 'indigo' | 'green' | 'amber';
    delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subValue, color, delay }) => {
    const variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { delay, duration: 0.5 } }
    };

    const colorConfig = {
        blue: { bg: 'bg-primary/10', icon: 'text-primary', border: 'border-primary/20' },
        indigo: { bg: 'bg-primary/5', icon: 'text-primary/70', border: 'border-primary/10' },
        green: { bg: 'bg-green-500/10', icon: 'text-green-600', border: 'border-green-100/50' },
        amber: { bg: 'bg-amber-500/10', icon: 'text-amber-600', border: 'border-amber-100/50' },
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border ${colorConfig[color].border} dark:border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none transition-all hover:shadow-2xl hover:bg-white/60 dark:hover:bg-slate-900/60 relative group`}
        >
            <div className={`w-14 h-14 ${colorConfig[color].bg} ${colorConfig[color].icon} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-inner`}>
                <span className="material-icons-outlined text-3xl">{icon}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</p>
            <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-none mb-3 tracking-tighter">{value}</h3>
            <div className="flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${colorConfig[color].icon} animate-pulse`}></span>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                    {subValue}
                </p>
            </div>
        </motion.div>
    );
};

export default MetricCard;
