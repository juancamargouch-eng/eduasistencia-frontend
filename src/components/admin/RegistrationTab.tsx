import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { type Schedule } from '../../services/api';

// Sub-componentes
import CameraCapture from './registration/CameraCapture';
import RegistrationSuccessCard from './registration/RegistrationSuccessCard';

import { useRegistrationTab } from '../../hooks/tabs/useRegistrationTab';

interface RegistrationTabProps {
    grades: string[];
    sections: string[];
    schedules: Schedule[];
    isActiveTab: boolean;
}

const RegistrationTab: React.FC<RegistrationTabProps> = ({
    grades, sections, schedules, isActiveTab
}) => {
    const {
        webcamRef,
        loading, modelsLoaded, faceDetected,
        firstName, setFirstName,
        lastName, setLastName,
        dni, setDni,
        grade, setGrade,
        section, setSection,
        scheduleId, setScheduleId,
        telegramChatId, setTelegramChatId,
        notifyTelegram, setNotifyTelegram,
        capturedImage, setCapturedImage,
        registeredQR, setRegisteredQR,
        registeredName, lastRegisteredPhoto,
        capturePhoto,
        handleSubmitRegister
    } = useRegistrationTab(isActiveTab);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
            <Card 
                title="Nuevo Estudiante" 
                description="Registro biométrico y generación de credencial única" 
                icon="person_add"
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border-white dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]"
            >
                <form onSubmit={handleSubmitRegister} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Apellidos</p>
                            <Input value={lastName} onChange={e => setLastName(e.target.value.toUpperCase())} required placeholder="EJ: GARCÍA PÉREZ" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Nombres</p>
                            <Input value={firstName} onChange={e => setFirstName(e.target.value.toUpperCase())} required placeholder="EJ: JUAN ALBERTO" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Documento Nacional de Identidad</p>
                        <Input icon="badge" value={dni} maxLength={12} onChange={e => setDni(e.target.value.replace(/\D/g, ''))} required font-mono placeholder="8-12 DÍGITOS" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Grado Académico</label>
                            <select className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm" value={grade} onChange={e => setGrade(e.target.value)} required>
                                <option value="">Seleccionar</option>
                                {grades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Sección</label>
                            <select className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm" value={section} onChange={e => setSection(e.target.value)} required>
                                <option value="">Seleccionar</option>
                                {sections.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Horario de Ingreso (Opcional)</label>
                        <select className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800 border-none outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm" value={scheduleId} onChange={e => setScheduleId(e.target.value)}>
                            <option value="">Sin Horario Asignado</option>
                            {schedules.map(s => <option key={s.id} value={s.id}>{s.name} [{s.start_time}]</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-slate-800/20 p-8 rounded-3xl border border-slate-100 dark:border-slate-800/50 backdrop-blur-md">
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                <span className="material-icons text-sm">notifications_active</span>
                                Telegram ID
                            </p>
                            <Input value={telegramChatId} placeholder="@ID_CHAT" onChange={e => setTelegramChatId(e.target.value)} />
                        </div>
                        <div className="flex flex-col justify-end gap-3 pb-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Notificaciones Push</label>
                            <button type="button" onClick={() => setNotifyTelegram(!notifyTelegram)} className={`w-14 h-7 rounded-full relative transition-all duration-300 ${notifyTelegram ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1.5 left-1.5 w-4 h-4 bg-white rounded-full transition-all duration-300 ${notifyTelegram ? 'translate-x-7' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800/50 pt-8 mt-4">
                        <CameraCapture
                            webcamRef={webcamRef}
                            capturedImage={capturedImage}
                            faceDetected={faceDetected}
                            modelsLoaded={modelsLoaded}
                        />

                        <div className="flex gap-4 mt-8">
                            <Button type="button" variant="secondary" onClick={capturedImage ? () => setCapturedImage(null) : capturePhoto} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-transform">
                                <span className="material-icons-outlined text-lg">{capturedImage ? 'refresh' : 'photo_camera'}</span>
                                {capturedImage ? 'Reintentar' : 'Capturar'}
                            </Button>
                            <Button type="submit" isLoading={loading} disabled={!modelsLoaded || !capturedImage} className="flex-[2] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] active:scale-95 transition-transform">
                                Registrar Estudiante
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>

            <div className="sticky top-0 lg:h-fit">
                {registeredQR ? (
                    <RegistrationSuccessCard qrCode={registeredQR} studentName={registeredName} photo={lastRegisteredPhoto} onReset={() => setRegisteredQR(null)} />
                ) : (
                    <div 
                        className="bg-white/40 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-12 text-center min-h-[600px] flex flex-col items-center justify-center text-slate-400 backdrop-blur-md group animate-in fade-in zoom-in duration-700"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-8 border border-slate-200 dark:border-slate-800 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                            <span className="material-icons-outlined text-6xl opacity-30 group-hover:opacity-50 transition-opacity" aria-hidden="true">qr_code_scanner</span>
                        </div>
                        <p className="font-black uppercase tracking-[0.4em] text-xs opacity-50 mb-3">A la espera de registro</p>
                        <p className="text-[10px] font-bold opacity-30 max-w-[200px] leading-relaxed">Complete el formulario de la izquierda para generar la credencial biométrica</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationTab;
