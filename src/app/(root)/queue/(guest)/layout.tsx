"use client"
import {ReactNode} from "react";
import QueueHeader from "@/components/ui/queue-header";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const QueueLayout = ({children}: { children: ReactNode }) => {
    const pathName = usePathname();
    const baseMainStyle = "queue-wrapper bg-white border border-gray-200 shadow-xl rounded-xl row-span-10 mt-6"

    return (
        <>
            <div
                className="bg-queue-accent bg-bottom h-dvh flex flex-col bg-no-repeat w-screen overflow-hidden bg-contain">
                <div
                    className="h-dvh pt-4 md:pt-6 px-4 md:px-6 max-h-dvh box-border xl:px-16 mx-auto flex-1 w-full gap-4 overflow-hidden">
                    <QueueHeader/>
                    <main
                        className={cn(pathName.includes('/queue/display') || pathName.includes('/display-antrian-admisi') ? "queue-wrapper mt-6" : baseMainStyle)}>
                        {children}
                    </main>
                    <footer className="flex justify-center px-6 py-2">
                        <p className="text-sm text-gray-900 px-1 backdrop-blur md:text-white bg-[rgba(255,255,255,0.3)] md:bg-red-700 w-max">
                            &#169; Dikembangkan oleh Tim IT RSU UMM 2024
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default QueueLayout;
