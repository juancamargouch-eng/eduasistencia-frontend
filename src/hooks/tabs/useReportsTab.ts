import { useState } from 'react';
import { toast } from 'sonner';
import { exportAttendanceReport } from '../../services/api';

export const useReportsTab = () => {
    const [reportFilters, setReportFilters] = useState({ 
        from: '', 
        to: '', 
        grade: '', 
        section: '',
        search: '',
        status: '',
        scheduleId: '' as string | number
    });
    const [loading, setLoading] = useState(false);

    const handleExportReport = async () => {
        if (!reportFilters.from || !reportFilters.to) {
            return toast.error("Seleccione un rango de fechas");
        }
        setLoading(true);
        try {
            const blob = await exportAttendanceReport({
                from_date: reportFilters.from,
                to_date: reportFilters.to,
                grade: reportFilters.grade || undefined,
                section: reportFilters.section || undefined,
                search: reportFilters.search || undefined,
                status: reportFilters.status || undefined,
                schedule_id: reportFilters.scheduleId ? Number(reportFilters.scheduleId) : undefined
            });
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_asistencia_${reportFilters.from}_${reportFilters.to}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Reporte generado con éxito");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar reporte");
        } finally { 
            setLoading(false); 
        }
    };

    return {
        reportFilters,
        setReportFilters,
        loading,
        handleExportReport
    };
};
