import React, { useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import * as faceapi from 'face-api.js';
import { importStudents, checkPhotos, enrollByS3Key } from '../services/api';

interface ImportStudentsModalProps {
    onClose: () => void;
    onImportSuccess: () => void;
}

interface SmartSyncStatus {
    dni: string;
    status: 'pending' | 'checking' | 'processing' | 'success' | 'notFound' | 'error';
    message?: string;
}

const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({ onClose, onImportSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [syncStatus, setSyncStatus] = useState<SmartSyncStatus[]>([]);
    const [step, setStep] = useState<'upload' | 'importing' | 'syncing' | 'completed'>('upload');
    const [result, setResult] = useState<{ total_created: number, errors: string[] }>({ total_created: 0, errors: [] });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const runSmartSync = async (dnis: string[]) => {
        setStep('syncing');
        const initialStatus = dnis.map(dni => ({ dni, status: 'pending' as const }));
        setSyncStatus(initialStatus);

        // 1. Check which photos exist in S3
        try {
            const foundPhotos = await checkPhotos(dnis);
            const foundDnis = new Set(foundPhotos.map(p => p.dni));

            setSyncStatus(prev => prev.map(s => foundDnis.has(s.dni) ? { ...s, status: 'checking' } : { ...s, status: 'notFound' }));

            // 2. Process each found photo
            for (let i = 0; i < foundPhotos.length; i++) {
                const photoInfo = foundPhotos[i];

                setSyncStatus(prev => prev.map(s => s.dni === photoInfo.dni ? { ...s, status: 'processing' } : s));

                try {
                    // Download image securely via signed URL
                    const img = await faceapi.fetchImage(photoInfo.photo_url);
                    const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                        .withFaceLandmarks()
                        .withFaceDescriptor();

                    if (!detection) {
                        throw new Error("No se detectó rostro");
                    }

                    // Send descriptor to backend
                    await enrollByS3Key(photoInfo.dni, photoInfo.s3_key, JSON.stringify(Array.from(detection.descriptor)));

                    setSyncStatus(prev => prev.map(s => s.dni === photoInfo.dni ? { ...s, status: 'success' } : s));
                } catch (err: any) {
                    console.error(`Error procesando foto S3 para ${photoInfo.dni}:`, err);
                    setSyncStatus(prev => prev.map(s => s.dni === photoInfo.dni ? { ...s, status: 'error', message: err.message } : s));
                }

                setSyncProgress(Math.round(((i + 1) / foundPhotos.length) * 100));
            }
        } catch (err) {
            console.error("Error en Smart Sync:", err);
            toast.error("Error al verificar fotos en S3");
        }

        setStep('completed');
    };

    const handleImport = async () => {
        if (!file) return;
        setLoading(true);
        setStep('importing');

        try {
            // Read DNI list from excel first to prepare sync
            const reader = new FileReader();
            const dnisFromExcel: string[] = await new Promise((resolve) => {
                reader.onload = (e) => {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const json: any[] = XLSX.utils.sheet_to_json(sheet);

                    const dnis = json.map(row => {
                        const dniKey = Object.keys(row).find(k => k.toLowerCase().includes('dni'));
                        return dniKey ? String(row[dniKey]).replace(/\D/g, '') : null;
                    }).filter(Boolean) as string[];

                    resolve(dnis);
                };
                reader.readAsBinaryString(file);
            });

            // Call Backend Import
            const res = await importStudents(file);
            setResult(res);

            if (res.total_created > 0) {
                onImportSuccess();
                // Start Smart Sync
                await runSmartSync(dnisFromExcel);
            } else {
                setStep('completed');
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al importar el archivo.");
            setStep('upload');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200/50 dark:border-slate-800/50">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <span className="material-icons-outlined">sync_alt</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Importación Inteligente</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Excel + Sincronización S3</p>
                        </div>
                    </div>
                    {step === 'upload' && (
                        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                            <span className="material-icons-outlined text-slate-400">close</span>
                        </button>
                    )}
                </div>

                {step === 'upload' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-500/5 p-5 rounded-2xl border border-blue-100 dark:border-blue-500/20 text-sm">
                            <p className="font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest text-[10px] mb-2">Instrucciones de Seguridad</p>
                            <ul className="space-y-2 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                <li className="flex gap-2"><span className="text-blue-500">●</span> Sube un Excel (.xlsx) con Apellidos, Nombres, Grado, Sección y DNI.</li>
                                <li className="flex gap-2"><span className="text-blue-500">●</span> <strong className="text-blue-700 dark:text-blue-300">Smart Sync:</strong> Buscaremos fotos en S3 que se llamen como el DNI.</li>
                                <li className="flex gap-2"><span className="text-blue-500">●</span> Las fotos se jalarán de forma privada y segura para procesar la IA.</li>
                            </ul>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".xlsx,.xls,.csv"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center group-hover:border-primary/50 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/30 transition-all">
                                <span className="material-icons-outlined text-5xl text-slate-300 group-hover:text-primary/50 mb-4 transition-colors">upload_file</span>
                                <p className="text-slate-800 dark:text-slate-200 font-black uppercase tracking-tight">
                                    {file ? file.name : "Seleccionar Archivo Excel"}
                                </p>
                                <p className="text-xs text-slate-400 font-bold mt-1">Arrastra o haz clic para buscar</p>
                            </div>
                        </div>

                        <button
                            onClick={handleImport}
                            disabled={!file || loading}
                            className="w-full py-4 bg-primary text-white rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all font-black uppercase tracking-widest text-sm disabled:opacity-50"
                        >
                            Comenzar Importación
                        </button>
                    </div>
                )}

                {(step === 'importing' || step === 'syncing') && (
                    <div className="text-center py-10 space-y-6">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                            <div
                                className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                                style={{ animationDuration: '1.5s' }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-icons text-primary text-3xl animate-pulse">
                                    {step === 'importing' ? 'description' : 'face'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                {step === 'importing' ? 'Creando Alumnos...' : 'Sincronizando con S3...'}
                            </h4>
                            <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-widest">
                                {step === 'syncing' ? `Procesando Fotos: ${syncProgress}%` : 'Leyendo base de datos'}
                            </p>
                        </div>

                        {step === 'syncing' && (
                            <div className="max-h-40 overflow-y-auto space-y-2 mt-6 pr-2 custom-scrollbar">
                                {syncStatus.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                                        <span className="font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter">DNI: {s.dni}</span>
                                        <div className="flex items-center gap-2">
                                            {s.status === 'processing' && <span className="text-primary font-bold animate-pulse uppercase tracking-[2px]">Procesando IA</span>}
                                            {s.status === 'success' && <span className="text-green-500 font-bold uppercase tracking-widest flex items-center gap-1"><span className="material-icons text-sm">check_circle</span> Éxito</span>}
                                            {s.status === 'notFound' && <span className="text-slate-400 font-bold uppercase tracking-widest">Sin foto</span>}
                                            {s.status === 'error' && <span className="text-red-500 font-bold uppercase tracking-widest">Error IA</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {step === 'completed' && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400 rotate-12">
                            <span className="material-icons text-4xl">inventory_2</span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-2">Importación Finalizada</h4>
                        <div className="space-y-1 mb-8">
                            <p className="text-slate-600 dark:text-slate-400 font-bold">Base de datos: <span className="text-primary">{result.total_created}</span> alumnos creados</p>
                            <p className="text-slate-600 dark:text-slate-400 font-bold">Fotos: <span className="text-green-500">{syncStatus.filter(s => s.status === 'success').length}</span> sincronizadas con éxito</p>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-500/5 p-4 rounded-2xl text-left mb-8 max-h-40 overflow-y-auto border border-red-100 dark:border-red-500/10">
                                <p className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase tracking-widest mb-2">Errores de Fila ({result.errors.length}):</p>
                                <ul className="space-y-1 text-[10px] text-red-600 dark:text-red-300 font-bold uppercase">
                                    {result.errors.map((e, i) => <li key={i} className="flex gap-2"><span>-</span> {e}</li>)}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Finalizar Salir
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportStudentsModal;
