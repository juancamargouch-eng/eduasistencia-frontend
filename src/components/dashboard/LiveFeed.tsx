import React from 'react';
import { validateAttendanceLog, getStudentPhotoUrl } from '../../services/api';

interface AttendanceLog {
    id: number;
    timestamp: string;
    student_id: number;
    verification_status: boolean;
    confidence_score: number;
    failure_reason?: string;
    event_type?: string;
    student?: {
        full_name: string;
        photo_url?: string;
    };
}

interface LiveFeedProps {
    logs: AttendanceLog[];
    onRefresh: () => void;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ logs, onRefresh }) => {

    const handleResolve = async (id: number) => {
        if (!confirm("¿Confirmas que viste al alumno y quieres validar este ingreso manualmente?")) return;
        try {
            await validateAttendanceLog(id);
            onRefresh();
        } catch (error) {
            console.error("Error validating log", error);
            alert("No se pudo validar el registro.");
        }
    };

    return (
        <div className="space-y-4">
            {logs.slice(0, 5).map((log) => (
                <div
                    key={log.id}
                    className={`relative overflow-hidden rounded-xl border-l-4 p-4 shadow-sm transition-all hover:translate-x-1 ${log.verification_status
                        ? 'bg-white dark:bg-slate-900 border-l-green-500 border-y border-r border-slate-200 dark:border-slate-800'
                        : 'bg-red-50 dark:bg-red-900/10 border-l-red-500 border-y border-r border-red-100 dark:border-red-900/30'
                        }`}
                >
                    <div className="flex gap-4">
                        {/* Photo */}
                        <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden relative">
                            {log.student?.photo_url ? (
                                <img
                                    src={getStudentPhotoUrl(log.student.photo_url) || ''}
                                    className="w-full h-full object-cover"
                                    alt="Student"
                                    onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=?'}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-icons-outlined text-slate-400">person</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white truncate">
                                        {log.student?.full_name || 'Desconocido'}
                                    </h4>
                                    <p className="text-xs text-slate-500 mb-1">
                                        {new Date(log.timestamp).toLocaleTimeString()} &middot; ID: #{log.student_id}
                                    </p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${log.event_type === 'EXIT' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {log.event_type === 'EXIT' ? 'Salida' : 'Entrada'}
                                </span>
                            </div>

                            {log.verification_status ? (
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                                    <span className="material-icons-outlined text-base">check_circle</span>
                                    <span>Verificado ({(log.confidence_score * 100).toFixed(0)}%)</span>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-medium">
                                        <span className="material-icons-outlined text-base">error</span>
                                        <span>{log.failure_reason || "Fallo de Verificación"}</span>
                                    </div>
                                    <button
                                        onClick={() => handleResolve(log.id)}
                                        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-icons-outlined text-sm">thumb_up</span>
                                        Validar Manualmente
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LiveFeed;
