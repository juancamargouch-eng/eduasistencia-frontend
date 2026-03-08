import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

// Hooks & Components
import { useKioskLogic, type KioskStatus } from '../hooks/useKioskLogic';
import { useQRScanner } from '../hooks/useQRScanner';
import KioskResultOverlay from '../components/KioskResultOverlay';

const Kiosk: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [ambientFace, setAmbientFace] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [manualDni, setManualDni] = useState('');

    const { status, message, subMessage, lastStudent, handleVerification } = useKioskLogic(webcamRef, () => {
        setManualDni('');
        setShowManual(false);
    });

    useQRScanner({
        webcamRef,
        enabled: (status === 'IDLE' || status === 'SUCCESS' || status === 'WARNING' || status === 'ERROR') && !showManual && modelsLoaded,
        onDetected: (code) => handleVerification(code)
    });

    // Time & Models
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const load = async () => {
            try {
                await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri('/models'), faceapi.nets.faceLandmark68Net.loadFromUri('/models'), faceapi.nets.faceRecognitionNet.loadFromUri('/models')]);
                setModelsLoaded(true);
            } catch (e) { console.error(e); }
        };
        load();
        return () => clearInterval(timer);
    }, []);

    // Ambient Feedback Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'IDLE' && modelsLoaded && webcamRef.current?.video) {
            interval = setInterval(async () => {
                const detection = await faceapi.detectSingleFace(webcamRef.current!.video!, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }));
                setAmbientFace(!!detection);
            }, 600);
        }
        return () => clearInterval(interval);
    }, [status, modelsLoaded]);

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-hidden relative">
            <header className="p-8 flex justify-between items-center z-10 w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-5">
                    <img src="/logo_eduasistencia.png" alt="EduAsistencia Logo" className="h-24 w-auto object-contain" />
                </div>
                <div className="text-right">
                    <div className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white tabular-nums">
                        {currentTime.getHours().toString().padStart(2, '0')}<span className="text-primary animate-pulse">:</span>{currentTime.getMinutes().toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        {currentTime.toLocaleDateString('es-PE', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-8 pb-12 z-10">
                <StatusBadge status={status} />

                <div className={`relative w-full max-w-lg aspect-[3/4] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 ${ambientFace && status === 'IDLE' ? 'ring-[12px] ring-green-500/20' : 'ring-1 ring-white/10'
                    }`}>
                    {!modelsLoaded && <LoadingOverlay />}
                    <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment", aspectRatio: 0.75 }} className="w-full h-full object-cover" />

                    {status === 'IDLE' && !showManual && <ScannerOverlay faceDetected={ambientFace} />}
                    <KioskResultOverlay status={status} message={message} subMessage={subMessage} student={lastStudent} />

                    {showManual && (
                        <ManualInput
                            value={manualDni}
                            onChange={setManualDni}
                            onSubmit={(e) => { e.preventDefault(); handleVerification(undefined, manualDni); }}
                            onClose={() => setShowManual(false)}
                        />
                    )}
                </div>

                <div className="mt-10 grid grid-cols-2 gap-8 w-full max-w-4xl">
                    <ActionCard icon="qr_code_scanner" title="Escanear QR" desc="Acerque su carnet" active={!showManual} onClick={() => setShowManual(false)} />
                    <ActionCard icon="keyboard" title="Ingreso Manual" desc="Digite su DNI" active={showManual} onClick={() => setShowManual(true)} />
                </div>
            </main>
        </div>
    );
};

// Internal Sub-components
const StatusBadge = ({ status }: { status: KioskStatus }) => (
    <div className={`mb-8 flex items-center gap-3 px-6 py-3 rounded-full border shadow-sm transition-all ${status === 'IDLE' ? 'bg-white/80 dark:bg-slate-800/80 border-slate-200' : status === 'SUCCESS' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
        <div className={`w-3 h-3 rounded-full ${status === 'IDLE' ? 'bg-slate-400 animate-pulse' : 'bg-green-500'}`} />
        <span className="font-bold text-xs uppercase tracking-widest">{status === 'IDLE' ? 'Esperando Alumno...' : 'Procesando...'}</span>
    </div>
);

const LoadingOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900/90 backdrop-blur-md text-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xl font-bold uppercase tracking-widest">Iniciando IA...</p>
        </div>
    </div>
);

const ScannerOverlay = ({ faceDetected }: { faceDetected: boolean }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-between p-12 pointer-events-none">
        <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${faceDetected ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-slate-900/40 border-white/10 text-slate-400'}`}>
            {faceDetected ? 'Sistema Listo' : 'Buscando Rostro'}
        </div>
        <div className={`w-64 h-80 border-2 rounded-[60px] transition-all duration-700 relative ${faceDetected ? 'border-green-500 scale-105 opacity-100' : 'border-white/20 opacity-40'}`}>
            <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
            <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
            <div className={`w-full h-1 bg-primary/50 absolute top-1/2 animate-[scan_2s_linear_infinite] ${faceDetected ? 'opacity-100' : 'opacity-20'}`} />
        </div>
        <p className={`text-xs font-black uppercase px-6 py-3 rounded-2xl backdrop-blur-md ${faceDetected ? 'bg-green-500 text-white' : 'bg-black/40 text-slate-300'}`}>
            {faceDetected ? '¡Acerque su carnet QR!' : 'Frente a la pantalla'}
        </p>
    </div>
);

interface ManualInputProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

const ManualInput = ({ value, onChange, onSubmit, onClose }: ManualInputProps) => (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/60 backdrop-blur-xl p-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl w-full">
            <h2 className="text-2xl font-black text-center mb-1">Ingreso Manual</h2>
            <p className="text-xs text-center text-slate-500 mb-8 uppercase tracking-widest">Digite su DNI</p>
            <form onSubmit={onSubmit}>
                <input autoFocus value={value} onChange={e => onChange(e.target.value.replace(/\D/g, ''))} className="w-full text-center text-5xl font-black tracking-[0.3em] py-6 rounded-3xl bg-slate-50 mb-8 border-none focus:ring-2 focus:ring-primary" placeholder="00000000" maxLength={8} />
                <button type="submit" className="w-full py-5 rounded-3xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 mb-3">Verificar</button>
                <button type="button" onClick={onClose} className="w-full py-4 text-slate-400 font-bold uppercase text-xs">Cancelar</button>
            </form>
        </div>
    </div>
);

interface ActionCardProps {
    icon: string;
    title: string;
    desc: string;
    onClick: () => void;
    active: boolean;
}

const ActionCard = ({ icon, title, desc, onClick, active }: ActionCardProps) => (
    <div onClick={onClick} className={`bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-2 transition-all cursor-pointer flex items-center gap-6 group ${active ? 'border-primary ring-4 ring-primary/5' : 'border-slate-100 dark:border-slate-700'}`}>
        <div className={`p-5 rounded-2xl ${active ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 group-hover:bg-primary/10'}`}>
            <span className="material-icons text-4xl">{icon}</span>
        </div>
        <div><h3 className="font-black text-xl">{title}</h3><p className="text-sm text-slate-500 font-medium">{desc}</p></div>
    </div>
);

export default Kiosk;
