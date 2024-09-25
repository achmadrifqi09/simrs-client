"use client"
import {useEffect, useState} from "react";

const useWindowSize = () => {
    const [isMobilePhone, setIsMobilePhone] = useState<boolean>(false);

    const checkMobile = () => {
        if (typeof window !== 'undefined') {
            setIsMobilePhone(window.innerWidth <= 768);
        }
    };

    useEffect(() => {
        checkMobile();

        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    return isMobilePhone;
};

export { useWindowSize };