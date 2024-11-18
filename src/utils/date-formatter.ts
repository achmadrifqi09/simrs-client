export const timeStringFormatter = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

export const dateFormatter = (date: Date | undefined) => {
    if (date) {
        return `${date?.getDate() >= 10 ? date.getDate() : '0' + date.getDate()}-${date?.getMonth() + 1}-${date?.getFullYear()}`
    }
    return ''
}
