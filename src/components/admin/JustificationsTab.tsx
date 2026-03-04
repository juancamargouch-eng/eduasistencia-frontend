import React from 'react';
import type { Student, Justification } from '../../services/api';

export interface Absense {
    date: string;
    day_name: string;
    status: string;
}

interface JustificationsTabProps {
    justificationStudentId: string;
    setJustificationStudentId: (val: string) => void;
    isLoadingAbsences: boolean;
    justificationStudentData: Student | null;
    absences: Absense[];
    justifications: Justification[];
    onSearchAbsences: () => void;
    onJustify: (date: string) => void;
}

const JustificationsTab: React.FC<JustificationsTabProps> = ({
    justificationStudentId, setJustificationStudentId,
    isLoadingAbsences,
    justificationStudentData,
    absences,
    justifications,
    onSearchAbsences,
    onJustify
}) => {
    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Registrar Justificación</h3>
                <div className="flex flex-col md:flex-row gap-4 md:items-end">
                    <div className="flex-1 max-w-xs">
                        <label className="block text-sm font-medium mb-1">DNI del Alumno</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={justificationStudentId}
                                onChange={e => setJustificationStudentId(e.target.value.replace(/\D/g, ''))}
                                maxLength={8}
                                placeholder="Ingrese DNI"
                                className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                            />
                            <button
                                onClick={onSearchAbsences}
                                disabled={isLoadingAbsences || justificationStudentId.length < 8}
                                className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                            >
                                <span className={`material-icons-outlined ${isLoadingAbsences ? 'animate-spin' : ''}`}>
                                    {isLoadingAbsences ? 'refresh' : 'search'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {justificationStudentData && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                {justificationStudentData.photo_url ? (
                                    <img src={justificationStudentData.photo_url} alt="Student" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-icons text-slate-400">person</span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold truncate max-w-[200px]">{justificationStudentData.full_name}</p>
                                <p className="text-xs text-slate-500">{justificationStudentData.grade} "{justificationStudentData.section}" | {justificationStudentData.schedule?.name || 'Sin Turno'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    {absences.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {absences.map((abs, idx) => (
                                <div key={idx} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                                            <span className="material-icons-outlined">event_busy</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm capitalize">{abs.day_name}</p>
                                            <p className="text-xs text-slate-500">{abs.date}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onJustify(abs.date)}
                                        className="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-sm font-medium"
                                    >
                                        Justificar
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        justificationStudentId.length >= 8 && !isLoadingAbsences && (
                            <div className="text-center py-8 text-slate-500">No hay faltas recientes para justificar.</div>
                        )
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase">
                        <tr>
                            <th className="px-6 py-4">Estudiante</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Motivo</th>
                            <th className="px-6 py-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {justifications.map(j => (
                            <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{j.student?.full_name || 'Desconocido'}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{j.date}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{j.reason}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${j.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        j.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {j.status === 'APPROVED' ? 'APROBADO' : j.status === 'REJECTED' ? 'RECHAZADO' : 'PENDIENTE'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JustificationsTab;
