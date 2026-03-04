import React, { useState } from 'react';
import { importStudents } from '../services/api';

interface ImportStudentsModalProps {
    onClose: () => void;
    onImportSuccess: () => void;
}

const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({ onClose, onImportSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ message: string, total_created: number, errors: string[] } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleImport = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const res = await importStudents(file);
            setResult(res);
            if (res.total_created > 0) {
                onImportSuccess();
            }
        } catch (error) {
            console.error(error);
            alert("Error al importar archivo. Asegúrate que sea un Excel (.xlsx) o CSV válido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Importar Alumnos</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                {!result ? (
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                            <p className="font-semibold mb-1">Instrucciones:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Sube un archivo <strong>Excel (.xlsx)</strong> o <strong>CSV</strong>.</li>
                                <li>Columnas requeridas: <strong>Nombre, Grado, Seccion, DNI</strong>.</li>
                                <li>Los alumnos se crearán sin foto. Deberás enrolar sus fotos después.</li>
                            </ul>
                        </div>

                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".xlsx,.xls,.csv"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <span className="material-icons-outlined text-4xl text-slate-400 mb-2">upload_file</span>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                                {file ? file.name : "Haz clic para seleccionar archivo"}
                            </p>
                        </div>

                        <button
                            onClick={handleImport}
                            disabled={!file || loading}
                            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Procesando...' : 'Iniciar Importación'}
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                            <span className="material-icons-outlined text-3xl">check</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Proceso Completado</h4>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Se crearon <strong>{result.total_created}</strong> estudiantes nuevos.
                        </p>

                        {result.errors.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg text-left mb-6 max-h-40 overflow-y-auto">
                                <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-1">Errores ({result.errors.length}):</p>
                                <ul className="list-disc pl-4 text-xs text-red-600 dark:text-red-300 space-y-1">
                                    {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportStudentsModal;
