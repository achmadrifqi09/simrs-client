export const timeStringFormatter = (dateString: string | undefined): string => {
    if (dateString) {
        const date = new Date(dateString);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    return dateString || '';
};

export const dateFormatter = (date: Date | undefined): string => {
    if (!date || isNaN(date.getTime())) {
        return '';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export const formatToStandardDate = (date: string) => {
    if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date)) {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    }
    return date;
};
export const removeMillisecondsAndTimezone = (timeString: string) => {
    return timeString.replace(/\.\d+Z$/, '').slice(0, 5);
};
