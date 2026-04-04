import React from 'react';
import { useUsersTab } from '../../hooks/tabs/useUsersTab';

interface UsersTabProps {
    isActiveTab: boolean;
}

const UsersTab: React.FC<UsersTabProps> = ({ isActiveTab }) => {
    const {
        users, loading, form, setForm, 
        editingUser, handleEdit, handleCancel, handleSubmit, handleDelete 
    } = useUsersTab();

    if (!isActiveTab) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Formulario de Usuario */}
            <div className="lg:col-span-5">
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 lg:p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] group">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <span className="material-icons-outlined text-3xl">person_add</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                                {editingUser ? 'Editar Usuario' : 'Nueva Cuenta'}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Gestión de Personal</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Nombre de Usuario</p>
                            <input className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required placeholder="EJ: JPEREZ" />
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Nombre Completo</p>
                            <input className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required placeholder="EJ: JUAN PEREZ" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Contraseña</p>
                                <input type="password" 
                                    className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm" 
                                    value={form.password} onChange={e => setForm({...form, password: e.target.value})} 
                                    required={!editingUser} 
                                    placeholder={editingUser ? "Dejar vacío para no cambiar" : "****"} 
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Rol del Sistema</p>
                                <select className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm appearance-none" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                                    <option value="DOCENTE">DOCENTE</option>
                                    <option value="DIRECTOR">DIRECTOR</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 py-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="hidden" checked={form.is_superuser} onChange={e => setForm({...form, is_superuser: e.target.checked})} />
                                <div className={`w-12 h-6 rounded-full transition-all relative ${form.is_superuser ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.is_superuser ? 'left-7' : 'left-1'}`}></div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Super Admin</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="hidden" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                                <div className={`w-12 h-6 rounded-full transition-all relative ${form.is_active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.is_active ? 'left-7' : 'left-1'}`}></div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Activo</span>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" disabled={loading} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50">
                                {loading ? 'Procesando...' : (editingUser ? 'Actualizar Cuenta' : 'Crear Usuario')}
                            </button>
                            {editingUser && (
                                <button type="button" disabled={loading} onClick={handleCancel} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Listado de Usuarios */}
            <div className="lg:col-span-7">
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 lg:p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                                <span className="material-icons-outlined text-3xl">manage_accounts</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                                    Lista de Personal
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Control de Usuarios Activos</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {users.map(u => (
                            <div key={u.id} className="p-6 bg-white/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex justify-between items-center group transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-black/5">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${
                                        u.is_superuser ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 
                                        u.role === 'ADMIN' ? 'bg-primary shadow-lg shadow-primary/20' : 
                                        u.role === 'DIRECTOR' ? 'bg-indigo-500' : 'bg-slate-400'
                                    }`}>
                                        {u.username.substring(0,2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">{u.full_name || u.username}</p>
                                            {u.is_superuser && (
                                                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded-lg uppercase">Super Admin</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                ID: {u.id} <span className="mx-2 opacity-20">|</span> 
                                                ROl: <span className="text-primary">{u.role}</span>
                                            </span>
                                            {!u.is_active && (
                                                <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black rounded-lg uppercase">Inactivo</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleEdit(u)}
                                        className="w-10 h-10 flex items-center justify-center text-primary bg-primary/10 dark:bg-primary/5 rounded-xl transition-all hover:bg-primary hover:text-white"
                                        title="Editar Usuario"
                                    >
                                        <span className="material-icons-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-500/10 dark:bg-red-500/5 rounded-xl transition-all hover:bg-red-500 hover:text-white"
                                        title="Eliminar Usuario"
                                    >
                                        <span className="material-icons-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersTab;
