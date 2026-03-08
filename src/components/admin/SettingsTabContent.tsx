import React from 'react';
import { type Schedule } from '../../services/api';

interface SettingsTabProps {
    newScheduleName: string;
    setNewScheduleName: (val: string) => void;
    newScheduleStart: string;
    setNewScheduleStart: (val: string) => void;
    newScheduleEnd: string;
    setNewScheduleEnd: (val: string) => void;
    newScheduleTolerance: string;
    setNewScheduleTolerance: (val: string) => void;
    schedules: Schedule[];
    onCreateSchedule: (e: React.FormEvent) => void;
    editingScheduleId: number | null;
    onEditSchedule: (s: Schedule) => void;
    onCancelEdit: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
    newScheduleName, setNewScheduleName,
    newScheduleStart, setNewScheduleStart,
    newScheduleEnd, setNewScheduleEnd,
    newScheduleTolerance, setNewScheduleTolerance,
    schedules,
    onCreateSchedule,
    editingScheduleId,
    onEditSchedule,
    onCancelEdit
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-4">
                    {editingScheduleId ? 'Editar Horario' : 'Gestión de Horarios'}
                </h3>
                <form onSubmit={onCreateSchedule} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre del Horario (ej: Mañana)</label>
                        <input className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={newScheduleName} onChange={e => setNewScheduleName(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Hora de Entrada</label>
                            <input type="time" className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={newScheduleStart} onChange={e => setNewScheduleStart(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hora de Salida</label>
                            <input type="time" className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={newScheduleEnd} onChange={e => setNewScheduleEnd(e.target.value)} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tolerancia (minutos)</label>
                        <input type="number" className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800" value={newScheduleTolerance} onChange={e => setNewScheduleTolerance(e.target.value)} required />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg font-medium">
                            {editingScheduleId ? 'Guardar Cambios' : 'Crear Horario'}
                        </button>
                        {editingScheduleId && (
                            <button type="button" onClick={onCancelEdit} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-medium">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Horarios Existentes</h3>
                <div className="space-y-3">
                    {schedules.map(s => (
                        <div key={s.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between items-center group">
                            <div>
                                <p className="font-bold">{s.name}</p>
                                <p className="text-xs text-slate-500">
                                    {s.start_time} - {s.end_time || 'N/A'} (Tol: {s.tolerance_minutes}m)
                                </p>
                            </div>
                            <button
                                onClick={() => onEditSchedule(s)}
                                className="p-2 text-indigo-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                                title="Editar Horario"
                            >
                                <span className="material-icons-outlined text-xl">edit</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
