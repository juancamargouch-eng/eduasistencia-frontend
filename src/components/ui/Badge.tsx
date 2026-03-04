import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'neutral';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
    const variants = {
        success: "bg-green-100 text-green-600",
        warning: "bg-amber-100 text-amber-600",
        error: "bg-red-100 text-red-600",
        neutral: "bg-slate-100 text-slate-500"
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}>
            {children}
        </span>
    );
};

export default Badge;
