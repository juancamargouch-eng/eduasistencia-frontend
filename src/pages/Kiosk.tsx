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
    const [deviceId, setDeviceId] = useState(() => localStorage.getItem('kiosk_device_id') || 'Configurar Dispositivo');

    const handleDeviceSetup = () => {
        const newId = prompt("Ingrese el identificador para este Kiosko (ej. 'Tablet Entrada Principal'):", deviceId);
        if (newId && newId.trim() !== '') {
            localStorage.setItem('kiosk_device_id', newId.trim());
            setDeviceId(newId.trim());
        }
    };

    const { status, message, subMessage, lastStudent, eventType, handleVerification } = useKioskLogic(webcamRef, () => {
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
        <div className="bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-primary/20">
            {/* Background Decorators - Diseño Profesional: Cyber Grid Light */}
            <div className="cyber-grid-container pointer-events-none">
                {/* Cuadrícula Base con Movimiento e Inclinación Sutil */}
                <div className="cyber-grid" />
                
                {/* Pulsación de Neón Central Sutil (Light) */}
                <div className="neon-pulse" />

                {/* Viñeta suave para modo claro y fuerte para modo oscuro */}
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_400px_rgba(0,0,0,0.9)]" />
            </div>

            {/* Premium Navbar E10521 */}
            <nav className="bg-[#e10521] shadow-[0_10px_40px_-15px_rgba(225,5,33,0.5)] z-30 relative py-3 px-6 lg:px-12">
                <div className="max-w-[1900px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <img src="/logo_eduasistencia.png" alt="EduAsistencia Logo" className="h-10 lg:h-14 w-auto brightness-0 invert" />
                        <div className="h-8 w-px bg-white/20 hidden md:block"></div>
                        <div className="hidden md:flex flex-col cursor-pointer hover:opacity-80 transition-opacity" onDoubleClick={handleDeviceSetup} title="Doble clic para configurar ID del Kiosko">
                            <span className="text-white font-black text-sm tracking-tighter leading-none">VerifID</span>
                            <span className="text-white/80 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5 max-w-[150px] truncate">{deviceId}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-white">
                            <div className="text-right hidden sm:block">
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">
                                    {currentTime.toLocaleDateString('es-PE', { weekday: 'long' }).replace(',', '')}
                                </div>
                                <div className="text-xs font-black uppercase tracking-wider">
                                    {currentTime.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })}
                                </div>
                            </div>
                            <div className="h-10 w-px bg-white/20"></div>
                            <div className="text-3xl lg:text-5xl font-black tracking-tighter tabular-nums flex items-baseline gap-1">
                                {currentTime.getHours().toString().padStart(2, '0')}
                                <span className="text-white/40 animate-pulse-soft">:</span>
                                {currentTime.getMinutes().toString().padStart(2, '0')}
                                <span className="text-xs lg:text-sm opacity-40 ml-1 font-bold">
                                    {currentTime.getSeconds().toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center px-8 pb-12 z-10 w-full max-w-[1800px] mx-auto">
                <StatusBadge status={status} />

                <div className="flex flex-col xl:grid xl:grid-cols-[auto_1fr_auto] items-center justify-items-center gap-6 lg:gap-12 xl:gap-20 w-full">

                    {/* Column 1: User Guidance Tutorial - Visible only on XL+ for maximum breathing room */}
                    <div className="hidden xl:block w-[250px] shrink-0">
                        <TutorialPanel />
                    </div>

                    {/* Column 2: Camera (ELASTIC DOMINANT ELEMENT) */}
                    <div className={`relative w-full max-w-4xl aspect-[3/4] bg-slate-900 rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.7)] transition-all duration-700 ${ambientFace && status === 'IDLE' ? 'ring-[12px] lg:ring-[20px] ring-green-500/20' : 'ring-1 ring-white/10'
                        }`}>
                        {!modelsLoaded && <LoadingOverlay />}
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            mirrored={true}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "environment", aspectRatio: 0.75 }}
                            className="w-full h-full object-cover"
                        />

                        {status === 'IDLE' && !showManual && <ScannerOverlay faceDetected={ambientFace} />}

                        {showManual && (
                            <ManualInput
                                value={manualDni}
                                onChange={setManualDni}
                                onSubmit={(e) => { e.preventDefault(); handleVerification(undefined, manualDni); }}
                                onClose={() => setShowManual(false)}
                            />
                        )}
                    </div>

                    {/* Column 3: Compact Side Controls - Side by side on small screens, vertical on Desktop */}
                    <div className="flex flex-row lg:grid lg:grid-cols-1 gap-4 w-full xl:w-[250px] shrink-0 mt-8 xl:mt-0 max-w-4xl">
                        <ActionCard icon="qr_code_scanner" title="Escaneo QR" desc="Modo Automático" active={!showManual} onClick={() => setShowManual(false)} />
                        <ActionCard icon="keyboard" title="Ingreso Manual" desc="Protocolo DNI" active={showManual} onClick={() => setShowManual(true)} />
                    </div>
                </div>
            </main>

            {/* Global Results Modal (Popup) */}
            <KioskResultOverlay status={status} message={message} subMessage={subMessage} student={lastStudent} eventType={eventType} />
        </div>
    );
};

