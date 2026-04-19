import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import { toast } from 'sonner';
import { getStudentPhotoUrl } from '../../../services/apiClient';

interface RegistrationSuccessCardProps {
    qrCode: string;
    studentName: string | null;
    photo: string | null;
    onReset: () => void;
}

const RegistrationSuccessCard: React.FC<RegistrationSuccessCardProps> = ({ qrCode, studentName, photo, onReset }) => {
    const handleDownload = () => {
        const canvas = document.getElementById(`qr-${qrCode}`) as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = pngUrl;
            link.download = `QR_${(studentName || 'estudiante').replace(/\s+/g, '_')}.png`;
            link.click();
        } else {
            toast.error("Error al generar imagen");
        }
    };

    return (
        <Card className="animate-in slide-in-from-right duration-500">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                    <span className="material-icons text-white text-4xl">check_circle</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">¡Registro Exitoso!</h3>
                <p className="text-slate-500 font-medium mb-8">El alumno ha sido enrolado correctamente.</p>

                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 mb-8 flex items-center gap-6 text-left">
                    <div className="w-24 h-32 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0 shadow-lg">
                        {photo ? (
                            <img src={getStudentPhotoUrl(photo) || ''} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="material-icons text-slate-400 text-3xl">person</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <Badge variant="success">Datos Registrados</Badge>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white truncate mt-2 mb-1">{studentName}</h4>
                        <p className="text-sm text-slate-500 font-mono">DNI: {qrCode.split('-')[0]}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] shadow-inner border border-slate-100 mb-8">
                    <QRCodeCanvas value={qrCode} size={180} id={`qr-${qrCode}`} level="H" includeMargin={true} />
                </div>

                <div className="space-y-3 w-full">
                    <Button onClick={handleDownload} className="w-full" variant="primary" icon="file_download">
                        Descargar Credencial QR
                    </Button>
                    <Button onClick={onReset} className="w-full" variant="secondary">
                        Registrar Nuevo Alumno
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default RegistrationSuccessCard;
