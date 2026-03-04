import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: string;
    error?: string;
    'font-mono'?: boolean;
}

const Input: React.FC<InputProps> = ({ label, icon, error, className = '', ...rest }) => {
    // Separate custom props from native input props
    const { 'font-mono': fontMonoProp, ...props } = rest;
    const isFontMono = fontMonoProp === true || className.includes('font-mono');

    return (
        <div className="space-y-2 w-full">
            {label && <label className="text-sm font-semibold">{label}</label>}
            <div className="relative">
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons-outlined text-slate-400">
                        {icon}
                    </span>
                )}
                <input
                    className={`w-full ${icon ? 'pl-11' : 'px-4'} py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 transition-all ${error ? 'ring-2 ring-red-500' : ''} ${isFontMono ? 'font-mono' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
