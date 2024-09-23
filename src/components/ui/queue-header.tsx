"use client"
import Image from "next/image";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import {usePathname} from "next/navigation";

const QueueHeader = () => {
    const pathName = usePathname();
    return (
        <header className="h-full row-span-2 relative">
            <div className="flex justify-center md:justify-between items-center gap-6">
                <div className="hidden md:block">
                    <Image src="/images/logo-rs.png" alt="Logo RSU UMM" width={132} height={132}/>
                </div>
                <div className="absolute left-0 right-0">
                    <p className="text-gray-500 text-center">Sistem Antrean Online</p>
                    <Heading headingLevel="h2" variant="page-title" className="text-center font-bold">
                        Rumah Sakit Umum<br/>
                        Universitas Muhammadiyah Malang
                    </Heading>
                    <p className="text-gray-500 text-center">23 September 2024</p>
                </div>
                <div>
                    {
                        pathName === "/queue/polyclinic" ? (
                            <Link href="#" className="hidden md:block">
                                <Image src="/images/logo-mjkn.png" alt="Logo RSU UMM" width={98} height={98}/>
                                <p className="mt-2 font-medium text-center text-[#3473AD]">Antrean MJKN</p>
                            </Link>
                        ): (
                            <div className="hidden md:block">
                                <Image src="/images/larsi.png" alt="Logo RSU UMM" width={264} height={0}/>
                            </div>
                        )
                    }
                </div>
            </div>
        </header>
    )
}

export default QueueHeader;