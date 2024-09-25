"use client"
import React, { useEffect, useState } from 'react';

const Clock = () => {
    const [time, setTime] = useState<Date | null>(null); // Initialize with null

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        setTime(new Date());
        return () => clearInterval(intervalId);
    }, []);

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'long'
        };
        return date.toLocaleDateString('id-ID', options);
    };

    if (time === null) {
        return null;
    }

    return (
        <div>
            <p className="text-center text-gray-500">{formatDate(time)} - {time.toLocaleTimeString('id-ID')}</p>
        </div>
    );
};

export default Clock;
