import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssignments, createAssignment, deleteAssignment, type Assignment } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface TasksTabProps {
    grades: string[];
    sections: string[];
}

const TasksTab: React.FC<TasksTabProps> = ({ grades, sections }) => {
    const [tasks, setTasks] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [grade, setGrade] = useState('');
    const [section, setSection] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchTasks = async () => {
        try {
            const data = await getAssignments();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (dueDate) formData.append('due_date', dueDate);
            formData.append('grade', grade);
            formData.append('section', section);
            if (file) formData.append('file', file);

            await createAssignment(formData);
            setShowForm(false);
            resetForm();
            fetchTasks();
        } catch {
            alert("Error al crear la tarea");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setGrade('');
        setSection('');
        setFile(null);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta tarea?")) return;
        try {
            await deleteAssignment(id);
            fetchTasks();
        } catch {
            alert("Error al eliminar");
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestión de Tareas</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Asignación académica por grado y sección</p>
                </div>
                <Button 
                    onClick={() => setShowForm(!showForm)} 
                    variant={showForm ? 'secondary' : 'primary'}
                    className="rounded-2xl px-8"
                >
                    <span className="material-icons-outlined">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Cancelar' : 'Nueva Tarea'}
                </Button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-primary/10 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Título de la Tarea</label>
                                        <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ej: Investigación de la Célula" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fecha de Entrega</label>
                                        <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descripción / Instrucciones</label>
                                    <textarea 
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium text-sm min-h-[100px]"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Detalla lo que el estudiante debe realizar..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Grado</label>
                                        <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={grade} onChange={e => setGrade(e.target.value)} required>
                                            <option value="">Seleccionar</option>
                                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sección</label>
                                        <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={section} onChange={e => setSection(e.target.value)} required>
                                            <option value="">Seleccionar</option>
                                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Archivo Adjunto (Opcional)</label>
                                        <input 
                                            type="file" 
                                            onChange={e => setFile(e.target.files?.[0] || null)}
                                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" isLoading={submitting} className="px-12 py-4 rounded-2xl">
                                        Publicar Tarea
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse text-slate-400">Cargando tareas...</div>
                ) : tasks.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <span className="material-icons-outlined text-6xl opacity-20 mb-4">inventory_2</span>
                        <p className="font-black uppercase tracking-widest text-slate-400">No hay tareas asignadas</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <motion.div key={task.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Card className="hover:shadow-xl transition-all border-none bg-white dark:bg-slate-900 overflow-hidden group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                            <span className="material-icons-outlined text-primary">description</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{task.grade} - {task.section}</span>
                                            <h4 className="font-black text-slate-900 dark:text-white leading-tight">{task.title}</h4>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(task.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                        <span className="material-icons-outlined">delete</span>
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">
                                    {task.description || "Sin descripción proporcionada."}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-amber-600">
                                        <span className="material-icons-outlined text-sm">event</span>
                                        <span className="text-[10px] font-black uppercase tracking-wider">
                                            Entrega: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Pendiente'}
                                        </span>
                                    </div>
                                    {task.file_url && (
                                        <a href={task.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline font-black text-[10px] uppercase tracking-tighter">
                                            <span className="material-icons-outlined text-sm">attachment</span>
                                            Ver Adjunto
                                        </a>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TasksTab;
