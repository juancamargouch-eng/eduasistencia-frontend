import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getStudents, updateStudent, syncTelegramIds, type Student } from '../services/api';

export const useStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ grade: '', section: '' });
    const [pagination, setPagination] = useState({ page: 0, limit: 50, total: 0 });

    const refreshStudents = useCallback(async () => {
        setLoading(true);
        try {
            const skip = pagination.page * pagination.limit;
            const data = await getStudents(skip, pagination.limit, filters.grade, filters.section, searchTerm);
            setStudents(data.items);
            setPagination(prev => ({ ...prev, total: data.total }));
        } catch (error) {
            console.error("Error loading students", error);
            toast.error("Error al cargar la lista de alumnos");
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, filters.grade, filters.section, searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            refreshStudents();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [refreshStudents]);

    const filteredStudents = students; // Ya filtrados en servidor

    const handleUpdateStudent = async (id: number, data: Partial<Student>) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value === undefined || value === null) return;

                if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                } else if (key !== 'photo_url' && key !== 'full_name') {
                    formData.append(key, String(value));
                }
            });

            await updateStudent(id, formData);
            await refreshStudents();
            return true;
        } catch (error) {
            console.error("Error updating student:", error);
            toast.error("Error al actualizar datos del alumno");
            return false;
        }
    };

    const handleToggleNotify = async (student: Student) => {
        const newValue = !student.notify_telegram;
        const success = await handleUpdateStudent(student.id, { notify_telegram: newValue });
        if (success) {
            toast.success(`Notificaciones ${newValue ? 'activadas' : 'desactivadas'} para ${student.full_name}`);
        }
    };

    const handleSyncTelegram = async () => {
        setLoading(true);
        try {
            const result = await syncTelegramIds();
            if (result.synced > 0) {
                toast.success(result.message);
                await refreshStudents();
            } else {
                toast.info(result.message);
            }
        } catch (error) {
            console.error("Error syncing telegram IDs:", error);
            toast.error("Error al sincronizar con Telegram");
        } finally {
            setLoading(false);
        }
    };

    return {
        students,
        loading,
        searchTerm,
        setSearchTerm,
        pagination,
        setPagination,
        filteredStudents,
        filters,
        setFilters,
        refreshStudents,
        handleUpdateStudent,
        handleToggleNotify,
        handleSyncTelegram
    };
};
