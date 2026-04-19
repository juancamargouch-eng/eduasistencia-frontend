import api from './apiClient';

export interface Holiday {
    id: number;
    date: string;
    name: string;
    description?: string;
}

export interface HolidayCreate {
    date: string;
    name: string;
    description?: string;
}

export const getHolidays = async () => {
    const response = await api.get<Holiday[]>('holidays/');
    return response.data;
};

export const createHoliday = async (data: HolidayCreate) => {
    const response = await api.post<Holiday>('holidays/', data);
    return response.data;
};

export const deleteHoliday = async (id: number) => {
    const response = await api.delete(`holidays/${id}`);
    return response.data;
};
