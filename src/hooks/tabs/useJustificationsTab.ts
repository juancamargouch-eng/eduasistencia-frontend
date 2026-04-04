import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getStudentAbsences, updateJustificationStatus, getJustifications, type Student, type Justification } from '../../services/api';
import { type Absense } from '../../components/admin/JustificationsTab';

export const useJustificationsTab = () => {
    const [justificationStudentId, setJustificationStudentId] = useState('');
    const [isLoadingAbsences, setIsLoadingAbsences] = useState(false);
    const [absences, setAbsences] = useState<Absense[]>([]);
    const [justificationStudentData, setJustificationStudentData] = useState<Student | null>(null);
    const [justifications, setJustifications] = useState<Justification[]>([]);
    
    // UI Local Modals
    const [selectedAbsence, setSelectedAbsence] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchJustifications = useCallback(async () => {
        try {
            const data = await getJustifications();
            setJustifications(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchJustifications();
    }, [fetchJustifications]);

    const handleSearchAbsences = async () => {
        if (justificationStudentId.length < 8) return;
        setIsLoadingAbsences(true);
        setAbsences([]);
        setJustificationStudentData(null);
        try {
            const data = await getStudentAbsences(justificationStudentId);
            setAbsences(data.absences);
            setJustificationStudentData(data.student);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo encontrar al estudiante o sus inasistencias");
        } finally {
            setIsLoadingAbsences(false);
        }
    };

    const handleJustifySuccess = () => {
        fetchJustifications();
        handleSearchAbsences();
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await updateJustificationStatus(id, status);
            toast.success(`Estado de justificación actualizado a ${status === 'APPROVED' ? 'APROBADO' : 'RECHAZADO'}`);
            fetchJustifications();
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar el estado");
        }
    };

    const openModal = (date: string) => {
        setSelectedAbsence(date);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedAbsence(null);
    };

    return {
        justificationStudentId,
        setJustificationStudentId,
        isLoadingAbsences,
        absences,
        justifications,
        justificationStudentData,
        handleSearchAbsences,
        handleUpdateStatus,
        handleJustifySuccess,
        openModal,
        closeModal,
        showModal,
        selectedAbsence
    };
};
