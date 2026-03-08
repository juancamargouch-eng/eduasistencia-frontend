import axios from 'axios';

export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    grade: string;
    section: string;
    dni?: string;
    photo_url?: string;
    is_active?: boolean;
    schedule_id?: number | null;
    telegram_chat_id?: string | null;
    telegram_user_id?: string | null;
    notify_telegram?: boolean;
    schedule?: {
        id: number;
        name: string;
        start_time: string;
        end_time: string;
    } | null;
}

export interface ConflictDetail {
    message: string;
    timestamp: string;
    student: Student;
}

export type ApiErrorDetail = string | ConflictDetail;

export interface AttendanceLog {
    id: number;
    timestamp: string;
    student_id: number;
    verification_status: boolean;
    confidence_score: number;
    failure_reason?: string;
    event_type?: string;
    status?: string;
    student?: Student;
}

export interface ScheduleData {
    name: string;
    slug: string;
    start_time: string;
    end_time: string;
    tolerance_minutes?: number;
    late_limit_minutes?: number;
}

export interface Schedule extends Required<ScheduleData> {
    id: number;
}

export interface JustificationCreate {
    student_id?: number;
    dni?: string;
    date: string;
    reason: string;
}

export interface Justification extends JustificationCreate {
    id: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
    student?: Student;
}

export interface ReportFilters {
    from_date: string;
    to_date: string;
    grade?: string;
    section?: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;
export const BASE_URL = API_URL ? API_URL.replace('/api', '') : '';

export const getStudentPhotoUrl = (photoUrl?: string) => {
    if (!photoUrl) return null;

    // Si ya es una URL completa (http)
    if (photoUrl.startsWith('http')) {
        return photoUrl;
    }

    // Asegurar que BASE_URL no termine en / y que photoUrl empiece con /
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanPath = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;

    const finalUrl = `${cleanBase}${cleanPath}`;
    // console.log('DEBUG PHOTO URL:', finalUrl); // Descomentar para depurar en consola del navegador
    return finalUrl;
};

if (!API_URL) {
    console.warn("VITE_API_BASE_URL no está definida en el archivo .env");
}

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor to handle 401 Unauthorized (Token expired/invalid)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data; // Incluye access_token, token_type e is_superuser
};

export const getStudents = async () => {
    const response = await api.get('/students/');
    return response.data;
};

export const registerStudent = async (formData: FormData) => {
    const response = await api.post('/students/register', formData);
    return response.data;
};

export const verifyAttendance = async (formData: FormData) => {
    const response = await api.post('/attendance/verify', formData);
    return response.data;
};

export const getAttendanceLogs = async () => {
    const response = await api.get('/attendance/logs');
    return response.data;
};

// Schedules
export const getSchedules = async () => {
    const response = await api.get('/schedules/');
    return response.data;
};

export const createSchedule = async (data: ScheduleData) => {
    const response = await api.post('/schedules/', data);
    return response.data;
};

export const updateSchedule = async (id: number, data: Partial<ScheduleData>) => {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data;
};

// Justifications
export const getJustifications = async () => {
    const response = await api.get('/justifications/');
    return response.data as Justification[];
};

export const createJustification = async (data: JustificationCreate) => {
    const response = await api.post('/justifications/', data);
    return response.data;
};

export const updateJustificationStatus = async (id: number, status: string) => {
    const response = await api.put(`/justifications/${id}/status`, { status });
    return response.data;
};

// Reports
export const exportAttendanceReport = async (filters: ReportFilters) => {
    const params = new URLSearchParams(filters as unknown as Record<string, string>).toString();
    const response = await api.get(`/reports/attendance/export?${params}`, {
        responseType: 'blob',
    });
    return response.data;
};

// Student Update Interface removed to use FormData directly

export const updateStudent = async (id: number, formData: FormData) => {
    const response = await api.put(`/students/${id}`, formData);
    return response.data;
};

export const deleteStudent = async (id: number) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
};

export const importStudents = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/students/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const enrollByDni = async (dni: string, file: File, faceDescriptor: string) => {
    const formData = new FormData();
    formData.append('dni', dni);
    formData.append('file', file);
    formData.append('face_descriptor', faceDescriptor);

    const response = await api.patch('/students/enroll-by-dni', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const checkPhotos = async (dnis: string[]) => {
    const response = await api.post('/students/check-photos', dnis);
    return response.data as { dni: string, photo_url: string, s3_key: string }[];
};

export const enrollByS3Key = async (dni: string, s3Key: string, faceDescriptor: string) => {
    const formData = new FormData();
    formData.append('dni', dni);
    formData.append('s3_key', s3Key);
    formData.append('face_descriptor', faceDescriptor);

    const response = await api.post('/students/enroll-by-s3-key', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Devices
export interface Device {
    id: number;
    name: string;
    location: string;
    is_active: boolean;
    last_heartbeat: string;
    ip_address?: string;
    device_type: string;
}

export const getDevices = async () => {
    const response = await api.get('/devices/');
    return response.data;
};

// Attendance Advanced
export const validateAttendanceLog = async (id: number) => {
    const response = await api.post(`/attendance/logs/${id}/validate`);
    return response.data;
};

export const getOccupancyStats = async () => {
    const response = await api.get('/attendance/stats/occupancy');
    return response.data;
};

export const getDailyAttendance = async (grade: string, section: string, date?: string, scheduleId?: number) => {
    const response = await api.get('/attendance/daily-status', {
        params: { grade, section, date_str: date, schedule_id: scheduleId }
    });
    return response.data;
};

export interface StudentAbsencesResponse {
    student: Student;
    absences: {
        date: string;
        day_name: string;
        status: string;
    }[];
}

export const getStudentAbsences = async (dni: string) => {
    const response = await api.get(`/attendance/student/${dni}/absences`);
    return response.data as StudentAbsencesResponse;
};

export const getMonthlyStats = async () => {
    const response = await api.get('/attendance/stats/monthly');
    return response.data;
};

// Telegram Settings
export interface TelegramConfig {
    id: number;
    bot_token: string;
    api_id: string;
    api_hash: string;
    phone: string;
    is_active: boolean;
    updated_at: string;
}

export const getTelegramConfig = async () => {
    const response = await api.get('/settings/telegram');
    return response.data as TelegramConfig;
};

export const updateTelegramConfig = async (data: {
    bot_token?: string;
    api_id?: string;
    api_hash?: string;
    phone?: string;
    is_active?: boolean;
}) => {
    const response = await api.post('/settings/telegram', data);
    return response.data;
};

export const sendTelegramCode = async (phone: string) => {
    const response = await api.post('/settings/telegram/send-code', { phone });
    return response.data;
};

export const loginTelegram = async (data: {
    phone: string;
    code: string;
    phone_code_hash: string;
    password?: string
}) => {
    const response = await api.post('/settings/telegram/login', data);
    return response.data;
};

export default api;
