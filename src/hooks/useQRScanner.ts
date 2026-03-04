import { useEffect } from 'react';
import jsQR from 'jsqr';
import Webcam from 'react-webcam';

interface QRScannerProps {
    webcamRef: React.RefObject<Webcam | null>;
    enabled: boolean;
    onDetected: (data: string) => void;
}

export const useQRScanner = ({ webcamRef, enabled, onDetected }: QRScannerProps) => {
    // UI Scanning Logic
    useEffect(() => {
        if (!enabled) return;

        const scan = () => {
            const video = webcamRef.current?.video;
            if (!video || video.readyState !== 4) return;

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code && code.data) {
                onDetected(code.data);
            }
        };

        const interval = setInterval(scan, 200);
        return () => clearInterval(interval);
    }, [webcamRef, enabled, onDetected]);

    // Keyboard Emulation Logic (Hardware Scanners)
    useEffect(() => {
        let qrBuffer = '';
        let lastKeyTime = Date.now();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!enabled) return;

            const now = Date.now();
            if (now - lastKeyTime > 200) qrBuffer = '';
            lastKeyTime = now;

            if (e.key === 'Enter') {
                const trimmed = qrBuffer.trim();
                if (trimmed.length > 5) {
                    const sanitizedQr = trimmed.replace(/'/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
                    onDetected(sanitizedQr);
                }
                qrBuffer = '';
            } else if (e.key.length === 1) {
                qrBuffer += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, onDetected]);
};
