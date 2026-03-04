import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    icon?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, description, icon }) => {
    return (
        <div className={`bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 ${className}`}>
            {(title || icon) && (
                <div className="flex items-center gap-4 mb-8">
                    {icon && (
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-icons-outlined text-3xl">{icon}</span>
                        </div>
                    )}
                    {title && (
                        <div>
                            <h2 className="text-2xl font-bold">{title}</h2>
                            {description && <p className="text-slate-500 text-sm">{description}</p>}
                        </div>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
