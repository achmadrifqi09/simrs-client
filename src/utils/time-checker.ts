import moment from "moment-timezone";
import {timeStringFormatter} from "@/utils/time-formatter";

export const checkTimeMissed = (time: string): boolean => {
    if (time.includes('T')){
        time = timeStringFormatter(time)
    }
    const currentTime = moment.tz('Asia/Jakarta');
    const targetTime = moment.tz('Asia/Jakarta').set({
        hour: parseInt(time.split(':')[0]),
        minute: parseInt(time.split(':')[1]),
        second: parseInt(time.split(':')[2]),
        millisecond: 0
    });

    return currentTime.isAfter(targetTime);
};

export const checkDateIsNow = (date: string) => {
    if(date.includes('T')) date = date.split('T')[0]
    const targetDate = moment(date).startOf('day');
    const today = moment().startOf('day');
    return today.isSame(targetDate, 'day');
}