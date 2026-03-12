import React from 'react';
import { type Student, getStudentPhotoUrl } from '../services/api';
import { type KioskStatus } from '../hooks/useKioskLogic';

interface KioskResultOverlayProps {
    status: KioskStatus;
    message: string;
    subMessage: string;
    student: Student | null;
    eventType?: 'ENTRY' | 'EXIT';
}

const KioskResultOverlay: React.FC<KioskResultOverlayProps> = ({ status, message, subMessage, student, eventType }) => {
    if (status === 'IDLE' || status === 'PROCESSING') return null;

    const isWarning = status === 'WARNING';
    const isSuccess = status === 'SUCCESS';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
            {/* Ultra-Blur Backdrop */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-3xl animate-in fade-in duration-500" />
            
            {/* Modal Card */}
            <div className={`relative bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] max-w-lg w-full text-center border border-white/20 dark:border-slate-800 animate-in zoom-in slide-in-from-bottom-12 duration-500 transition-all ${
                isSuccess ? (eventType === 'EXIT' ? 'ring-2 ring-blue-500/20' : 'ring-2 ring-green-500/20') : 
                isWarning ? 'ring-2 ring-orange-500/20' : 'ring-2 ring-red-500/20'
            }`}>
                
                {/* Visual Status Indicator */}
                <div className={`w-36 h-48 lg:w-44 lg:h-56 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl overflow-hidden border-4 bg-slate-100 dark:bg-slate-800 transition-all duration-700 ${
                    isSuccess ? (eventType === 'EXIT' ? 'border-blue-500 shadow-blue-500/20 scale-105' : 'border-green-500 shadow-green-500/20 scale-105') : 
                    isWarning ? 'border-orange-500 shadow-orange-500/20' : 
                    'border-red-500 shadow-red-500/20 scale-95'
                }`}>
                    {student?.photo_url ? (
                        <img
                            src={getStudentPhotoUrl(student.photo_url) || ''}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://www.w3schools.com/howto/img_avatar.png')}
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            <span className="material-icons text-7xl lg:text-8xl">{isSuccess ? 'person' : 'no_accounts'}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-3 mb-8">
                    <h2 className={`text-3xl lg:text-4xl font-extrabold tracking-tighter uppercase ${
                        isSuccess ? (eventType === 'EXIT' ? 'text-blue-600' : 'text-green-600') : 
                        isWarning ? 'text-orange-600' : 'text-red-600'
                    }`}>
                        {message}
                    </h2>
                    
                    {student ? (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
                            <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-2">{student.full_name}</p>
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20">
                                <span className="material-icons text-primary text-sm">school</span>
                                <span className="text-[10px] lg:text-xs font-black text-primary uppercase tracking-[0.2em]">
                                    {student.grade} • SECCIÓN "{student.section}"
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-lg font-bold text-slate-500 dark:text-slate-400 mt-2">{subMessage}</p>
                    )}
                </div>

                <div className={`py-4 px-8 rounded-2xl font-black text-xs lg:text-sm uppercase tracking-[0.3em] animate-pulse-soft text-white inline-flex items-center gap-3 ${
                    isSuccess ? (eventType === 'EXIT' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-green-500 shadow-lg shadow-green-500/30') : 
                    isWarning ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 
                    'bg-red-500 shadow-lg shadow-red-500/30'
                }`}>
                    <span className="material-icons text-lg">{isSuccess ? (eventType === 'EXIT' ? 'logout' : 'verified') : isWarning ? 'history' : 'error'}</span>
                    {isSuccess ? (eventType === 'EXIT' ? 'Salida Autorizada' : 'Ingreso Autorizado') : isWarning ? 'Registro Duplicado' : 'Acceso Denegado'}
                </div>
            </div>
        </div>
    );
};

export default KioskResultOverlay;
