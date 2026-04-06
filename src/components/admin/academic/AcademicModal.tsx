import React from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import type { useAcademic } from './useAcademic';

interface AcademicModalProps {
    logic: ReturnType<typeof useAcademic>;
}

const AcademicModal: React.FC<AcademicModalProps> = ({ logic }) => {
    const {
        isEditModalOpen, setIsEditModalOpen,
        editType, editForm, setEditForm,
        isSubmitting, handleSaveEdit
    } = logic;

    const gradeOptions = [
        "1 PRIMARIA", "2 PRIMARIA", "3 PRIMARIA", "4 PRIMARIA", "5 PRIMARIA", "6 PRIMARIA",
        "1 SECUNDARIA", "2 SECUNDARIA", "3 SECUNDARIA", "4 SECUNDARIA", "5 SECUNDARIA"
    ];
    const sectionOptions = ["A", "B", "C", "D", "E"];

    return (
        <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title={`Editar ${editType === 'course' ? 'Curso' : editType === 'period' ? 'Periodo' : editType === 'criteria' ? 'Criterio' : 'Asignación'}`}
            icon={editType === 'course' ? 'menu_book' : editType === 'period' ? 'date_range' : editType === 'criteria' ? 'fact_check' : 'person_add'}
        >
            <div className="space-y-6">
                {editType === 'course' && (
                    <Input 
                        label="Nombre del Curso"
                        value={editForm.name || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, name: e.target.value})}
                        icon="menu_book"
                        placeholder="Ej. Matemática"
                    />
                )}

                {editType === 'period' && (
                    <div className="space-y-4">
                        <Input 
                            label="Nombre del Periodo"
                            value={editForm.name || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, name: e.target.value})}
                            icon="badge"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Inicio"
                                type="date"
                                value={editForm.start_date || ''}
                                onChange={(e: any) => setEditForm({...editForm, start_date: e.target.value})}
                            />
                            <Input 
                                label="Fin"
                                type="date"
                                value={editForm.end_date || ''}
                                onChange={(e: any) => setEditForm({...editForm, end_date: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                {editType === 'criteria' && (
                    <div className="space-y-4">
                        <Input 
                            label="Nombre del Criterio"
                            value={editForm.name || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, name: e.target.value})}
                            icon="fact_check"
                        />
                        <Input 
                            label="Peso Porcentual (%)"
                            type="number"
                            value={editForm.weight || ''}
                            onChange={(e: any) => setEditForm({...editForm, weight: e.target.value})}
                            icon="percent"
                        />
                    </div>
                )}

                {editType === 'assignment' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Grado</label>
                            <select 
                                value={editForm.grade}
                                onChange={e => setEditForm({...editForm, grade: e.target.value})}
                                className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                            >
                                {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sección</label>
                            <select 
                                value={editForm.section}
                                onChange={e => setEditForm({...editForm, section: e.target.value})}
                                className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                            >
                                {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-4">
                    <Button 
                        variant="secondary" 
                        fullWidth 
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        fullWidth 
                        onClick={handleSaveEdit}
                        loading={isSubmitting}
                    >
                        Guardar Cambios
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AcademicModal;