// Internal Sub-components
const StatusBadge = ({ status }: { status: KioskStatus }) => (
    <div className={`mb-8 mt-4 flex items-center gap-4 px-6 py-3 rounded-2xl shadow-xl transition-all duration-500 glass ${status === 'IDLE' ? 'border-primary/10' : status === 'SUCCESS' ? 'bg-green-500/10 border-green-200 text-green-700 dark:text-green-400' : 'bg-amber-500/10 border-amber-200 text-amber-700 dark:text-amber-400'
        }`}>
        <div className="relative">
            <div className={`w-3 h-3 rounded-full ${status === 'IDLE' ? 'bg-primary' : 'bg-green-500'} animate-ping absolute inset-0 opacity-20`} />
            <div className={`w-3 h-3 rounded-full ${status === 'IDLE' ? 'bg-primary' : 'bg-green-500'} relative z-10`} />
        </div>
        <span className="font-extrabold text-[10px] uppercase tracking-[0.2em]">{status === 'IDLE' ? 'Esperando Identificación' : 'Procesando Solicitud'}</span>
    </div>
);

const TutorialPanel = () => (
    <div className="p-8 rounded-[2.5rem] glass border-white/10 flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-1">
            <h3 className="text-xl font-extrabold tracking-tight">Guía de Ingreso</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold opacity-70">Siga estos pasos</p>
        </div>

        <div className="flex flex-col gap-8 relative">
            {/* Step 1 */}
            <div className="flex gap-5 items-start relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-icons text-primary text-xl">face</span>
                </div>
                <div>
                    <h4 className="font-bold text-sm">Posicionamiento</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Mire a la cámara y encuadre su rostro.</p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-5 items-start relative z-10">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                    <span className="material-icons text-green-500 text-xl">check_circle</span>
                </div>
                <div>
                    <h4 className="font-bold text-sm">Validación Visual</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Espere a que aparezca el marco verde.</p>
                </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-5 items-start relative z-10">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <span className="material-icons text-indigo-500 text-xl">qr_code</span>
                </div>
                <div>
                    <h4 className="font-bold text-sm">Identificación</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Acerque su carnet QR al lector.</p>
                </div>
            </div>

            {/* Connecting Line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-primary/30 via-green-500/30 to-indigo-500/30 -z-0" />
        </div>
    </div>
);

const LoadingOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center z-20 glass text-white text-center">
        <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(19,91,236,0.5)]" />
            <div className="flex flex-col items-center">
                <p className="text-lg font-extrabold uppercase tracking-[0.4em]">Iniciando</p>
                <p className="text-[9px] font-bold text-primary/50 uppercase tracking-widest mt-1">Biometric System v2.4</p>
            </div>
        </div>
    </div>
);

const ScannerOverlay = ({ faceDetected }: { faceDetected: boolean }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-between p-6 lg:p-12 xl:p-16 pointer-events-none">
        <div className={`px-4 lg:px-8 py-2 lg:py-3 rounded-full text-[10px] lg:text-sm font-extrabold uppercase tracking-[0.3em] lg:tracking-[0.4em] transition-all duration-500 border ${faceDetected ? 'bg-green-500 border-green-400 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)] scale-110 opacity-100' : 'bg-slate-900/60 border-white/20 text-slate-300 opacity-80'}`}>
            {faceDetected ? 'Rostro Optimizado' : 'Escaneando Entorno'}
        </div>
        <div className={`w-[85%] lg:w-[80%] h-[55%] lg:h-[60%] border rounded-[40px] lg:rounded-[100px] transition-all duration-1000 relative ${faceDetected ? 'border-green-500 shadow-[0_0_80px_rgba(34,197,94,0.4)] scale-[1.05] opacity-100' : 'border-white/10 opacity-30 shadow-none'}`}>
            <div className="absolute -top-1 -left-1 w-10 lg:w-20 h-10 lg:h-20 border-t-2 border-l-2 border-primary rounded-tl-[30px] lg:rounded-tl-[60px]" />
            <div className="absolute -top-1 -right-1 w-10 lg:w-20 h-10 lg:h-20 border-t-2 border-r-2 border-primary rounded-tr-[30px] lg:rounded-tr-[60px]" />
            <div className="absolute -bottom-1 -left-1 w-10 lg:w-20 h-10 lg:h-20 border-b-2 border-l-2 border-primary rounded-bl-[30px] lg:rounded-bl-[60px]" />
            <div className="absolute -bottom-1 -right-1 w-10 lg:w-20 h-10 lg:h-20 border-b-2 border-r-2 border-primary rounded-br-[30px] lg:rounded-br-[60px]" />
            <div className={`w-full h-[2px] bg-primary/60 absolute top-1/2 shadow-[0_0_20px_rgba(19,91,236,1)] animate-[scan_3s_ease-in-out_infinite] ${faceDetected ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        <p className={`text-[10px] lg:text-sm font-extrabold uppercase px-8 lg:px-16 py-4 lg:py-8 rounded-[1.5rem] lg:rounded-[2.5rem] text-center transition-all duration-500 border-2 ${faceDetected ? 'bg-green-500 text-white shadow-[0_0_60px_rgba(34,197,94,0.8)] border-green-300 animate-border-blink scale-105 lg:scale-110 opacity-100' : 'bg-black/80 text-slate-200 border-transparent opacity-60'}`}>
            {faceDetected ? 'Por favor presente su Carnet QR' : 'Posicione el rostro dentro de la guía'}
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
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-2xl p-6">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-[0_100px_150px_-50px_rgba(0,0,0,0.8)] w-full border border-white/10 relative overflow-hidden text-center">
            <h2 className="text-2xl font-extrabold mb-1 tracking-tighter">Ingreso Manual</h2>
            <p className="text-[9px] text-slate-400 mb-8 uppercase tracking-[0.4em] font-bold">Protocolo de Identificación</p>
            <form onSubmit={onSubmit}>
                <input autoFocus value={value} onChange={e => onChange(e.target.value.replace(/\D/g, ''))} className="w-full text-center text-5xl font-extrabold tracking-[0.2em] py-6 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/50 mb-8 border border-slate-200 dark:border-white/5 focus:ring-4 focus:ring-primary/20 transition-all outline-none" placeholder="8-12 DÍGITOS" maxLength={12} />
                <button type="submit" className="w-full py-5 rounded-[1.5rem] bg-primary text-white font-extrabold uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/30 mb-3 hover:translate-y-[-4px] active:translate-y-[2px] transition-all duration-300">Verificar</button>
                <button type="button" onClick={onClose} className="w-full py-3 text-slate-500 font-bold uppercase text-[9px] tracking-widest hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Cancelar</button>
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
    <div onClick={onClick} className={`p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-2xl border transition-all duration-500 cursor-pointer flex items-center lg:gap-5 gap-3 group relative overflow-hidden flex-1 lg:flex-none ${active ? 'bg-white dark:bg-slate-800 border-primary ring-[6px] lg:ring-[10px] ring-primary/5 scale-[1.02]' : 'bg-white/40 dark:bg-slate-950/40 border-transparent hover:border-slate-300 dark:hover:border-white/10 backdrop-blur-[40px]'}`}>
        <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-500 shadow-inner ${active ? 'bg-primary text-white shadow-[0_10px_20px_-5px_rgba(19,91,236,0.5)]' : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
            <span className="material-icons text-xl lg:text-3xl">{icon}</span>
        </div>
        <div className="z-10 overflow-hidden">
            <h3 className="font-bold text-sm lg:text-lg tracking-tight mb-0.5 truncate">{title}</h3>
            <p className="text-[8px] lg:text-[9px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest opacity-60 truncate">{desc}</p>
        </div>
        {active && <div className="absolute top-0 right-0 p-2 lg:p-3"><div className="w-1 lg:w-1.5 h-1 lg:h-1.5 rounded-full bg-primary animate-ping" /></div>}
    </div>
);

export default Kiosk;
