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
        blue: { bg: 'bg-blue-500/10', icon: 'text-blue-600', border: 'border-blue-100/50' },
        indigo: { bg: 'bg-indigo-500/10', icon: 'text-indigo-600', border: 'border-indigo-100/50' },
        green: { bg: 'bg-green-500/10', icon: 'text-green-600', border: 'border-green-100/50' },
        amber: { bg: 'bg-amber-500/10', icon: 'text-amber-600', border: 'border-amber-100/50' },
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border ${colorConfig[color].border} dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none relative group`}
        >
            <div className={`w-14 h-14 ${colorConfig[color].bg} ${colorConfig[color].icon} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                <span className="material-icons-outlined text-3xl">{icon}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-none mb-3 tracking-tighter">{value}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase italic opacity-70 group-hover:opacity-100 transition-opacity">
                {subValue}
            </p>
        </motion.div>
    );
};

export default MetricCard;
