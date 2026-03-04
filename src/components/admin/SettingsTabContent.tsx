import React from 'react';
import { type Schedule } from '../../services/api';

interface SettingsTabProps {
    newScheduleName: string;
    setNewScheduleName: (val: string) => void;
    newScheduleStart: string;
    setNewScheduleStart: (val: string) => void;
    newScheduleTolerance: string;
    setNewScheduleTolerance: (val: string) => void;
    schedules: Schedule[];
    onCreateSchedule: (e: React.FormEvent) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
    newScheduleName, setNewScheduleName,
    newScheduleStart, setNewScheduleStart,
    newScheduleTolerance, setNewScheduleTolerance,
    schedules,
    onCreateSchedule
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Gestión de Horarios</h3>
                <form onSubmit={onCreateSchedule} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre del Horario (ej: Mañana)</label>
                        <input className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={newScheduleName} onChange={e => setNewScheduleName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hora de Entrada</label>
                        <input type="time" className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={newScheduleStart} onChange={e => setNewScheduleStart(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tolerancia (minutos)</label>
                        <input type="number" className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={newScheduleTolerance} onChange={e => setNewScheduleTolerance(e.target.value)} required />
                    </div>
                    <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-medium">Crear Horario</button>
                </form>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Horarios Existentes</h3>
                <div className="space-y-3">
                    {schedules.map(s => (
                        <div key={s.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold">{s.name}</p>
                                <p className="text-xs text-slate-500">{s.start_time} (Tol: {s.tolerance_minutes}m)</p>
                            </div>
                            <span className="material-icons-outlined text-slate-400">schedule</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
