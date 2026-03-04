import React, { useState } from 'react';
import { toast } from 'sonner';
import { createJustification, type Student } from '../services/api';

interface JustificationModalProps {
    student: Student;
    absenceDate: string;
    onClose: () => void;
    onSuccess: () => void;
}

const JustificationModal: React.FC<JustificationModalProps> = ({ student, absenceDate, onClose, onSuccess }) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createJustification({
                student_id: student.id, // We have the ID from search
                date: absenceDate,
                reason: reason
            });
            toast.success("Justificación registrada con éxito");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Error al registrar justificación");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Justificar Inasistencia</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <span className="material-icons text-xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">

                        {/* Student Info Card */}
                        <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xl">
                                {student.photo_url ? (
                                    <img src={student.photo_url} alt={student.full_name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    student.full_name.charAt(0)
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{student.full_name}</h4>
                                <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="flex items-center gap-1">
                                        <span className="material-icons-outlined text-[14px]">school</span>
                                        {student.grade} "{student.section}"
                                    </span>
                                    {student.dni && (
                                        <span className="flex items-center gap-1">
                                            <span className="material-icons-outlined text-[14px]">badge</span>
                                            {student.dni}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Date & Shift Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span className="block text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Fecha de Falta</span>
                                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                                    <span className="material-icons-outlined text-red-500 text-lg">event_busy</span>
                                    {absenceDate}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span className="block text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Turno</span>
                                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                                    <span className="material-icons-outlined text-indigo-500 text-lg">schedule</span>
                                    {student.schedule?.name || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Reason Input */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Motivo de Justificación <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="Describa brevemente la razón de la inasistencia (Enfermedad, trámite, etc.)"
                                rows={3}
                                required
                            />
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !reason.trim()}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-icons-outlined animate-spin text-lg">sync</span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons-outlined text-lg">save</span>
                                    Guardar Justificación
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JustificationModal;
