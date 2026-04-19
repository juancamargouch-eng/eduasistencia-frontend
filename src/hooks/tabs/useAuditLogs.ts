import { useState, useEffect, useCallback } from 'react';
import { getAuditLogs, type AuditLog } from '../../services/adminService';
import { toast } from 'sonner';

export const useAuditLogs = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        action: ''
    });

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAuditLogs();
            setLogs(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar logs de auditoría");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = !filters.search || 
            log.username.toLowerCase().includes(filters.search.toLowerCase()) ||
            log.description.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesAction = !filters.action || log.action === filters.action;
        
        return matchesSearch && matchesAction;
    });

    return {
        logs: filteredLogs,
        loading,
        filters,
        setFilters,
        refresh: fetchLogs
    };
};
