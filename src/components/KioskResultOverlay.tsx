import React from 'react';
import { type Student, getStudentPhotoUrl } from '../services/api';
import { type KioskStatus } from '../hooks/useKioskLogic';

interface KioskResultOverlayProps {
    status: KioskStatus;
    message: string;
    subMessage: string;
    student: Student | null;
}

const KioskResultOverlay: React.FC<KioskResultOverlayProps> = ({ status, message, subMessage, student }) => {
    if (status === 'IDLE' || status === 'PROCESSING') return null;

    const isWarning = status === 'WARNING';
    const isSuccess = status === 'SUCCESS';

    return (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/40 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl max-w-[85%] w-full text-center border border-white/20 dark:border-slate-800">
                <div className={`w-32 h-44 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden border-4 ${isSuccess ? 'border-green-500' : isWarning ? 'border-orange-500' : 'border-red-500'
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
                            <span className="material-icons text-6xl">{isSuccess ? 'person' : 'no_accounts'}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2 mb-6">
                    <h2 className={`text-2xl font-black uppercase tracking-tight ${isSuccess ? 'text-green-600' : isWarning ? 'text-orange-600' : 'text-red-600'
                        }`}>
                        {message}
                    </h2>
                    {student ? (
                        <div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{student.full_name}</p>
                            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-1">
                                {student.grade} • SEC "{student.section}"
                            </p>
                        </div>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{subMessage}</p>
                    )}
                </div>

                <div className={`py-3 px-6 rounded-2xl font-black text-sm uppercase tracking-widest animate-pulse text-white inline-block ${isSuccess ? 'bg-green-500' : isWarning ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                    {isSuccess ? 'Ingreso Autorizado' : isWarning ? 'Registro Duplicado' : 'Acceso Denegado'}
                </div>
            </div>
        </div>
    );
};

export default KioskResultOverlay;
