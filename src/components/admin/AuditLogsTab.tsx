import React from 'react';
import { useAuditLogs } from '../../hooks/tabs/useAuditLogs';

const AuditLogsTab: React.FC = () => {
    const { logs, loading, filters, setFilters, refresh } = useAuditLogs();

    const getActionColor = (action: string) => {
        if (action.includes('CREATE')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (action.includes('UPDATE')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        if (action.includes('DELETE')) return 'bg-red-500/10 text-red-500 border-red-500/20';
        if (action.includes('LOGIN')) return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header / Filtros */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 lg:p-10 rounded-[3.5rem] border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 rotate-3">
                            <span className="material-icons-outlined text-3xl">history_edu</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">Auditoría del Sistema</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Registro en tiempo real de operaciones
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input 
                                type="text"
                                placeholder="Buscar por usuario o acción..."
                                className="pl-12 pr-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-xs min-w-[300px]"
                                value={filters.search}
                                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                            />
                        </div>
                        
                        <button 
                            onClick={refresh}
                            disabled={loading}
                            className={`p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-slate-400 hover:text-primary transition-all active:scale-90 ${loading ? 'animate-spin' : ''}`}
                        >
                            <span className="material-icons">refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Listado de Logs */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/50 dark:border-slate-800 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Fecha / Hora</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Usuario</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Acción</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Descripción</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Origen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="font-black text-[10px] uppercase tracking-[0.3em]">Sincronizando registros...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <span className="material-icons text-6xl">visibility_off</span>
                                            <p className="font-black text-[10px] uppercase tracking-[0.3em]">No se encontraron registros</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="group hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900 dark:text-white">
                                                    {new Date(log.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {new Date(log.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-primary">
                                                    {log.username.substring(0,2).toUpperCase()}
                                                </div>
                                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{log.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.15em] border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                                                {log.description}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    <span className="material-icons text-xs">tap_and_play</span>
                                                    {log.ip_address}
                                                </div>
                                                <p className="text-[8px] font-bold text-slate-400 truncate max-w-[150px] mt-1" title={log.user_agent}>
                                                    {log.user_agent}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogsTab;
