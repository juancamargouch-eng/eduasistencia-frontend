import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'red' | 'green' | 'amber' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    loading?: boolean; // Soporte para ambos nombres
    fullWidth?: boolean;
    icon?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loading = false,
    fullWidth = false,
    icon,
    className = '',
    ...props
}) => {
    const isBtnLoading = isLoading || loading;
    const baseStyles = `inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''}`;

    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200",
        red: "bg-red-500 text-white shadow-lg shadow-red-200 dark:shadow-none hover:bg-red-600",
        green: "bg-green-500 text-white shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-600",
        amber: "bg-amber-100 text-amber-600 hover:bg-amber-200",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isBtnLoading || props.disabled}
            {...props}
        >
            {isBtnLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : icon ? (
                <span className="material-icons-outlined text-xl">{icon}</span>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
