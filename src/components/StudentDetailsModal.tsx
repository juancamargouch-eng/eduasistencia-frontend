import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateStudent, deleteStudent, getSchedules, type ScheduleData as ScheduleDataBase, getStudentPhotoUrl } from '../services/api';
import Badge from './ui/Badge';
import Button from './ui/Button';

// Sub-componentes
import QRCodeSection from './students/details/QRCodeSection';
import StudentEditForm from './students/details/StudentEditForm';

interface Schedule extends ScheduleDataBase { id: number; }

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    grade: string;
    section: string;
    photo_url?: string;
    dni?: string;
    qr_code_hash?: string;
    schedule_id?: number | null;
    telegram_chat_id?: string | null;
    telegram_user_id?: string | null;
    notify_telegram?: boolean;
    photo_file?: File | null;
}

interface StudentDetailsModalProps {
    student: Student;
    onClose: () => void;
    onUpdate: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, onClose, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...student });
    const [loading, setLoading] = useState(false);
    const [schedules, setSchedules] = useState<Schedule[]>([]);

    useEffect(() => {
        if (isEditing) fetchSchedules();
    }, [isEditing]);

    const fetchSchedules = async () => {
        try {
            const data = await getSchedules();
            setSchedules(data);
        } catch (error) {
            console.error("Error fetching schedules", error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Append all fields from editData
            Object.entries(editData).forEach(([key, value]) => {
                if (value === undefined || value === null) return;

                if (key === 'photo_file' && value instanceof File) {
                    formData.append('file', value);
                } else if (key === 'schedule_id') {
                    formData.append(key, String(value));
                } else if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                } else if (key !== 'photo_url' && key !== 'photo_file') {
                    formData.append(key, String(value));
                }
            });

            await updateStudent(student.id, formData);
            onUpdate();
            setIsEditing(false);
            toast.success("Estudiante actualizado");
        } catch {
            toast.error("Error al actualizar estudiante");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Eliminar a este estudiante? Esta acción es irreversible.")) return;
        try {
            await deleteStudent(student.id);
            onUpdate();
            onClose();
            toast.success("Estudiante eliminado");
        } catch {
            toast.error("Error al eliminar estudiante");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header with Photo */}
                <div className="relative h-32 bg-primary/5">
                    <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors">
                        <span className="material-icons-outlined text-sm">close</span>
                    </button>
                    <div className="absolute -bottom-10 left-8">
                        <div className="w-28 h-28 rounded-[2rem] bg-white dark:bg-slate-800 p-1.5 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="w-full h-full rounded-[1.6rem] overflow-hidden bg-slate-100 dark:bg-slate-700">
                                {student.photo_url ? (
                                    <img src={getStudentPhotoUrl(student.photo_url) || ''} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <span className="material-icons-outlined text-5xl">person</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-14 pb-8 px-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex-1 min-w-0 pr-4">
                            {!isEditing ? (
                                <>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{student.full_name}</h2>
                                        <Badge variant="neutral">#{student.id}</Badge>
                                    </div>
                                    <p className="text-slate-500 font-bold mb-4">{student.grade} • Sección "{student.section}"</p>

                                    <div className="space-y-2 mb-6">
                                        {student.dni && (
                                            <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                                                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <span className="material-icons-outlined text-sm">badge</span>
                                                </div>
                                                DNI: <span className="font-mono text-primary">{student.dni}</span>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap items-center gap-3 mt-4">
                                            <Badge variant={student.telegram_user_id ? 'success' : 'neutral'}>
                                                {student.telegram_user_id ? 'Telegram Vinculado' : 'Sin Vincular'}
                                            </Badge>
                                            <Badge variant={student.notify_telegram ? 'success' : 'neutral'}>
                                                {student.notify_telegram ? 'Alertas ON' : 'Alertas OFF'}
                                            </Badge>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <StudentEditForm
                                    data={editData}
                                    onChange={(f, v) => setEditData(prev => ({ ...prev, [f]: v }))}
                                    schedules={schedules}
                                />
                            )}
                        </div>

                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-all">
                                <span className="material-icons-outlined">edit</span>
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Button size="sm" variant="green" onClick={handleSave} isLoading={loading} icon="check" />
                                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)} icon="close" />
                            </div>
                        )}
                    </div>

                    {!isEditing && student.qr_code_hash && (
                        <QRCodeSection qrCodeHash={student.qr_code_hash} studentName={student.full_name} />
                    )}

                    {!isEditing && (
                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <button onClick={handleDelete} className="w-full py-4 text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors flex items-center justify-center gap-2">
                                <span className="material-icons-outlined text-sm">delete_forever</span>
                                Eliminar Estudiante del Sistema
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;
