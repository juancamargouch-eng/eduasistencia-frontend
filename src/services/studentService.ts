import api from './apiClient';

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

export interface StudentPaginationResponse {
    total: number;
    items: Student[];
    skip: number;
    limit: number;
}

export interface ConflictDetail {
    message: string;
    timestamp: string;
    student: Student;
}

export type ApiErrorDetail = string | ConflictDetail;

export const getStudents = async (skip = 0, limit = 50, grade?: string, section?: string, search?: string) => {
    const response = await api.get<StudentPaginationResponse>('students/', {
        params: { skip, limit, grade, section, search }
    });
    return response.data;
};

export const registerStudent = async (formData: FormData) => {
    const response = await api.post('students/register', formData);
    return response.data;
};

export const updateStudent = async (id: number, formData: FormData) => {
    const response = await api.put(`students/${id}`, formData);
    return response.data;
};

export const deleteStudent = async (id: number) => {
    const response = await api.delete(`students/${id}`);
    return response.data;
};

export const importStudents = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('students/import', formData, {
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

    const response = await api.patch('students/enroll-by-dni', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const checkPhotos = async (dnis: string[]) => {
    const response = await api.post('students/check-photos', dnis);
    return response.data as { dni: string, photo_url: string, s3_key: string }[];
};

export const enrollByS3Key = async (dni: string, s3Key: string, faceDescriptor: string) => {
    const formData = new FormData();
    formData.append('dni', dni);
    formData.append('s3_key', s3Key);
    formData.append('face_descriptor', faceDescriptor);

    const response = await api.post('students/enroll-by-s3-key', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
