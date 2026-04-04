import { useState, useEffect, useCallback } from 'react';
import { getOccupancyStats, type Student } from '../../services/api';
import { useAdminWebSocket } from '../useAdminWebSocket';

export const useOccupancyTab = () => {
    const [occupancy, setOccupancy] = useState({ 
        total_entries: 0, 
        total_exits: 0, 
        current_count: 0,
        items: [] as (Student & { entry_time: string })[] 
    });
    
    const [pagination, setPagination] = useState({ page: 0, limit: 50, total: 0 });
    const [filterGrade, setFilterGrade] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchOccupancy = useCallback(async () => {
        setLoading(true);
        try {
            const skip = pagination.page * pagination.limit;
            const data = await getOccupancyStats(skip, pagination.limit, filterGrade, filterSection);
            setOccupancy({
                total_entries: data.total_entries,
                total_exits: data.total_exits,
                current_count: data.current_count,
                items: data.items
            });
            setPagination(prev => ({ ...prev, total: data.total }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, filterGrade, filterSection]);

    useEffect(() => {
        fetchOccupancy();
    }, [fetchOccupancy]);

    // Auto-refresca si entra un nuevo estudiante (websocket emit)
    useAdminWebSocket(fetchOccupancy);

    const handleFilterGradeChange = (val: string) => { setFilterGrade(val); setPagination(p => ({...p, page: 0})); };
    const handleFilterSectionChange = (val: string) => { setFilterSection(val); setPagination(p => ({...p, page: 0})); };

    return {
        occupancy,
        pagination,
        setPagination,
        filterGrade,
        setFilterGrade: handleFilterGradeChange,
        filterSection,
        setFilterSection: handleFilterSectionChange,
        loading,
        refresh: fetchOccupancy
    };
};
