import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            toast.success('Bienvenido al sistema');
            navigate('/admin');
        } catch (error) {
            console.error("Login failed", error);
            toast.error('Error de inicio de sesión. Verifique sus credenciales.');
        }
    };
    return (
        <div className="bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-100 font-display min-h-screen flex flex-col items-center justify-center overflow-hidden relative selection:bg-primary/20">
            {/* Background Decorators - SHARED WITH KIOSK */}
            <div className="cyber-grid-container pointer-events-none">
                <div className="cyber-grid" />
                <div className="neon-pulse" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_400px_rgba(0,0,0,0.9)]" />
            </div>

            <main className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in duration-700">
                {/* Brand Identity */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center mb-6">
                        <img src="/logo_eduasistencia.png" alt="EduAsistencia" className="h-20 w-auto object-contain drop-shadow-2xl" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">VerifID</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 text-xs font-bold uppercase tracking-[0.3em] opacity-70">Control Escolar Inteligente</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-slate-800 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
                    <div className="p-10 lg:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Username Field */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1" htmlFor="username">Usuario</label>
                                <div className="relative">
                                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-xl">person</span>
                                    <input
                                        className="w-full pl-12 pr-5 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white transition-all outline-none font-bold"
                                        id="username"
                                        type="text"
                                        placeholder="admin"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1" htmlFor="password">Contraseña</label>
                                <div className="relative">
                                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-xl">lock</span>
                                    <input
                                        className="w-full pl-12 pr-12 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white transition-all outline-none font-bold"
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                                    >
                                        <span className="material-icons text-xl">
                                            {showPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold uppercase tracking-[0.3em] py-5 rounded-2xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95 duration-200" type="submit">
                                <span>Ingresar</span>
                                <span className="material-icons text-xl">login</span>
                            </button>
                        </form>

                        {/* Security Badge */}
                        <div className="mt-10 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center gap-3 text-slate-400">
                            <span className="material-icons text-lg text-emerald-500">verified_user</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Encriptación Biométrica Activa</span>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <footer className="mt-10 flex flex-col items-center gap-6">
                    <div className="flex items-center bg-emerald-100/50 dark:bg-emerald-900/20 px-5 py-2 rounded-full border border-emerald-500/20 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Servidores Operativos</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                        <p className="text-[15px] font-bold text-slate-500">© {new Date().getFullYear()} Ingees services sac • v2.4.0</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Login;
