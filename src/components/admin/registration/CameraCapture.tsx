import React from 'react';
import Webcam from 'react-webcam';

interface CameraCaptureProps {
    webcamRef: React.RefObject<Webcam | null>;
    capturedImage: string | null;
    faceDetected: boolean;
    modelsLoaded: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
    webcamRef,
    capturedImage,
    faceDetected,
    modelsLoaded
}) => {
    return (
        <div className={`relative rounded-[2.5rem] overflow-hidden aspect-[3/4] bg-slate-900 border-4 transition-all duration-300 shadow-2xl ${faceDetected && !capturedImage ? 'border-green-500 ring-8 ring-green-500/10' : 'border-slate-100 dark:border-slate-800'
            }`}>
            {capturedImage ? (
                <img src={capturedImage} alt="Captura" className="w-full h-full object-cover animate-in fade-in zoom-in duration-300" />
            ) : (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover scale-x-[-1]"
                    videoConstraints={{
                        facingMode: "user",
                        aspectRatio: 0.75
                    }}
                />
            )}

            {/* Overlay Indicators */}
            {!capturedImage && modelsLoaded && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8">
                    <div className="w-full flex justify-between items-start">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${faceDetected ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-slate-900/40 border-slate-700/50 text-slate-400'
                            }`}>
                            {faceDetected ? 'Rostro Detectado' : 'Buscando Rostro'}
                        </div>
                    </div>

                    {/* GUIDES */}
                    <div className={`w-56 h-72 border-2 rounded-[60px] transition-all duration-500 ${faceDetected ? 'border-green-400 scale-105 opacity-80 shadow-[0_0_50px_rgba(74,222,128,0.2)]' : 'border-white/10 scale-100 opacity-40'
                        }`}></div>

                    <div className="text-center">
                        <p className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl backdrop-blur-md ${faceDetected ? 'bg-green-500 text-white shadow-xl shadow-green-500/30' : 'bg-black/40 text-slate-300'
                            }`}>
                            {faceDetected ? '¡Listo para capturar!' : 'Posicione el rostro'}
                        </p>
                    </div>
                </div>
            )}

            {!modelsLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-md text-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-black uppercase tracking-widest">Iniciando IA Facial...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;
