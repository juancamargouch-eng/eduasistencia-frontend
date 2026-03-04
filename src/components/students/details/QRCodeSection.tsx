import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'sonner';
import Button from '../../ui/Button';

interface QRCodeSectionProps {
    qrCodeHash: string;
    studentName: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ qrCodeHash, studentName }) => {
    const handleDownload = () => {
        const canvas = document.getElementById(`student-qr-${qrCodeHash}`) as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = pngUrl;
            link.download = `QR_${studentName.replace(/\s+/g, '_')}.png`;
            link.click();
        } else {
            toast.error("Error al generar imagen");
        }
    };

    return (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-4 text-center">
            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6">Credencial de Acceso QR</p>

            <div className="bg-white p-6 rounded-2xl shadow-inner border border-slate-100 inline-block mb-6">
                <QRCodeCanvas
                    value={qrCodeHash}
                    size={160}
                    id={`student-qr-${qrCodeHash}`}
                    level="H"
                    includeMargin={true}
                />
            </div>

            <Button onClick={handleDownload} className="w-full" icon="download">
                Descargar Código QR
            </Button>
            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed px-4">
                Este código es único y personal. Puede ser impreso o presentado desde un dispositivo móvil en el Kiosco.
            </p>
        </div>
    );
};

export default QRCodeSection;
