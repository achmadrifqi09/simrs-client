"use client"
import {useEffect, useState} from "react";
import {useNavigation} from "@/lib/zustand/store";

type WindowSize = {
    width: number | undefined;
    height: number | undefined;
}

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}

const useWindowResizeHandler = () => {
    const { toggle, show } = useNavigation();
    const size = useWindowSize();
    let resizeTimeout: ReturnType<typeof setTimeout>

    useEffect(() => {
        const handleResize = () => {
            clearTimeout(resizeTimeout);

            // eslint-disable-next-line react-hooks/exhaustive-deps
            resizeTimeout = setTimeout(() => {
                if (size.width && size.width < 1024 && show) {
                    toggle();
                }

                if (size.width && size.width >= 1024 && !show) {
                    toggle();
                }
            }, 200);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [size.width, toggle]);
};

export {useWindowSize, useWindowResizeHandler};