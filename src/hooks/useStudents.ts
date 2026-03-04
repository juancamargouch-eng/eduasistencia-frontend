import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { getStudents, updateStudent, type Student } from '../services/api';

export const useStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const refreshStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            console.error("Error loading students", error);
            toast.error("Error al cargar la lista de alumnos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshStudents();
    }, []);

    const filteredStudents = useMemo(() => {
        return students.filter(s =>
            s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.dni?.includes(searchTerm)
        );
    }, [students, searchTerm]);

    const handleUpdateStudent = async (id: number, data: Partial<Student>) => {
        try {
            await updateStudent(id, data);
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

    return {
        students,
        loading,
        searchTerm,
        setSearchTerm,
        filteredStudents,
        refreshStudents,
        handleUpdateStudent,
        handleToggleNotify
    };
};
