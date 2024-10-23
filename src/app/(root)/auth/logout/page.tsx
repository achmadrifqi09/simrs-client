"use client"
import Footer from "@/components/ui/footer";
import React from "react";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {signOut} from "next-auth/react";
import {clearClientSideCookies} from "@/utils/cookies-cleaner";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {useMenuStore, usePermissionsStore} from "@/lib/zustand/store";

const Logout = () => {
    const router = useRouter()
    const {clearPermissions} = usePermissionsStore()
    const {clearMenu} = useMenuStore()
    const handleLogout = () => {
        signOut()
            .then(() => {
                router.push('/auth/login')
                clearMenu()
                clearClientSideCookies()
                clearPermissions()
            })
            .catch((error) => {
                toast({
                    title: "Terjadi kesalahan",
                    description: error.message,
                })
            })
    }
    return (
        <div className="h-dvh w-screen overflow-hidden">
            <div className="flex justify-center items-center h-dvh">
                <div className="text-center">
                    <div className="relative w-64 h-64 md:h-96 md:w-96">
                        <Image src="/images/medicine.svg" alt="logo" fill/>
                    </div>
                    <h5 className="text-xl font-semibold">Sesi Login Berakhir</h5>
                    <p className="text-sm text-gray-500">Sesi login pengguna telah berakhir,<br/>silakan logout dan
                        login kembali untuk mengakses sistem</p>
                    <Button className="mt-4" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
                <div className="absolute bottom-0 right-0 left-0">
                    <Footer/>
                </div>
            </div>
        </div>
    )
}

export default Logout