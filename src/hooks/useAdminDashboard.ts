import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    getAttendanceLogs, getSchedules, getOccupancyStats, getAttendancePercentages,
    type AttendanceLog, type Schedule, type Student, type AttendancePercentageData
} from '../services/api';
import { useAdminWebSocket } from './useAdminWebSocket';
import { type TabName } from '../components/admin/Sidebar';

export const useAdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Estado del Tab Activo
    const activeTab = (location.pathname.split('/').pop() || 'dashboard') as TabName;

    // Redirección base
    useEffect(() => {
        if (location.pathname === '/admin' || location.pathname === '/admin/') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [location.pathname, navigate]);

    // Data Global (Catálogos y Stats de Dashboard Principal)
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [occupancy, setOccupancy] = useState({ 
        total_entries: 0, 
        total_exits: 0, 
        current_count: 0,
        items: [] as (Student & { entry_time: string })[] 
    });

    const [percentageData, setPercentageData] = useState<AttendancePercentageData | null>(null);
    const [percentagePeriod, setPercentagePeriod] = useState<'day' | 'week' | 'month'>('month');
    const [loadingPerc, setLoadingPerc] = useState(false);

    const fetchPercentages = useCallback(async () => {
        setLoadingPerc(true);
        try {
            const data = await getAttendancePercentages(percentagePeriod);
            setPercentageData(data);
        } catch (e) { console.error(e); } finally {
            setLoadingPerc(false);
        }
    }, [percentagePeriod]);

    useEffect(() => {
        fetchPercentages();
    }, [fetchPercentages]);

    const refreshAnalytics = useCallback(async () => {
        try {
            const [l, o] = await Promise.all([
                getAttendanceLogs(0, 5), // Latest 5 logs for overview
                getOccupancyStats(0, 10, '', '') // Stats globales sin filtros para el dashboard overview
            ]);
            setLogs(l.items); 
            setOccupancy({
                total_entries: o.total_entries,
                total_exits: o.total_exits,
                current_count: o.current_count,
                items: o.items
            });
        } catch (e) { console.error(e); }
    }, []);

    const fetchSchedules = useCallback(async () => {
        try {
            const sch = await getSchedules();
            setSchedules(sch);
        } catch (e) { console.error(e); }
    }, []);

    // Websocket Global para reflejar eventos en tiempo real
    useAdminWebSocket(refreshAnalytics);

    useEffect(() => {
        const init = async () => {
            await refreshAnalytics();
        };
        init();
    }, [refreshAnalytics, activeTab]);

    useEffect(() => {
        const init = async () => {
            await fetchSchedules();
        };
        init();
    }, [fetchSchedules]);

    return {
        activeTab,
        schedules,
        logs,
        occupancy,
        percentageData,
        percentagePeriod,
        setPercentagePeriod,
        loadingPerc,
        refreshAnalytics
    };
};
