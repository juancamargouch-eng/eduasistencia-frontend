import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
    getCourses, createCourse, updateCourse, deleteCourse, type Course,
    getPeriods, createPeriod, updatePeriod, deletePeriod, type AcademicPeriod,
    getCriteria, createCriteria, updateCriteria, deleteCriteria, type EvaluationCriteria,
    getTeacherAssignments, createTeacherAssignment, updateTeacherAssignment, deleteAssignment, type TeacherAssignment,
    getSettings, updateSettings, type AcademicSetting,
    getUsers, type AdminUser
} from '../../../services/api';

export type SubTab = 'matrix' | 'assignments' | 'settings';
export type EditType = 'course' | 'period' | 'criteria' | 'assignment' | null;

export const useAcademic = () => {
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('matrix');
    const [loading, setLoading] = useState(true);

    // Data states
    const [courses, setCourses] = useState<Course[]>([]);
    const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
    const [criteria, setCriteria] = useState<EvaluationCriteria[]>([]);
    const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
    const [teachers, setTeachers] = useState<AdminUser[]>([]);
    const [settings, setSettings] = useState<AcademicSetting | null>(null);

    // Estados para el Modal de Edición Premium
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editType, setEditType] = useState<EditType>(null);
    const [editingEntity, setEditingEntity] = useState<Course | AcademicPeriod | EvaluationCriteria | TeacherAssignment | null>(null);
    const [editForm, setEditForm] = useState<Record<string, string>>({});

    // Form states
    const [newCourseName, setNewCourseName] = useState('');
    const [newPeriodName, setNewPeriodName] = useState('');
    const [newPeriodStart, setNewPeriodStart] = useState('');
    const [newPeriodEnd, setNewPeriodEnd] = useState('');
    const [newCriteriaName, setNewCriteriaName] = useState('');
    const [newCriteriaWeight, setNewCriteriaWeight] = useState<number>(0);

    const [assignTeacherId, setAssignTeacherId] = useState('');
    const [assignCourseId, setAssignCourseId] = useState('');
    const [assignGrade, setAssignGrade] = useState('');
    const [assignSection, setAssignSection] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [crs, prds, crt, assgs, stts, usrs] = await Promise.all([
                getCourses(),
                getPeriods(),
                getCriteria(),
                getTeacherAssignments(),
                getSettings(),
                getUsers()
            ]);
            setCourses(crs);
            setPeriods(prds);
            setCriteria(crt);
            setAssignments(assgs);
            setSettings(stts);
            // Filter only teachers
            setTeachers(usrs.filter(u => u.role === 'DOCENTE' && u.is_active));
        } catch (error) {
            toast.error("Error al cargar datos maestros académicos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handlers
    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseName.trim()) return toast.warning("Nombre de curso vacío");
        setIsSubmitting(true);
        try {
            const added = await createCourse({ name: newCourseName });
            setCourses([...courses, added]);
            setNewCourseName('');
            toast.success("Curso creado!");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Error al crear curso");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreatePeriod = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPeriodName || !newPeriodStart || !newPeriodEnd) return toast.warning("Campos incompletos");
        setIsSubmitting(true);
        try {
            const added = await createPeriod({ name: newPeriodName, start_date: newPeriodStart, end_date: newPeriodEnd, is_active: true });
            setPeriods([...periods, added]);
            setNewPeriodName('');
            setNewPeriodStart('');
            setNewPeriodEnd('');
            toast.success("Periodo creado!");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Error al crear periodo");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateCriteria = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCriteriaName) return toast.warning("Nombre de criterio vacío");
        setIsSubmitting(true);
        try {
            const added = await createCriteria({ name: newCriteriaName, weight_percentage: newCriteriaWeight, is_active: true });
            setCriteria([...criteria, added]);
            setNewCriteriaName('');
            setNewCriteriaWeight(0);
            toast.success("Criterio creado!");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Error al crear criterio");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignTeacherId || !assignCourseId || !assignGrade || !assignSection) return toast.warning("Complete todos los campos");
        setIsSubmitting(true);
        try {
            await createTeacherAssignment({
                user_id: parseInt(assignTeacherId),
                course_id: parseInt(assignCourseId),
                grade: assignGrade,
                section: assignSection
            });
            await loadData();
            toast.success("Asignación completada!");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Error al asignar");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleGradingSystem = async (system: 'NUMERIC' | 'LITERAL') => {
        setIsSubmitting(true);
        try {
            const updated = await updateSettings({ grading_system: system });
            setSettings(updated);
            toast.success(`Sistema cambiado a: ${system === 'NUMERIC' ? 'Numérico' : 'Letras'}`);
        } catch (error) {
            toast.error("Error al actualizar configuración");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Handlers
    const handleDeleteCourse = async (id: number) => {
        if (!window.confirm("¿Está seguro de eliminar este curso?")) return;
        try {
            await deleteCourse(id);
            setCourses(courses.filter(c => c.id !== id));
            toast.success("Curso eliminado");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Error al eliminar");
        }
    };

    const handleDeletePeriod = async (id: number) => {
        if (!window.confirm("¿Está seguro de eliminar este periodo?")) return;
        try {
            await deletePeriod(id);
            setPeriods(periods.filter(p => p.id !== id));
            toast.success("Periodo eliminado");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Error al eliminar");
        }
    };

    const handleDeleteCriteria = async (id: number) => {
        if (!window.confirm("¿Está seguro de eliminar este criterio?")) return;
        try {
            await deleteCriteria(id);
            setCriteria(criteria.filter(c => c.id !== id));
            toast.success("Criterio eliminado");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Error al eliminar");
        }
    };

    const handleDeleteAssignment = async (id: number) => {
        if (!window.confirm("¿Está seguro de eliminar esta asignación?")) return;
        try {
            await deleteAssignment(id);
            setAssignments(assignments.filter(a => a.id !== id));
            toast.success("Asignación eliminada");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Error al eliminar");
        }
    };

    // Edit Handlers
    const handleEditCourse = (course: Course) => {
        setEditType('course');
        setEditingEntity(course);
        setEditForm({ name: course.name });
        setIsEditModalOpen(true);
    };

    const handleEditPeriod = (period: AcademicPeriod) => {
        setEditType('period');
        setEditingEntity(period);
        setEditForm({ 
            name: period.name,
            start_date: period.start_date,
            end_date: period.end_date
        });
        setIsEditModalOpen(true);
    };

    const handleEditCriteria = (criteria: EvaluationCriteria) => {
        setEditType('criteria');
        setEditingEntity(criteria);
        setEditForm({ 
            name: criteria.name,
            weight: criteria.weight_percentage.toString()
        });
        setIsEditModalOpen(true);
    };

    const handleEditAssignment = (assignment: TeacherAssignment) => {
        setEditType('assignment');
        setEditingEntity(assignment);
        setEditForm({ 
            grade: assignment.grade,
            section: assignment.section
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editType || !editingEntity) return;
        setIsSubmitting(true);
        try {
            if (editType === 'course') {
                const updated = await updateCourse(editingEntity.id!, { name: editForm.name });
                setCourses(courses.map(c => c.id === editingEntity.id ? updated : c));
                toast.success("Curso actualizado");
            } else if (editType === 'period') {
                const updated = await updatePeriod(editingEntity.id!, { 
                    name: editForm.name,
                    start_date: editForm.start_date,
                    end_date: editForm.end_date 
                });
                setPeriods(periods.map(p => p.id === editingEntity.id ? updated : p));
                toast.success("Periodo actualizado");
            } else if (editType === 'criteria') {
                const updated = await updateCriteria(editingEntity.id!, { 
                    name: editForm.name,
                    weight_percentage: parseInt(editForm.weight)
                });
                setCriteria(criteria.map(c => c.id === editingEntity.id ? updated : c));
                toast.success("Criterio actualizado");
            } else if (editType === 'assignment') {
                await updateTeacherAssignment(editingEntity.id!, { 
                    grade: editForm.grade,
                    section: editForm.section
                });
                await loadData();
                toast.success("Asignación actualizada");
            }
            
            setIsEditModalOpen(false);
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Error al guardar cambios");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // Core State
        loading,
        activeSubTab, setActiveSubTab,
        
        // Data
        courses, periods, criteria, assignments, teachers, settings,
        
        // Modal State
        isEditModalOpen, setIsEditModalOpen,
        editType, editingEntity,
        editForm, setEditForm,
        
        // Form States
        newCourseName, setNewCourseName,
        newPeriodName, setNewPeriodName,
        newPeriodStart, setNewPeriodStart,
        newPeriodEnd, setNewPeriodEnd,
        newCriteriaName, setNewCriteriaName,
        newCriteriaWeight, setNewCriteriaWeight,
        
        assignTeacherId, setAssignTeacherId,
        assignCourseId, setAssignCourseId,
        assignGrade, setAssignGrade,
        assignSection, setAssignSection,
        isSubmitting,
        
        // Actions
        handleCreateCourse, handleCreatePeriod, handleCreateCriteria, handleCreateAssignment,
        handleDeleteCourse, handleDeletePeriod, handleDeleteCriteria, handleDeleteAssignment,
        handleEditCourse, handleEditPeriod, handleEditCriteria, handleEditAssignment,
        handleSaveEdit, handleToggleGradingSystem
    };
};
