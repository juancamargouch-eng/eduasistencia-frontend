import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

import {
    registerStudent, getAttendanceLogs, getStudents, getSchedules,
    getJustifications, getOccupancyStats, createSchedule, updateSchedule,
    type Student, type AttendanceLog, type Justification, type Schedule
} from '../services/api';
import { useAdminWebSocket } from './useAdminWebSocket';
import { type TabName } from '../components/admin/Sidebar';
import { type DailyAttendanceResponse } from '../components/admin/DailyAttendanceTab';
import { type Absense } from '../components/admin/JustificationsTab';
import { getDailyAttendance, exportAttendanceReport } from '../services/api';

export const useAdminDashboard = () => {
    const webcamRef = useRef<Webcam>(null);
    const location = useLocation();
    const navigate = useNavigate();

    // UI & Logic Core
    const [loading, setLoading] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);

    // Data States
    const [students, setStudents] = useState<Student[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [justifications, setJustifications] = useState<Justification[]>([]);
    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [occupancy, setOccupancy] = useState({ entries: 0, exits: 0, current_occupancy: 0 });

    // Registration States
    const [regForm, setRegForm] = useState({ firstName: '', lastName: '', dni: '', scheduleId: '', grade: '', section: '', telegramChatId: '', notifyTelegram: true });
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [registeredQR, setRegisteredQR] = useState<string | null>(null);
    const [registeredName, setRegisteredName] = useState<string | null>(null);
    const [lastRegisteredPhoto, setLastRegisteredPhoto] = useState<string | null>(null);

    // Filter & Tab States
    const activeTab = (location.pathname.split('/').pop() || 'dashboard') as TabName;
    const [dailyData, setDailyData] = useState({
        grade: '',
        section: '',
        scheduleId: '' as string | number,
        date: new Date().toISOString().split('T')[0],
        stats: null as DailyAttendanceResponse | null,
        loading: false
    });
    const [reportFilters, setReportFilters] = useState({ from: '', to: '', grade: '', section: '' });
    const [justifState, setJustifState] = useState({ studentId: '', absences: [] as Absense[], studentData: null as Student | null, selectedAbsence: null as string | null, showModal: false, loading: false });
    const [schForm, setSchForm] = useState({ name: '', start: '', end: '', tolerance: '0' });
    const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
    const [studentFilters, setStudentFilters] = useState({ grade: '', section: '' });

    // Modals
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showImportModal, setShowImportModal] = useState(false);

    const refreshAnalytics = useCallback(async () => {
        try {
            const [l, o] = await Promise.all([getAttendanceLogs(), getOccupancyStats()]);
            setLogs(l); setOccupancy(o);
        } catch (e) { console.error(e); }
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const [s, sch, j] = await Promise.all([getStudents(), getSchedules(), getJustifications()]);
            setStudents(s); setSchedules(sch); setJustifications(j);
        } catch (e) { console.error(e); }
    }, []);

    useAdminWebSocket(refreshAnalytics);

    useEffect(() => {
        refreshAnalytics();
        fetchData();
    }, [refreshAnalytics, fetchData, activeTab]);

    useEffect(() => {
        if (location.pathname === '/admin' || location.pathname === '/admin/') navigate('/admin/dashboard', { replace: true });
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
                ]);
                setModelsLoaded(true);
            } catch (e) { console.error(e); }
        };
        loadModels();
    }, [location.pathname, navigate]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeTab === 'registration' && webcamRef.current?.video && modelsLoaded && !capturedImage) {
            interval = setInterval(async () => {
                const detection = await faceapi.detectSingleFace(webcamRef.current!.video!, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }));
                setFaceDetected(!!detection);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [activeTab, modelsLoaded, capturedImage]);

    // Daily Attendance Auto-fetch
    useEffect(() => {
        if (activeTab === 'daily_attendance' && dailyData.grade && dailyData.section) {
            const fetchDaily = async () => {
                setDailyData(prev => ({ ...prev, loading: true }));
                try {
                    const stats = await getDailyAttendance(
                        dailyData.grade,
                        dailyData.section,
                        dailyData.date,
                        dailyData.scheduleId ? Number(dailyData.scheduleId) : undefined
                    );
                    setDailyData(prev => ({ ...prev, stats, loading: false }));
                } catch (e) {
                    console.error(e);
                    setDailyData(prev => ({ ...prev, loading: false }));
                }
            };
            fetchDaily();
        }
    }, [activeTab, dailyData.grade, dailyData.section, dailyData.date, dailyData.scheduleId]);

    const handleSubmitRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!capturedImage) return;
        setLoading(true);
        try {
            const img = await faceapi.fetchImage(capturedImage);
            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })).withFaceLandmarks().withFaceDescriptor();
            if (!detection) return toast.error("No se detectó rostro");

            const formData = new FormData();

            // Map camelCase to snake_case for the backend
            formData.append('first_name', regForm.firstName);
            formData.append('last_name', regForm.lastName);
            formData.append('dni', regForm.dni);
            formData.append('grade', regForm.grade);
            formData.append('section', regForm.section);

            if (regForm.scheduleId) {
                formData.append('schedule_id', String(regForm.scheduleId));
            }

            if (regForm.telegramChatId) {
                formData.append('telegram_chat_id', regForm.telegramChatId);
            }

            formData.append('notify_telegram', String(regForm.notifyTelegram));
            formData.append('face_descriptor', JSON.stringify(Array.from(detection.descriptor)));

            const blob = await (await fetch(capturedImage)).blob();
            formData.append('file', new File([blob], "photo.jpg", { type: "image/jpeg" }));

            const response = await registerStudent(formData);
            setRegisteredQR(response.qr_code_hash);
            setRegisteredName(response.full_name);
            setLastRegisteredPhoto(capturedImage);
            setRegForm({ ...regForm, firstName: '', lastName: '', dni: '', scheduleId: '' });
            setCapturedImage(null);
            toast.success("Alumno registrado correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Error en registro");
        } finally { setLoading(false); }
    };

    const handleEditSchedule = (schedule: Schedule) => {
        setEditingScheduleId(schedule.id);
        setSchForm({
            name: schedule.name,
            start: schedule.start_time,
            end: schedule.end_time || '',
            tolerance: String(schedule.tolerance_minutes)
        });
    };

    const handleSubmitSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                name: schForm.name,
                slug: schForm.name.toLowerCase().replace(/\s+/g, '_'),
                start_time: schForm.start,
                end_time: schForm.end,
                tolerance_minutes: parseInt(schForm.tolerance)
            };

            if (editingScheduleId) {
                await updateSchedule(editingScheduleId, data);
                toast.success("Horario actualizado");
            } else {
                await createSchedule(data);
                toast.success("Horario creado");
            }
            setSchForm({ name: '', start: '', end: '', tolerance: '0' });
            setEditingScheduleId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar horario");
        } finally { setLoading(false); }
    };

    const handleExportReport = async () => {
        if (!reportFilters.from || !reportFilters.to) {
            return toast.error("Seleccione un rango de fechas");
        }
        setLoading(true);
        try {
            const blob = await exportAttendanceReport({
                from_date: reportFilters.from,
                to_date: reportFilters.to,
                grade: reportFilters.grade || undefined,
                section: reportFilters.section || undefined
            });
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_asistencia_${reportFilters.from}_${reportFilters.to}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Reporte generado con éxito");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar reporte");
        } finally { setLoading(false); }
    };

    return {
        webcamRef, loading, modelsLoaded, faceDetected,
        students, schedules, justifications, logs, occupancy,
        regForm, setRegForm, capturedImage, setCapturedImage, registeredQR, setRegisteredQR,
        registeredName, lastRegisteredPhoto,
        activeTab, dailyData, setDailyData, reportFilters, setReportFilters,
        justifState, setJustifState, schForm, setSchForm, studentFilters, setStudentFilters,
        selectedStudent, setSelectedStudent, showImportModal, setShowImportModal,
        refreshAnalytics, fetchData, handleSubmitRegister,
        editingScheduleId, setEditingScheduleId, handleEditSchedule, handleSubmitSchedule,
        handleExportReport
    };
};
