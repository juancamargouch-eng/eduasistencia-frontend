import api from './core';

export interface Assignment {
    id: number;
    title: string;
    description?: string;
    file_url?: string;
    due_date?: string;
    grade: string;
    section: string;
    teacher_id: number;
    created_at: string;
}

export const getAssignments = async () => {
    const response = await api.get<Assignment[]>('assignments/');
    return response.data;
};

export const createAssignment = async (formData: FormData) => {
    const response = await api.post<Assignment>('assignments/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteAssignment = async (id: number) => {
    const response = await api.delete(`academic/assignments/${id}`);
    return response.data;
};

// ------------------- ACADEMIC MODULE (ADMIN & TEACHERS) -------------------
export interface Course {
    id: number;
    name: string;
    description?: string;
}

export interface AcademicPeriod {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

export interface EvaluationCriteria {
    id: number;
    name: string;
    weight_percentage: number;
    is_active: boolean;
}

export interface TeacherAssignment {
    id?: number;
    user_id: number;
    course_id: number;
    grade: string;
    section: string;
    course_name?: string;
}

export interface Grade {
    id?: number;
    student_id: number;
    assignment_id: number;
    criterion_id: number;
    period_id: number;
    score_value: string;
    created_at?: string;
}

export interface AcademicSetting {
    id: number;
    grading_system: string; // 'NUMERIC' | 'LITERAL'
    updated_at: string;
}

export const updateTeacherAssignment = async (id: number, data: Partial<TeacherAssignment>) => {
    const response = await api.put<TeacherAssignment>(`academic/assignments/${id}`, data);
    return response.data;
};

// -- Admin Academic Configs --
export const getCourses = async () => {
    const response = await api.get<Course[]>('academic/courses/');
    return response.data;
};

export const createCourse = async (data: Omit<Course, 'id'>) => {
    const response = await api.post<Course>('academic/courses/', data);
    return response.data;
};

export const updateCourse = async (id: number, data: Partial<Course>) => {
    const response = await api.put<Course>(`academic/courses/${id}`, data);
    return response.data;
};

export const deleteCourse = async (id: number) => {
    const response = await api.delete(`academic/courses/${id}`);
    return response.data;
};

export const getPeriods = async () => {
    const response = await api.get<AcademicPeriod[]>('academic/periods/');
    return response.data;
};

export const createPeriod = async (data: Omit<AcademicPeriod, 'id'>) => {
    const response = await api.post<AcademicPeriod>('academic/periods/', data);
    return response.data;
};

export const updatePeriod = async (id: number, data: Partial<AcademicPeriod>) => {
    const response = await api.put<AcademicPeriod>(`academic/periods/${id}`, data);
    return response.data;
};

export const deletePeriod = async (id: number) => {
    const response = await api.delete(`academic/periods/${id}`);
    return response.data;
};

export const getCriteria = async () => {
    const response = await api.get<EvaluationCriteria[]>('academic/criteria/');
    return response.data;
};

export const createCriteria = async (data: Omit<EvaluationCriteria, 'id'>) => {
    const response = await api.post<EvaluationCriteria>('academic/criteria/', data);
    return response.data;
};

export const updateCriteria = async (id: number, data: Partial<EvaluationCriteria>) => {
    const response = await api.put<EvaluationCriteria>(`academic/criteria/${id}`, data);
    return response.data;
};

export const deleteCriteria = async (id: number) => {
    const response = await api.delete(`academic/criteria/${id}`);
    return response.data;
};

export const getTeacherAssignments = async () => {
    const response = await api.get<TeacherAssignment[]>('academic/assignments/');
    return response.data;
};

export const createTeacherAssignment = async (data: Omit<TeacherAssignment, 'id' | 'course_name'>) => {
    const response = await api.post<TeacherAssignment>('academic/assignments/', data);
    return response.data;
};

export const getSettings = async () => {
    const response = await api.get<AcademicSetting>('academic/settings/');
    return response.data;
};

export const updateSettings = async (data: { grading_system: string }) => {
    const response = await api.put<AcademicSetting>('academic/settings/', data);
    return response.data;
};

// -- Teacher Academic Flow --
export const getMyAssignments = async () => {
    const response = await api.get<TeacherAssignment[]>('academic/teacher/my-assignments');
    return response.data;
};

export const getGradesForAssignment = async (assignmentId: number, periodId: number) => {
    const response = await api.get<Grade[]>('academic/teacher/grades', {
        params: { assignment_id: assignmentId, period_id: periodId }
    });
    return response.data;
};

export const bulkUploadGrades = async (grades: Omit<Grade, 'id' | 'created_at'>[]) => {
    const response = await api.post('academic/teacher/bulk-grades', { grades });
    return response.data;
};
