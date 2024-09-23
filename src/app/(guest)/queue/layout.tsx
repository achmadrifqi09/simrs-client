import {ReactNode} from "react";
import Heading from "@/components/ui/heading";
import Image from "next/image";
import Link from "next/link";

const QueueLayout = ({children}: { children: ReactNode }) => {
    return (
        <>
            <div
                className="bg-queue-accent bg-bottom h-dvh flex flex-col bg-no-repeat w-screen overflow-hidden bg-contain">
                <div
                    className="grid grid-cols-1 grid-rows-12 h-dvh pt-6 px-6  max-h-dvh box-border xl:px-16 mx-auto flex-1 w-full gap-4">
                    <header className="h-full row-span-2 ">
                        <div className="flex justify-center md:justify-between items-center gap-6">
                            <div className="hidden md:block">
                                <Image src="/images/logo-rs.png" alt="Logo RSU UMM" width={132} height={132}/>
                            </div>
                            <div>
                                <p className="text-gray-500 text-center">Sistem Antrean Online</p>
                                <Heading headingLevel="h2" variant="page-title" className="text-center font-bold">
                                    Rumah Sakit Umum<br/>
                                    Universitas Muhammadiyah Malang
                                </Heading>
                                <p className="text-gray-500 text-center">23 September 2024</p>
                            </div>
                            <Link href="#" className="hidden md:block">
                                <Image src="/images/logo-mjkn.png" alt="Logo RSU UMM" width={98} height={98}/>
                                <p className="mt-2 font-medium text-center text-[#3473AD]">Antrean MJKN</p>
                            </Link>
                        </div>
                    </header>
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