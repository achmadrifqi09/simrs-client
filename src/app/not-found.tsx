"use client"
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const Custom404 = () => {
    const router = useRouter();
    return (
        <main className="w-screen flex-col h-dvh flex justify-center items-center text-gray-700 px-4">
            <div className="flex flex-col justify-center items-center flex-1">
                <div className="relative w-64 h-64 md:h-96 md:w-96">
                    <Image src="/images/medicine.svg" alt="logo" fill/>
                </div>
                <div className="flex gap-4 items-center">
                    <h1 className="text-6xl font-bold">
                        4<span className="text-red-600">0</span>4
                    </h1>
                    <div className="w-0.5 h-14 bg-gray-500"></div>
                    <p className="text-sm leading-relaxed">Hmm... sepertinya anda tersesat,<br/>
                        tekan tombol kembali untuk ke rumah.
                    </p>
                </div>
                <Button
                    className="mt-8 w-full"
                    variant="outline"
                    onClick={() => router.back()}
                >
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