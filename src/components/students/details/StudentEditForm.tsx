import React from 'react';
import Input from '../../ui/Input';
import { type ScheduleData } from '../../../services/api';

interface Schedule extends ScheduleData { id: number; }

interface StudentData {
    first_name: string;
    last_name: string;
    full_name: string;
    dni?: string;
    grade: string;
    section: string;
    telegram_chat_id?: string | null;
    notify_telegram?: boolean;
    schedule_id?: number | string | null;
    photo_file?: File | null;
}

interface StudentEditFormProps {
    data: StudentData;
    onChange: (field: keyof StudentData, value: string | number | boolean | null | undefined | File) => void;
    schedules: Schedule[];
}

const StudentEditForm: React.FC<StudentEditFormProps> = ({ data, onChange, schedules }) => {
    const grades = [
        "1 PRIMARIA", "2 PRIMARIA", "3 PRIMARIA", "4 PRIMARIA", "5 PRIMARIA", "6 PRIMARIA",
        "1 SECUNDARIA", "2 SECUNDARIA", "3 SECUNDARIA", "4 SECUNDARIA", "5 SECUNDARIA"
    ];
    const sections = ["A", "B", "C", "D", "E"];

    return (
        <div className="space-y-4 w-full">
            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Apellidos"
                    value={data.last_name}
                    onChange={e => onChange('last_name', e.target.value.toUpperCase())}
                    placeholder="Apellidos"
                />
                <Input
                    label="Nombres"
                    value={data.first_name}
                    onChange={e => onChange('first_name', e.target.value.toUpperCase())}
                    placeholder="Nombres"
                />
            </div>

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

            <div className="space-y-2 pt-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                    <span className="material-icons-outlined text-sm">photo_camera</span>
                    Nueva Foto (Opcional)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => onChange('photo_file', e.target.files?.[0] || null)}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                />
            </div>
        </div>
    );
};

export default StudentEditForm;
