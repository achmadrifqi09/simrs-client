"use client"
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Clock from '@/components/ui/clock'

const QueueHeader = () => {
    const pathName = usePathname();
    return (
        <header className="row-span-2 relative px-4 md:px-6">
            <div className="flex justify-center md:justify-between items-center md:gap-6">
                <div className="hidden md:block">
                    <Image src="/images/logo-rs.png" alt="Logo RSU UMM" width={120} height={120}/>
                </div>
                <div className="static md:absolute left-0 right-0">
                    {
                        !pathName.includes('/queue/display') && (
                            <p className="text-gray-500 text-center">Sistem Antrean</p>
                        )
                    }
                    <h1 className="text-center font-bold mb-2 text-2xl xl:text-3xl text-[#054571]">
                        Rumah Sakit Umum<br/>
                        Universitas Muhammadiyah Malang
                    </h1>
                    <div className="h-6 min-w-10">
                        <Clock/>
                    </div>
                </div>
                <div>
                    {
                        pathName === "/queue/unit" ? (
                            <Link href="#" className="hidden md:block">
                                <Image src="/images/logo-mjkn.png" alt="Logo RSU UMM" width={98} height={98}/>
                                <p className="mt-2 font-medium text-center text-[#3473AD]">Antrean MJKN</p>
                            </Link>
                        ) : (
                            <div className="hidden md:block">
                                <Image src="/images/circle-larsi.png" alt="Logo RSU UMM" width={98} height={98}/>
                            </div>
                        )
                    }
                </div>
            </div>
        </header>
    )
}

export default QueueHeader;
