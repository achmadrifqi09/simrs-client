import moment from 'moment-timezone';

export const generateCurrentTimestamp = () => {
    const now = moment.tz('Asia/Jakarta');
    const finalDate = `${now.format('YYYY-MM-DDTHH:mm:ss')}Z`;
    return new Date(finalDate);
};

export const formatISODayToNormalDay = (value: number) => {
    const days: { [key: number]: string } = {
        1: 'Senin',
        2: 'Selasa',
        3: 'Rabu',
        4: 'Kamis',
        5: 'Jumat',
        6: 'Sabtu',
        7: 'Minggu'
    };
    return days[value] || 'Hari tidak valid';
}
