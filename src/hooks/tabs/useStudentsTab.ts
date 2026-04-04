import { useState, useCallback, useEffect } from 'react';
import { getStudents, type Student } from '../../services/api';

export const useStudentsTab = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [filterGrade, setFilterGrade] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [pagination, setPagination] = useState({ page: 0, limit: 50, total: 0 });
    
    // Modales y Seleccion
    const [showImportModal, setShowImportModal] = useState(false);
    const [showBulkPhotoModal, setShowBulkPhotoModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const skip = pagination.page * pagination.limit;
            const data = await getStudents(skip, pagination.limit, filterGrade, filterSection);
            setStudents(data.items);
            setPagination(prev => ({ ...prev, total: data.total }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, filterGrade, filterSection]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleFilterGradeChange = (val: string) => { setFilterGrade(val); setPagination(p => ({...p, page: 0})); };
    const handleFilterSectionChange = (val: string) => { setFilterSection(val); setPagination(p => ({...p, page: 0})); };
    const handlePageChange = (page: number) => setPagination(p => ({ ...p, page }));

    const handleStudentUpdate = () => {
        fetchStudents();
    };

    return {
        students,
        loading,
        filterGrade,
        setFilterGrade: handleFilterGradeChange,
        filterSection,
        setFilterSection: handleFilterSectionChange,
        pagination,
        handlePageChange,
        showImportModal,
        setShowImportModal,
        showBulkPhotoModal,
        setShowBulkPhotoModal,
        selectedStudent,
        setSelectedStudent,
        handleStudentUpdate,
        refresh: fetchStudents
    };
};
