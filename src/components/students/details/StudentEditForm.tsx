import React from 'react';
import Input from '../../ui/Input';
import { type ScheduleData } from '../../../services/api';

interface Schedule extends ScheduleData { id: number; }

interface StudentData {
    full_name: string;
    dni?: string;
    grade: string;
    section: string;
    telegram_chat_id?: string | null;
    notify_telegram?: boolean;
    schedule_id?: number | string | null;
}

interface StudentEditFormProps {
    data: StudentData;
    onChange: (field: keyof StudentData, value: string | number | boolean | null | undefined) => void;
    schedules: Schedule[];
}

const StudentEditForm: React.FC<StudentEditFormProps> = ({ data, onChange, schedules }) => {
    const grades = ["1ro Primaria", "2do Primaria", "3er Primaria", "4to Primaria", "5to Primaria", "6to Primaria", "1ro Secundaria", "2do Secundaria", "3er Secundaria", "4to Secundaria", "5to Secundaria"];
    const sections = ["A", "B", "C", "D", "E"];

    return (
        <div className="space-y-4 w-full">
            <Input
                label="Nombre Completo"
                value={data.full_name}
                onChange={e => onChange('full_name', e.target.value)}
                placeholder="Nombre Completo"
            />

            <Input
                label="DNI"
                icon="badge"
                maxLength={8}
                value={data.dni}
                onChange={e => onChange('dni', e.target.value.replace(/\D/g, ''))}
                placeholder="00000000"
                className="font-mono"
            />

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Grado</label>
                    <select
                        value={data.grade}
                        onChange={e => onChange('grade', e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                    >
                        <option value="">Seleccionar</option>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Sección</label>
                    <select
                        value={data.section}
                        onChange={e => onChange('section', e.target.value)}
                        className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                    >
                        <option value="">Seleccionar</option>
                        {sections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Input
                    label="Telegram Chat ID"
                    value={data.telegram_chat_id || ''}
                    placeholder="@usuario o número"
                    onChange={e => onChange('telegram_chat_id', e.target.value)}
                    className="text-sm font-mono"
                />
                <div className="flex flex-col justify-center gap-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Notificaciones</label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onChange('notify_telegram', !data.notify_telegram)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${data.notify_telegram ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${data.notify_telegram ? 'translate-x-5' : ''}`}></div>
                        </button>
                        <span className="text-[10px] font-bold">{data.notify_telegram ? 'ACTIVO' : 'OFF'}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold">Turno / Horario</label>
                <select
                    value={data.schedule_id || ''}
                    onChange={e => onChange('schedule_id', e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                >
                    <option value="">Sin Turno Asignado</option>
                    {schedules.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name} ({s.start_time})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default StudentEditForm;
