import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { registerStudent } from '../../services/api';

export const useRegistrationTab = (isActive: boolean) => {
    const webcamRef = useRef<Webcam>(null);
    const [loading, setLoading] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);

    // Formulario de Registro
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dni, setDni] = useState('');
    const [grade, setGrade] = useState('');
    const [section, setSection] = useState('');
    const [scheduleId, setScheduleId] = useState('');
    const [telegramChatId, setTelegramChatId] = useState('');
    const [notifyTelegram, setNotifyTelegram] = useState(true);

    // Estados post-captura y registro
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [registeredQR, setRegisteredQR] = useState<string | null>(null);
    const [registeredName, setRegisteredName] = useState<string | null>(null);
    const [lastRegisteredPhoto, setLastRegisteredPhoto] = useState<string | null>(null);

    // Carga de modelos de FaceAPI
    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
                ]);
                setModelsLoaded(true);
            } catch (e) {
                console.error(e);
            }
        };
        loadModels();
    }, []);

    // Intervalo de Detección en Vivo
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && webcamRef.current?.video && modelsLoaded && !capturedImage) {
            interval = setInterval(async () => {
                const video = webcamRef.current?.video;
                if (!video) return;
                try {
                    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }));
                    setFaceDetected(!!detection);
                } catch (e) {
                    console.error("Face detection error:", e);
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isActive, modelsLoaded, capturedImage]);

    const capturePhoto = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);
        }
    };

    const handleSubmitRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!capturedImage) return toast.error("Fotografía requerida");
        setLoading(true);
        
        try {
            const img = await faceapi.fetchImage(capturedImage);
            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                .withFaceLandmarks().withFaceDescriptor();
            
            if (!detection) return toast.error("No se detectó un rostro de alumno válido");

            const formData = new FormData();
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('dni', dni);
            formData.append('grade', grade);
            formData.append('section', section);

            if (scheduleId) formData.append('schedule_id', scheduleId);
            if (telegramChatId) formData.append('telegram_chat_id', telegramChatId);
            formData.append('notify_telegram', String(notifyTelegram));
            formData.append('face_descriptor', JSON.stringify(Array.from(detection.descriptor)));

            // Convertir Base64 a Blob y montar el file
            const blob = await (await fetch(capturedImage)).blob();
            formData.append('file', new File([blob], "photo.jpg", { type: "image/jpeg" }));

            const response = await registerStudent(formData);
            
            setRegisteredQR(response.qr_code_hash);
            setRegisteredName(response.full_name);
            setLastRegisteredPhoto(capturedImage);
            
            // Limpiar formulario básico
            setFirstName('');
            setLastName('');
            setDni('');
            setCapturedImage(null);
            // Grado, Sección y Horario se pueden mantener por practicidad de matricula continua
            toast.success("Alumno registrado correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Error intero durante el registro");
        } finally {
            setLoading(false);
        }
    };

    return {
        webcamRef,
        loading,
        modelsLoaded,
        faceDetected,
        firstName, setFirstName,
        lastName, setLastName,
        dni, setDni,
        grade, setGrade,
        section, setSection,
        scheduleId, setScheduleId,
        telegramChatId, setTelegramChatId,
        notifyTelegram, setNotifyTelegram,
        capturedImage, setCapturedImage,
        registeredQR, setRegisteredQR,
        registeredName,
        lastRegisteredPhoto,
        capturePhoto,
        handleSubmitRegister
    };
};
