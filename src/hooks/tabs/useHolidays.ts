import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getHolidays, createHoliday, deleteHoliday, type Holiday } from '../../services/holidayService';

export const useHolidays = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ date: '', name: '', description: '' });

    const fetchHolidays = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getHolidays();
            setHolidays(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar feriados");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHolidays();
    }, [fetchHolidays]);

    const handleCreateHoliday = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.date || !form.name) return toast.error("Fecha y nombre requeridos");
        
        setLoading(true);
        try {
            await createHoliday(form);
            toast.success("Feriado agregado");
            setForm({ date: '', name: '', description: '' });
            fetchHolidays();
        } catch (error) {
            console.error(error);
            toast.error("Error al agregar feriado");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHoliday = async (id: number) => {
        if (!confirm("¿Está seguro de eliminar este feriado?")) return;
        
        try {
            await deleteHoliday(id);
            toast.success("Feriado eliminado");
            fetchHolidays();
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar feriado");
        }
    };

    return {
        holidays,
        loading,
        form,
        setForm,
        handleCreateHoliday,
        handleDeleteHoliday,
        refresh: fetchHolidays
    };
};
