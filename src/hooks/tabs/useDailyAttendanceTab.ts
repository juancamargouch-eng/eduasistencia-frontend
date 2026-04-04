import { useState, useEffect, useCallback } from 'react';
import { getDailyAttendance } from '../../services/api';

export interface DailyAttendanceResponse {
    is_non_working_day?: boolean;
    holiday_name?: string | null;
    summary: {
        present: number;
        late: number;
        absent: number;
        total: number;
    };
    students: Array<{
        id: number;
        full_name: string;
        photo_url?: string;
        status: 'PRESENT' | 'LATE' | 'ABSENT' | string;
        entry_time?: string | null;
    }>;
}

export const useDailyAttendanceTab = () => {
    const [dailyGrade, setDailyGrade] = useState('');
    const [dailySection, setDailySection] = useState('');
    const [dailyScheduleId, setDailyScheduleId] = useState<string | number>('');
    const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0]);
    const [dailyStats, setDailyStats] = useState<DailyAttendanceResponse | null>(null);
    const [dailyLoading, setDailyLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 0, limit: 50, total: 0 });

    const fetchDaily = useCallback(async () => {
        if (!dailyGrade || !dailySection) return;
        
        setDailyLoading(true);
        try {
            const skipDaily = pagination.page * pagination.limit;
            const response = await getDailyAttendance(
                dailyGrade,
                dailySection,
                dailyDate,
                dailyScheduleId ? Number(dailyScheduleId) : undefined,
                skipDaily,
                pagination.limit
            );
            setDailyStats({
                is_non_working_day: response.is_non_working_day,
                holiday_name: response.holiday_name,
                summary: response.summary,
                students: response.items
            });
            setPagination(prev => ({ ...prev, total: response.total }));
        } catch (e) {
            console.error(e);
        } finally {
            setDailyLoading(false);
        }
    }, [dailyGrade, dailySection, dailyDate, dailyScheduleId, pagination.page, pagination.limit]);

    useEffect(() => {
        fetchDaily();
    }, [fetchDaily]);

    const handleFilterGradeChange = (val: string) => { setDailyGrade(val); setPagination(p => ({...p, page: 0})); };
    const handleFilterSectionChange = (val: string) => { setDailySection(val); setPagination(p => ({...p, page: 0})); };
    const handleFilterScheduleChange = (val: string | number) => { setDailyScheduleId(val); setPagination(p => ({...p, page: 0})); };

    return {
        dailyGrade,
        setDailyGrade: handleFilterGradeChange,
        dailySection,
        setDailySection: handleFilterSectionChange,
        dailyScheduleId,
        setDailyScheduleId: handleFilterScheduleChange,
        dailyDate,
        setDailyDate,
        dailyStats,
        dailyLoading,
        pagination,
        setPagination
    };
};
