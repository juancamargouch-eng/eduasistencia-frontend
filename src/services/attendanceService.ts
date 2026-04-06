import api from './core';
import type { Student } from './studentService';

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

export interface AttendancePaginationResponse {
    total: number;
    items: AttendanceLog[];
    skip: number;
    limit: number;
}

export const verifyAttendance = async (formData: FormData) => {
    const response = await api.post('attendance/verify', formData);
    return response.data;
};

export const getAttendanceLogs = async (skip = 0, limit = 50) => {
    const response = await api.get<AttendancePaginationResponse>('attendance/logs', {
        params: { skip, limit }
    });
    return response.data;
};

// Justifications
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

export const getJustifications = async () => {
    const response = await api.get('justifications/');
    return response.data as Justification[];
};

export const createJustification = async (data: JustificationCreate) => {
    const response = await api.post('justifications/', data);
    return response.data;
};

export const updateJustificationStatus = async (id: number, status: string) => {
    const response = await api.put(`justifications/${id}/status`, { status });
    return response.data;
};

// Reports
export interface ReportFilters {
    from_date: string;
    to_date: string;
    grade?: string;
    section?: string;
    search?: string;
    status?: string;
    schedule_id?: number;
}

export const exportAttendanceReport = async (filters: ReportFilters) => {
    const cleanFilters: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'undefined') {
            cleanFilters[key] = String(value);
        }
    });

    const params = new URLSearchParams(cleanFilters).toString();
    const response = await api.get(`reports/attendance/export?${params}`, {
        responseType: 'blob',
    });
    return response.data;
};

// Attendance Advanced
export const validateAttendanceLog = async (id: number) => {
    const response = await api.post(`attendance/logs/${id}/validate`);
    return response.data;
};

export interface OccupancyPaginationResponse {
    total_entries: number;
    total_exits: number;
    current_count: number;
    items: (Student & { entry_time: string })[];
    total: number;
    skip: number;
    limit: number;
}

export const getOccupancyStats = async (skip = 0, limit = 50, grade?: string, section?: string) => {
    const response = await api.get<OccupancyPaginationResponse>('attendance/stats/occupancy', {
        params: { skip, limit, grade, section }
    });
    return response.data;
};

export interface DailyAttendancePaginationResponse {
    date: string;
    is_non_working_day: boolean;
    holiday_name?: string | null;
    summary: {
        present: number;
        late: number;
        absent: number;
        total: number;
    };
    items: Array<{
        id: number;
        full_name: string;
        photo_url?: string;
        status: string;
        entry_time?: string | null;
    }>;
    total: number;
    skip: number;
    limit: number;
}

export const getDailyAttendance = async (
    grade: string, 
    section: string, 
    date?: string, 
    scheduleId?: number,
    skip = 0,
    limit = 50
) => {
    const response = await api.get<DailyAttendancePaginationResponse>('attendance/daily-status', {
        params: { grade, section, date_str: date, schedule_id: scheduleId, skip, limit }
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
    const response = await api.get(`attendance/student/${dni}/absences`);
    return response.data as StudentAbsencesResponse;
};

export const getMonthlyStats = async () => {
    const response = await api.get('attendance/stats/monthly');
    return response.data;
};

export interface AttendancePercentageData {
    present: number;
    late: number;
    absent: number;
    total_expected: number;
    period: string;
}

export const getAttendancePercentages = async (period: 'day' | 'week' | 'month' = 'month') => {
    const response = await api.get<AttendancePercentageData>('attendance/stats/percentages', {
        params: { period }
    });
    return response.data;
};
