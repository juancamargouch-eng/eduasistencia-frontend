import { useState } from 'react';
import { toast } from 'sonner';
import { createSchedule, updateSchedule, type Schedule } from '../../services/api';

export const useSettingsTab = (onSuccess?: () => void) => {
    const [schForm, setSchForm] = useState({ name: '', start: '', end: '', tolerance: '0' });
    const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleEditSchedule = (schedule: Schedule) => {
        setEditingScheduleId(schedule.id);
        setSchForm({
            name: schedule.name,
            start: schedule.start_time,
            end: schedule.end_time || '',
            tolerance: String(schedule.tolerance_minutes)
        });
    };

    const handleCancelEdit = () => {
        setEditingScheduleId(null);
        setSchForm({ name: '', start: '', end: '', tolerance: '0' });
    };

    const handleSubmitSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                name: schForm.name,
                slug: schForm.name.toLowerCase().replace(/\s+/g, '_'),
                start_time: schForm.start,
                end_time: schForm.end,
                tolerance_minutes: parseInt(schForm.tolerance) || 0
            };

            if (editingScheduleId) {
                await updateSchedule(editingScheduleId, data);
                toast.success("Horario actualizado");
            } else {
                await createSchedule(data);
                toast.success("Horario creado");
            }
            
            handleCancelEdit();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar horario");
        } finally { 
            setLoading(false); 
        }
    };

    return {
        form: schForm,
        setName: (n: string) => setSchForm(p => ({ ...p, name: n })),
        setStart: (s: string) => setSchForm(p => ({ ...p, start: s })),
        setEnd: (e: string) => setSchForm(p => ({ ...p, end: e })),
        setTolerance: (t: string) => setSchForm(p => ({ ...p, tolerance: t })),
        editingScheduleId,
        loading,
        handleEditSchedule,
        handleCancelEdit,
        handleSubmitSchedule
    };
};
