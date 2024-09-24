import {ReactNode} from "react";
import QueueHeader from "@/components/ui/queue-header";

const QueueLayout = ({children}: { children: ReactNode }) => {
    return (
        <>
            <div
                className="bg-queue-accent bg-bottom h-dvh flex flex-col bg-no-repeat w-screen overflow-hidden bg-contain">
                <div
                    className="grid grid-cols-1 grid-rows-12 h-dvh pt-6 px-6  max-h-dvh box-border xl:px-16 mx-auto flex-1 w-full gap-4">
                    <QueueHeader/>
                    <main className="bg-white border border-gray-200 shadow-xl rounded-xl h-full row-span-10 mt-3.5">
                        {children}
                    </main>
                    <footer className="text-white flex justify-center px-6 py-2">
                        <p className="text-sm bg-red-700 w-max">Develop By IT RSU UMM 2024</p>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default QueueLayout