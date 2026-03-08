import { useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { AxiosError } from 'axios';
import Webcam from 'react-webcam';
import { verifyAttendance, type Student, type ConflictDetail, type ApiErrorDetail } from '../services/api';
import { audioService } from '../services/audio';

export type KioskStatus = 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'WARNING' | 'ERROR';

export const useKioskLogic = (webcamRef: React.RefObject<Webcam | null>, resetCallback: () => void) => {
    const [resetTimeout, setResetTimeout] = useState<NodeJS.Timeout | null>(null);
    const [status, setStatus] = useState<KioskStatus>('IDLE');
    const [message, setMessage] = useState('Posicione su rostro');
    const [subMessage, setSubMessage] = useState('');
    const [lastStudent, setLastStudent] = useState<Student | null>(null);

    const reset = useCallback(() => {
        setStatus('IDLE');
        setMessage('Listo para Escanear');
        setSubMessage('');
        setLastStudent(null);
        resetCallback();
    }, [resetCallback]);

    const handleVerification = async (qrCode?: string, dni?: string) => {
        // Only block if already processing. If it was SUCCESS/WARNING, allow interruption.
        if (status === 'PROCESSING') return;

        // Clean previous reset timer if any
        if (resetTimeout) clearTimeout(resetTimeout);

        const video = webcamRef.current?.video;
        if (!video) return;

        setStatus('PROCESSING');
        setMessage('Procesando...');

        try {
            // HIGH PERFORMANCE BIOMETRICS: Tiny size for ultra-fast detection
            const detection = await faceapi.detectSingleFace(
                video,
                new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 })
            ).withFaceLandmarks().withFaceDescriptor();

            if (!detection) {
                setStatus('ERROR');
                setMessage('Rostro no detectado');
                setSubMessage('Por favor mire a la cámara');
                audioService.playError();
                setResetTimeout(setTimeout(reset, 1500));
                return;
            }

            const descriptor = Array.from(detection.descriptor);

            // Optimized screenshot
            const imageSrc = webcamRef.current?.getScreenshot();

            const formData = new FormData();
            if (qrCode) formData.append('qr_code', qrCode);
            if (dni) formData.append('dni', dni);
            formData.append('face_descriptor', JSON.stringify(descriptor));

            if (imageSrc) {
                const blob = await (await fetch(imageSrc)).blob();
                formData.append('file', blob, 'attempt.jpg');
            }

            const result = await verifyAttendance(formData);

            if (result.verification_status) {
                setLastStudent(result.student);
                if (result.status === 'LATE') {
                    setMessage(`¡Bienvenido (Tardanza), ${result.student?.full_name?.split(' ')[0]}!`);
                    setStatus('WARNING');
                    setSubMessage('Has llegado tarde a tu turno.');
                    audioService.playNotification();
                } else {
                    setStatus('SUCCESS');
                    setMessage(`¡Bienvenido, ${result.student?.full_name?.split(' ')[0]}!`);
                    setSubMessage('Asistencia registrada correctamente');
                    audioService.playSuccess();
                }
            } else {
                setStatus('ERROR');
                setMessage('Acceso Denegado');
                setSubMessage(result.failure_reason || 'Verificación Fallida');
                audioService.playError();
            }

        } catch (err: unknown) {
            console.error(err);
            const error = err as AxiosError<{ detail: ApiErrorDetail }>;
            if (error.response?.status === 409) {
                const detail = error.response.data.detail;
                setStatus('WARNING');
                setMessage('Ya MARCO ASISTENCIA');
                audioService.playNotification();

                if (detail && typeof detail === 'object' && 'student' in detail) {
                    const conflict = detail as ConflictDetail;
                    setLastStudent(conflict.student);
                    setSubMessage(`Registrado previamente a las ${conflict.timestamp}`);
                } else {
                    setSubMessage(typeof detail === 'string' ? detail : 'Asistencia ya registrada hoy');
                }
            } else {
                setStatus('ERROR');
                setMessage('Error del Sistema');
                const detail = error.response?.data?.detail;
                setSubMessage(typeof detail === 'string' ? detail : 'Error de conexión');
                audioService.playError();
            }
        } finally {
            // Keep success/warning long enough to be read, but allow scan to interrupt
            setResetTimeout(setTimeout(reset, 5000));
        }
    };

    return {
        status, setStatus,
        message, setMessage,
        subMessage, setSubMessage,
        lastStudent, setLastStudent,
        reset,
        handleVerification
    };
};
