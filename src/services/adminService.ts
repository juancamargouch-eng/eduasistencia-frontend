import api from './core';

// Schedules
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

export const getSchedules = async () => {
    const response = await api.get('schedules/');
    return response.data;
};

export const createSchedule = async (data: ScheduleData) => {
    const response = await api.post('schedules/', data);
    return response.data;
};

export const updateSchedule = async (id: number, data: Partial<ScheduleData>) => {
    const response = await api.put(`schedules/${id}`, data);
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
    const response = await api.get('devices/');
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
    const response = await api.get('settings/telegram');
    return response.data as TelegramConfig;
};

export const updateTelegramConfig = async (data: {
    bot_token?: string;
    api_id?: string;
    api_hash?: string;
    phone?: string;
    is_active?: boolean;
}) => {
    const response = await api.post('settings/telegram', data);
    return response.data;
};

export const sendTelegramCode = async (phone: string) => {
    const response = await api.post('settings/telegram/send-code', { phone });
    return response.data;
};

export const loginTelegram = async (data: {
    phone: string;
    code: string;
    phone_code_hash: string;
    password?: string
}) => {
    const response = await api.post('settings/telegram/login', data);
    return response.data;
};

// Users & Profile
export interface AdminUser {
    id: number;
    username: string;
    full_name: string | null;
    email: string | null;
    role: string;
    is_active: boolean;
    is_superuser: boolean;
}

export const getMe = async () => {
    const response = await api.get('users/me');
    return response.data as AdminUser & { role: string };
};

export const updateCurrentUser = async (data: {
    username?: string;
    full_name?: string;
    password?: string;
}) => {
    const response = await api.put('users/me', data);
    return response.data as AdminUser;
};

// --- SuperUser Management ---
export const getUsers = async () => {
    const response = await api.get('users/');
    return response.data as AdminUser[];
};

export const createUser = async (data: any) => {
    const response = await api.post('users/', data);
    return response.data as AdminUser;
};

export const updateUser = async (id: number, data: any) => {
    const response = await api.put(`users/${id}`, data);
    return response.data as AdminUser;
};

export const deleteUser = async (id: number) => {
    const response = await api.delete(`users/${id}`);
    return response.data;
};

// --- Dynamic Permissions ---
export interface Permission {
    id?: number;
    role: string;
    module_name: string;
    is_enabled: boolean;
}

export const getPermissions = async () => {
    const response = await api.get('settings/permissions');
    return response.data as Permission[];
};

export const updatePermissions = async (data: Permission[]) => {
    const response = await api.post('settings/permissions', data);
    return response.data;
};

// Announcements
export interface Announcement {
    id: number;
    title: string;
    content: string;
    target_grade?: string;
    target_section?: string;
    author_id: number;
    created_at: string;
}

export const getAnnouncements = async () => {
    const response = await api.get<Announcement[]>('announcements/');
    return response.data;
};

export const createAnnouncement = async (data: {
    title: string;
    content: string;
    target_grade?: string;
    target_section?: string;
}) => {
    const response = await api.post<Announcement>('/announcements/', data);
    return response.data;
};

export const deleteAnnouncement = async (id: number) => {
    const response = await api.delete(`announcements/${id}`);
    return response.data;
};
