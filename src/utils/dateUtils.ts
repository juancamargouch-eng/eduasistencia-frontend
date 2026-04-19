import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Configuración senior
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('es');
dayjs.tz.setDefault('America/Lima');

export const formatDate = (date: string | Date | undefined, format = 'DD/MM/YYYY') => {
    if (!date) return 'N/A';
    return dayjs(date).tz().format(format);
};

export const formatTime = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return dayjs(date).tz().format('hh:mm A');
};

export const formatFullDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return dayjs(date).tz().format('dddd, D [de] MMMM [de] YYYY');
};

export const getRelativeTime = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return dayjs(date).fromNow();
};

export const isToday = (date: string | Date | undefined) => {
    if (!date) return false;
    return dayjs(date).isSame(dayjs(), 'day');
};

export default dayjs;
