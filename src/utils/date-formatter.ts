export const timeStringFormatter = (dateString: string | undefined) => {
    if(dateString) {
        const date = new Date(dateString);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    return dateString;
}

export const formatToStandardDate = (date: string) => {
    if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date)) {
        const [year, month, day] = date.split('-');
       return `${day}-${month}-${year}`;
    }
    return date;
}