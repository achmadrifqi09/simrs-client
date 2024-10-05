"use client"
import Heading from "@/components/ui/heading";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const Custom404 = () => {
    const router = useRouter();
    return (
        <main className="w-screen flex-col h-screen flex justify-center items-center text-gray-700">
            <div className="flex flex-col justify-center items-center flex-1">
                <div className="relative w-64 h-64 md:h-80 md:w-80">
                    <Image src="/images/medicine.svg" alt="logo" fill/>
                </div>
                <div className="flex gap-4 items-center">
                    <Heading headingLevel="h1" className="m-0 p-0 gap-0">
                        4<span className="text-red-600">0</span>4
                    </Heading>
                    <div className="w-0.5 h-10 bg-gray-700"></div>
                    <p className="text-sm leading-relaxed">Mohon maaf, Halaman yang anda<br/>cari tidak dapat kami
                        temukan</p>
                </div>
                <Button
                    onClick={() => router.back()}
                    className="mt-8 w-full"
                    variant="outline">
                    Kembali
                </Button>
            </div>
            <footer className="py-4">
                <p className="text-sm text-gray-500"> &#169; Dikembangkan oleh Tim IT RSU UMM 2024</p>
            </footer>
        </main>
    )
}

export default Custom404