import React from 'react';
import Webcam from 'react-webcam';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { type Schedule } from '../../services/api';

// Sub-componentes
import CameraCapture from './registration/CameraCapture';
import RegistrationSuccessCard from './registration/RegistrationSuccessCard';

interface RegistrationTabProps {
    fullName: string; setFullName: (val: string) => void;
    dni: string; setDni: (val: string) => void;
    grade: string; setGrade: (val: string) => void;
    section: string; setSection: (val: string) => void;
    scheduleId: string; setScheduleId: (val: string) => void;
    telegramChatId: string; setTelegramChatId: (val: string) => void;
    notifyTelegram: boolean; setNotifyTelegram: (val: boolean) => void;
    capturedImage: string | null; setCapturedImage: (val: string | null) => void;
    registeredQR: string | null; setRegisteredQR: (val: string | null) => void;
    registeredName: string | null;
    loading: boolean;
    modelsLoaded: boolean;
    grades: string[];
    sections: string[];
    schedules: Schedule[];
    capture: () => void;
    onSubmit: (e: React.FormEvent) => void;
    webcamRef: React.RefObject<Webcam | null>;
    faceDetected: boolean;
    lastRegisteredPhoto: string | null;
}

const RegistrationTab: React.FC<RegistrationTabProps> = (props) => {
    const { registeredQR, registeredName, lastRegisteredPhoto, setRegisteredQR } = props;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
            <Card title="Nuevo Alumno" description="Ingrese los datos y capture la foto facial" icon="person_add">
                <form onSubmit={props.onSubmit} className="space-y-6">
                    <Input label="Nombre Completo" value={props.fullName} onChange={e => props.setFullName(e.target.value)} required />
                    <Input label="DNI" value={props.dni} maxLength={8} onChange={e => props.setDni(e.target.value.replace(/\D/g, ''))} required font-mono />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Grado</label>
                            <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/50" value={props.grade} onChange={e => props.setGrade(e.target.value)} required>
                                <option value="">Seleccionar</option>
                                {props.grades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Sección</label>
                            <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/50" value={props.section} onChange={e => props.setSection(e.target.value)} required>
                                <option value="">Seleccionar</option>
                                {props.sections.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Turno (Opcional)</label>
                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/50" value={props.scheduleId} onChange={e => props.setScheduleId(e.target.value)}>
                            <option value="">Sin Horario</option>
                            {props.schedules.map(s => <option key={s.id} value={s.id}>{s.name} ({s.start_time})</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <Input label="Telegram Chat ID" value={props.telegramChatId} placeholder="@usuario" onChange={e => props.setTelegramChatId(e.target.value)} />
                        <div className="flex flex-col justify-center gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Notificaciones</label>
                            <button type="button" onClick={() => props.setNotifyTelegram(!props.notifyTelegram)} className={`w-12 h-6 rounded-full relative transition-colors ${props.notifyTelegram ? 'bg-primary' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${props.notifyTelegram ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <CameraCapture
                        webcamRef={props.webcamRef}
                        capturedImage={props.capturedImage}
                        faceDetected={props.faceDetected}
                        modelsLoaded={props.modelsLoaded}
                    />

                    <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="secondary" onClick={props.capturedImage ? () => props.setCapturedImage(null) : props.capture} className="flex-1">
                            {props.capturedImage ? 'Reintentar Foto' : 'Capturar Cara'}
                        </Button>
                        <Button type="submit" isLoading={props.loading} disabled={!props.modelsLoaded || !props.capturedImage} className="flex-2">
                            Registrar Alumno
                        </Button>
                    </div>
                </form>
            </Card>

            <div className="sticky top-0">
                {registeredQR ? (
                    <RegistrationSuccessCard qrCode={registeredQR} studentName={registeredName} photo={lastRegisteredPhoto} onReset={() => setRegisteredQR(null)} />
                ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-12 text-center h-[600px] flex flex-col items-center justify-center text-slate-400">
                        <span className="material-icons-outlined text-6xl mb-4 opacity-20">qr_code_scanner</span>
                        <p className="font-bold uppercase tracking-widest text-xs">A espera de registro...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationTab;
