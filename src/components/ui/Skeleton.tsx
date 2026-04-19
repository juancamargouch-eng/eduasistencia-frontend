import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
    return (
        <div 
            className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`}
        />
    );
};

export const CardSkeleton = () => (
    <div className="bg-white/60 dark:bg-slate-900/60 p-6 rounded-[2rem] border border-white dark:border-slate-800 shadow-xl space-y-4">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="pt-4 flex gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
    </div>
);

export const ListSkeleton = ({ count = 5 }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/30 dark:bg-slate-900/30 rounded-2xl border border-white/50 dark:border-slate-800">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-2 w-1/4 opacity-50" />
                </div>
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
        ))}
    </div>
);
