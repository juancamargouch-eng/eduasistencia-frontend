import { useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { AxiosError } from 'axios';
import Webcam from 'react-webcam';
import { verifyAttendance, type Student, type ConflictDetail, type ApiErrorDetail } from '../services/api';
import { audioService } from '../services/audio';

export type KioskStatus = 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'WARNING' | 'ERROR';

export const useKioskLogic = (webcamRef: React.RefObject<Webcam | null>, resetCallback: () => void) => {
    const [status, setStatus] = useState<KioskStatus>('IDLE');
    const [message, setMessage] = useState('Posicione su rostro');
    const [subMessage, setSubMessage] = useState('');
    const [lastStudent, setLastStudent] = useState<Student | null>(null);
    const [eventType, setEventType] = useState<'ENTRY' | 'EXIT'>('ENTRY');
    const [resetTimeout, setResetTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    const reset = useCallback(() => {
        setStatus('IDLE');
        setMessage('Listo para Escanear');
        setSubMessage('');
        setLastStudent(null);
        setEventType('ENTRY');
        resetCallback();
    }, [resetCallback]);

    const handleVerification = async (qrCode?: string, dni?: string) => {
        // Only block if already processing.
        if (status === 'PROCESSING') return;

        // INSTANT CLEANUP: If there was a success/error modal, clear it immediately
        if (resetTimeout) {
            clearTimeout(resetTimeout);
            setResetTimeout(null);
        }

        const video = webcamRef.current?.video;
        if (!video) return;

        // Force transition to PROCESSING to hide any existing modals (KioskResultOverlay vanishes on PROCESSING)
        setStatus('PROCESSING');
        setMessage('Procesando...');
        setSubMessage('Capturando biometría...');
        setLastStudent(null);

        try {
            // HIGH PERFORMANCE BIOMETRICS: Symmetric size for consistent accuracy (matched with registration)
            const detection = await faceapi.detectSingleFace(
                video,
                new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
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

            // Extraer el ID del dispositivo (ej. configurado previamente por Admin en este Kiosko/Tablet)
            const deviceId = localStorage.getItem('kiosk_device_id') || 'Dispositivo Desconocido';
            formData.append('device_source', deviceId);

            if (imageSrc) {
                const blob = await (await fetch(imageSrc)).blob();
                formData.append('file', blob, 'attempt.jpg');
            }

            const result = await verifyAttendance(formData);

            if (result.verification_status) {
                setLastStudent(result.student);
                const isExit = result.event_type === 'EXIT';
                setEventType(result.event_type || 'ENTRY');
                
                const logTime = new Date(result.timestamp);
                const timeStr = logTime.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });

                if (isExit) {
                    setStatus('SUCCESS');
                    setMessage(`¡Hasta pronto, ${result.student?.full_name?.split(' ')[0]}!`);
                    setSubMessage(`Salida registrada a las ${timeStr}`);
                    audioService.playSuccess();
                } else if (result.status === 'LATE') {
                    setMessage(`¡Bienvenido (Tardanza), ${result.student?.full_name?.split(' ')[0]}!`);
                    setStatus('WARNING');
                    setSubMessage(`Entrada (Tardanza) a las ${timeStr}`);
                    audioService.playNotification();
                } else {
                    setStatus('SUCCESS');
                    setMessage(`¡Bienvenido, ${result.student?.full_name?.split(' ')[0]}!`);
                    setSubMessage(`Asistencia registrada a las ${timeStr}`);
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
        eventType,
        reset,
        handleVerification
    };
};
