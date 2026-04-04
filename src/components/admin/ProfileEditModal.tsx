import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getMe, updateCurrentUser, type AdminUser } from '../../services/api';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (user: AdminUser) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (isOpen) {
            loadUserData();
        }
    }, [isOpen]);

    const loadUserData = async () => {
        try {
            const user = await getMe();
            setFormData({
                full_name: user.full_name || '',
                username: user.username || '',
                password: '',
                confirmPassword: ''
            });
        } catch (error: unknown) {
            console.error("Error al cargar datos del perfil", error);
            toast.error("Error al cargar datos del perfil");
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const updateData: {
                full_name: string;
                username: string;
                password?: string;
            } = {
                full_name: formData.full_name,
                username: formData.username
            };
            
            if (formData.password) {
                updateData.password = formData.password;
            }

            const updatedUser = await updateCurrentUser(updateData);
            toast.success("Perfil actualizado correctamente");
            
            // Limpiar campos de contraseña para la próxima vez
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));

            onUpdate(updatedUser);
            onClose();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { detail?: string } } };
            toast.error(err.response?.data?.detail || "Error al actualizar perfil");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-all animate-in fade-in duration-300" onClick={onClose}></div>
            
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-icons-outlined">manage_accounts</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Editar Perfil</h2>
                            <p className="text-xs text-slate-500">Configuración de cuenta</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nombre Completo</label>
                        <div className="relative">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">badge</span>
                            <input 
                                type="text"
                                value={formData.full_name}
                                onChange={e => setFormData({...formData, full_name: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                placeholder="Ej: Administrador General"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nombre de Usuario</label>
                        <div className="relative">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">alternate_email</span>
                            <input 
                                type="text"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Seguridad (Opcional)</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nueva Contraseña</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lock_open</span>
                                    <input 
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Confirmar Contraseña</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lock</span>
                                    <input 
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
