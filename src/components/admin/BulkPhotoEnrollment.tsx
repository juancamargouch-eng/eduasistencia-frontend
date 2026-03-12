import React, { useState } from 'react';
import { toast } from 'sonner';
import * as faceapi from 'face-api.js';
import { enrollByDni } from '../../services/api';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface BulkPhotoEnrollmentProps {
    onComplete?: () => void;
}

interface ProcessResult {
    filename: string;
    dni: string;
    status: 'pending' | 'processing' | 'success' | 'error';
    message?: string;
}

const BulkPhotoEnrollment: React.FC<BulkPhotoEnrollmentProps> = ({ onComplete }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [results, setResults] = useState<ProcessResult[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const MAX_FILES = 50;
    const MAX_TOTAL_SIZE = 70 * 1024 * 1024; // 70 MB

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // Check limits
            if (selectedFiles.length > MAX_FILES) {
                toast.error(`No puedes subir más de ${MAX_FILES} imágenes a la vez.`);
                return;
            }

            const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
            if (totalSize > MAX_TOTAL_SIZE) {
                toast.error(`El peso total de las imágenes (${(totalSize / 1024 / 1024).toFixed(2)} MB) excede el límite de 70 MB.`);
                return;
            }

            setFiles(selectedFiles);
            setResults(selectedFiles.map(f => ({
                filename: f.name,
                dni: f.name.split('.')[0].replace(/\D/g, ''),
                status: 'pending'
            })));
        }
    };

    const processImages = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setProgress(0);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const dni = file.name.split('.')[0].replace(/\D/g, '');

            setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'processing' } : r));

            try {
                // Read image and detect face
                const img = await faceapi.bufferToImage(file);
                const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (!detection) {
                    throw new Error("No se detectó rostro");
                }

                // Send to backend
                await enrollByDni(dni, file, JSON.stringify(Array.from(detection.descriptor)));

                setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'success' } : r));
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Error desconocido";
                console.error(`Error procesando ${file.name}:`, error);
                setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'error', message: errorMessage } : r));
            }

            setProgress(Math.round(((i + 1) / files.length) * 100));
        }

        setIsProcessing(false);
        toast.success("Proceso de enrolamiento masivo finalizado");
        if (onComplete) onComplete();
    };

    return (
        <Card title="Enrolamiento Masivo de Fotos" icon="photo_library" description="Sube fotos nombradas con el DNI o CE del alumno (Ej: 12345678.jpg, 00123456789.jpg)">
            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 bg-slate-50 dark:bg-slate-800/20">
                    <span className="material-icons-outlined text-5xl text-slate-300 mb-4">cloud_upload</span>
                    <p className="text-sm text-slate-500 mb-6 text-center max-w-xs">
                        Selecciona múltiples archivos JPG. El nombre del archivo debe ser el DNI del estudiante.
                    </p>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="bulk-photo-input"
                        disabled={isProcessing}
                    />
                    <label
                        htmlFor="bulk-photo-input"
                        className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Seleccionar Archivos
                    </label>
                </div>

                {files.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                {files.length} archivos seleccionados
                            </span>
                            {isProcessing && (
                                <span className="text-xs font-bold text-primary animate-pulse">
                                    Procesando... {progress}%
                                </span>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {isProcessing && (
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}

                        {/* Results List */}
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {results.map((res, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="material-icons-outlined text-slate-400 text-lg">image</span>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{res.filename}</span>
                                            <span className="text-[10px] text-slate-400">DNI: {res.dni}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {res.status === 'processing' && (
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        )}
                                        {res.status === 'success' && (
                                            <span className="material-icons text-green-500 text-xl font-bold">check_circle</span>
                                        )}
                                        {res.status === 'error' && (
                                            <div className="flex items-center gap-1 text-red-500">
                                                <span className="material-icons-outlined text-lg">error_outline</span>
                                                <span className="text-[10px] font-bold uppercase">{res.message}</span>
                                            </div>
                                        )}
                                        {res.status === 'pending' && (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">En espera</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="w-full"
                            onClick={processImages}
                            disabled={isProcessing || files.length === 0}
                            isLoading={isProcessing}
                        >
                            Iniciar Enrolamiento Masivo
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default BulkPhotoEnrollment;
