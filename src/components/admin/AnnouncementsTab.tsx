import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnnouncements, createAnnouncement, deleteAnnouncement, type Announcement } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface AnnouncementsTabProps {
    grades: string[];
    sections: string[];
}

const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({ grades, sections }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [targetGrade, setTargetGrade] = useState('TODOS');
    const [targetSection, setTargetSection] = useState('TODOS');
    const [submitting, setSubmitting] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            const data = await getAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error("Error fetching announcements", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createAnnouncement({
                title,
                content,
                target_grade: targetGrade,
                target_section: targetSection
            });
            setShowForm(false);
            resetForm();
            fetchAnnouncements();
        } catch {
            alert("Error al crear el comunicado");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setTargetGrade('TODOS');
        setTargetSection('TODOS');
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Seguro que quieres eliminar este comunicado?")) return;
        try {
            await deleteAnnouncement(id);
            fetchAnnouncements();
        } catch {
            alert("Error al eliminar");
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Comunicados Escolares</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Difusión de información importante para la comunidad</p>
                </div>
                <Button 
                    onClick={() => setShowForm(!showForm)} 
                    variant={showForm ? 'secondary' : 'primary'}
                    className="rounded-2xl px-8"
                >
                    <span className="material-icons-outlined">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Cancelar' : 'Nuevo Comunicado'}
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
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asunto / Título</label>
                                    <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ej: Suspensión de clases por feriado" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contenido del Mensaje</label>
                                    <textarea 
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium text-sm min-h-[120px]"
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        placeholder="Escribe el cuerpo del comunicado aquí..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Para el Grado</label>
                                        <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={targetGrade} onChange={e => setTargetGrade(e.target.value)} required>
                                            <option value="TODOS">TODOS LOS GRADOS</option>
                                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Para la Sección</label>
                                        <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold text-sm" value={targetSection} onChange={e => setTargetSection(e.target.value)} required>
                                            <option value="TODOS">TODAS LAS SECCIONES</option>
                                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" isLoading={submitting} className="px-12 py-4 rounded-2xl">
                                        Enviar Comunicado
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse text-slate-400">Cargando comunicados...</div>
                ) : announcements.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <span className="material-icons-outlined text-6xl opacity-20 mb-4">campaign</span>
                        <p className="font-black uppercase tracking-widest text-slate-400">No hay comunicados publicados</p>
                    </div>
                ) : (
                    announcements.map((item) => (
                        <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Card className="hover:shadow-xl transition-all border-none bg-white dark:bg-slate-900 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-4 rounded-full">
                                            <span className="material-icons-outlined text-primary text-3xl">notifications</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded">
                                                    Para: {item.target_grade === 'TODOS' ? 'General' : `${item.target_grade} - ${item.target_section}`}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{item.title}</h4>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
                                        <span className="material-icons-outlined">delete</span>
                                    </button>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
                                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AnnouncementsTab;
