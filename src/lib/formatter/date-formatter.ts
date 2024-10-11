import moment from 'moment-timezone';

export const generateCurrentTimestamp = () => {
    const now = moment.tz('Asia/Jakarta');
    const finalDate = `${now.format('YYYY-MM-DDTHH:mm:ss')}Z`;
    return new Date(finalDate);
};
