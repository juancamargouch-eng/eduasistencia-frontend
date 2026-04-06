import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { 
    getMyAssignments, 
    getGradesForAssignment, 
    bulkUploadGrades, 
    getPeriods, 
    getCriteria, 
    getSettings,
    getStudents,
    type TeacherAssignment,
    type Grade,
    type AcademicPeriod,
    type EvaluationCriteria,
    type AcademicSetting,
    type Student
} from '../../services/api';

const GradesTab: React.FC = () => {
    const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
    const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
    const [criteria, setCriteria] = useState<EvaluationCriteria[]>([]);
    const [settings, setSettings] = useState<AcademicSetting | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | ''>('');
    const [selectedPeriodId, setSelectedPeriodId] = useState<number | ''>('');
    
    const [gradesMatrix, setGradesMatrix] = useState<Record<string, string>>({});
    const [initialGrades, setInitialGrades] = useState<Record<string, string>>({});
    
    const [loading, setLoading] = useState(true);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load master data
    useEffect(() => {
        const loadMasterData = async () => {
            setLoading(true);
            try {
                const [assgs, prds, crit, stts] = await Promise.all([
                    getMyAssignments(),
                    getPeriods(),
                    getCriteria(),
                    getSettings()
                ]);
                
                setAssignments(assgs);
                const activePeriods = prds.filter(p => p.is_active);
                setPeriods(activePeriods);
                setCriteria(crit.filter(c => c.is_active));
                setSettings(stts);

                if (assgs.length > 0) setSelectedAssignmentId(assgs[0].id!);
                if (activePeriods.length > 0) setSelectedPeriodId(activePeriods[0].id);
            } catch (error) {
                console.error(error);
                toast.error("Error al cargar datos iniciales");
            } finally {
                setLoading(false);
            }
        };
        loadMasterData();
    }, []);

    // Load students and grades when selection changes
    useEffect(() => {
        if (!selectedAssignmentId || !selectedPeriodId) return;

        const loadStudentsAndGrades = async () => {
            setLoadingGrades(true);
            try {
                const assignment = assignments.find(a => a.id === selectedAssignmentId);
                if (!assignment) return;

                // 1. Fetch Students for this grade/section
                const studentData = await getStudents(0, 200, assignment.grade, assignment.section);
                setStudents(studentData.items);

                // 2. Fetch Existing Grades
                const existingGrades = await getGradesForAssignment(selectedAssignmentId, selectedPeriodId);
                
                const matrix: Record<string, string> = {};
                existingGrades.forEach(g => {
                    matrix[`${g.student_id}-${g.criterion_id}`] = g.score_value;
                });
                
                setGradesMatrix(matrix);
                setInitialGrades(matrix); // Track for changes
            } catch (error) {
                console.error(error);
                toast.error("Error al cargar la libreta");
            } finally {
                setLoadingGrades(false);
            }
        };

        loadStudentsAndGrades();
    }, [selectedAssignmentId, selectedPeriodId, assignments]);

    const handleScoreChange = (studentId: number, criterionId: number, value: string) => {
        // Sanitize input if numeric
        let finalValue = value;
        if (settings?.grading_system === 'NUMERIC') {
            // Only allow numbers and decimal point
            finalValue = value.replace(/[^0-9.]/g, '');
        } else {
            finalValue = value.toUpperCase();
        }

        setGradesMatrix(prev => ({
            ...prev,
            [`${studentId}-${criterionId}`]: finalValue
        }));
    };

    const hasChanges = useMemo(() => {
        return JSON.stringify(gradesMatrix) !== JSON.stringify(initialGrades);
    }, [gradesMatrix, initialGrades]);

    const handleSave = async () => {
        if (!selectedAssignmentId || !selectedPeriodId) return;
        
        setIsSaving(true);
        try {
            const gradesToUpload: Omit<Grade, 'id' | 'created_at'>[] = [];
            
            Object.entries(gradesMatrix).forEach(([key, value]) => {
                if (!value) return; // Skip empty
                
                const [studentId, criterionId] = key.split('-').map(Number);
                gradesToUpload.push({
                    student_id: studentId,
                    assignment_id: selectedAssignmentId,
                    criterion_id: criterionId,
                    period_id: selectedPeriodId,
                    score_value: value
                });
            });

            await bulkUploadGrades(gradesToUpload);
            setInitialGrades({ ...gradesMatrix });
            toast.success("Calificaciones guardadas con éxito");
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar calificaciones");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center animate-pulse font-black text-slate-400 uppercase tracking-widest">Sincronizando Libreta Docente...</div>;
    }

    if (assignments.length === 0) {
        return (
            <div className="p-12 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl text-center">
                <span className="material-icons-outlined text-6xl text-slate-300 mb-4 font-black">person_off</span>
                <h3 className="text-xl font-black text-slate-700 dark:text-slate-300">No tienes salones asignados</h3>
                <p className="text-sm font-medium text-slate-500 mt-2">Contacta con el Administrador para que vincule tu perfil a un curso y grado.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header / Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl">
               <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                        <span className="material-icons-outlined text-3xl">grading</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                            Registro de Notas
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                            Sistema: <span className="text-amber-600 dark:text-amber-400">{settings?.grading_system === 'NUMERIC' ? 'Numérico (0-20)' : 'Alfabético (AD-C)'}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Curso / Salón</label>
                        <select 
                            value={selectedAssignmentId} 
                            onChange={(e) => setSelectedAssignmentId(Number(e.target.value))}
                            className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500 transition-all min-w-[200px]"
                        >
                            {assignments.map(a => (
                                <option key={a.id} value={a.id}>
                                    [{a.grade} {a.section}] {a.course_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Periodo Académico</label>
                        <select 
                            value={selectedPeriodId} 
                            onChange={(e) => setSelectedPeriodId(Number(e.target.value))}
                            className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        >
                            {periods.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button 
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                            className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95 ${
                                hasChanges 
                                ? 'bg-amber-500 text-white shadow-amber-500/20' 
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 shadow-none cursor-default'
                            }`}
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Todo'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    {loadingGrades ? (
                        <div className="p-20 text-center animate-pulse flex flex-col items-center gap-4">
                            <span className="material-icons text-5xl text-slate-200">grid_view</span>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando nómina de alumnos...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100/50 dark:bg-slate-800/50">
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-10 w-[300px]">Estudiante</th>
                                    {criteria.map(c => (
                                        <th key={c.id} className="px-6 py-6 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest text-center border-r border-slate-200/50 dark:border-slate-800/50 min-w-[140px]">
                                            <div className="flex flex-col items-center">
                                                <span>{c.name}</span>
                                                <span className="text-[8px] text-amber-500 mt-1">{c.weight_percentage}%</span>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-6 py-6 text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center">Promedio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students.map(student => {
                                    // Row data
                                    let rowSum = 0;
                                    let rowCount = 0;

                                    return (
                                        <tr key={student.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 sticky left-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-r border-slate-100 dark:border-slate-800 z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                        {student.full_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase truncate max-w-[180px]">{student.full_name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400">DNI: {student.dni}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {criteria.map(c => {
                                                const gradeKey = `${student.id}-${c.id}`;
                                                const val = gradesMatrix[gradeKey] || '';
                                                const isChanged = val !== (initialGrades[gradeKey] || '');
                                                
                                                if (val && !isNaN(Number(val))) {
                                                    rowSum += Number(val) * (c.weight_percentage / 100);
                                                    rowCount++;
                                                }

                                                return (
                                                    <td key={c.id} className="p-2 border-r border-slate-100/50 dark:border-slate-800/50">
                                                        <input 
                                                            type="text" 
                                                            value={val}
                                                            onChange={(e) => handleScoreChange(student.id, c.id, e.target.value)}
                                                            placeholder="-"
                                                            className={`w-full h-10 bg-transparent border-2 border-transparent rounded-xl text-center text-sm font-black transition-all focus:bg-white dark:focus:bg-slate-800 focus:shadow-inner outline-none ${
                                                                isChanged ? 'text-amber-500 border-amber-500/20' : 'text-slate-700 dark:text-slate-200'
                                                            }`}
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-xs font-black px-3 py-1.5 rounded-lg ${
                                                    rowSum >= 11 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                    {rowCount > 0 ? rowSum.toFixed(1) : '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={criteria.length + 2} className="p-20 text-center text-slate-400 font-bold text-sm">
                                            No hay alumnos registrados en este salón.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            {/* Footer Legend */}
            <div className="flex flex-wrap gap-6 p-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nota pendiente de guardar</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Puntaje Automático</span>
                </div>
            </div>
        </div>
    );
};

export default GradesTab;
