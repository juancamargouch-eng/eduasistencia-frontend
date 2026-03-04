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
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 geometric-bg pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

            <main className="relative z-10 w-full max-w-md px-6">
                {/* Brand Identity */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4 shadow-lg shadow-primary/20">
                        <span className="material-icons text-white text-3xl">qr_code_scanner</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Portal</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Intelligent school attendance & security</p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="username">Username</label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white transition-all outline-none"
                                        id="username"
                                        type="text"
                                        placeholder="admin"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                                    <a className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors" href="#">Forgot Password?</a>
                                </div>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                                    <input
                                        className="w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white transition-all outline-none"
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                                    >
                                        <span className="material-icons text-lg">
                                            {showPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-slate-50 dark:bg-slate-800 dark:border-slate-700" id="remember" type="checkbox" />
                                <label className="ml-2 text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">Keep me signed in</label>
                            </div>

                            {/* Submit Button */}
                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center space-x-2" type="submit">
                                <span>Sign In to Dashboard</span>
                                <span className="material-icons text-sm">login</span>
                            </button>
                        </form>

                        {/* Security Badge */}
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-2 text-slate-400">
                            <span className="material-icons text-base">verified_user</span>
                            <span className="text-xs font-medium uppercase tracking-wider">Secure Biometric Encryption Active</span>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <footer className="mt-8 flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-6">
                        <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                        <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Terms of Service</a>
                    </div>
                    <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">System Operational</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Login;
