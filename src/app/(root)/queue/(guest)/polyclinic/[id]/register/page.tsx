"use client"
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {useSearchParams} from "next/navigation";
import React, {useEffect} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import NewPatientForm from "@/app/(root)/queue/(guest)/polyclinic/[id]/register/new-patient-form";
import OldPatientForm from "@/app/(root)/queue/(guest)/polyclinic/[id]/register/old-patient-form";

const Register = () => {
    const params = useSearchParams();
    const handleBackButton = () => {
        if (history) history.back()
    }

    useEffect(() => {
        if (!params.get('practice_hours')
            || !params.get('code')) {
            history.back()
        }
    }, [params])

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl">
            <div
                className="h-20 flex flex-col md:flex-row justify-center items-center gap-4 bg-white sticky top-0 z-10 py-6 mx-6 pb-4 border-b border-b-gray-300">
                <Button variant="outline" onClick={handleBackButton} className="absolute left-0 hidden md:block">
                    Kembail
                </Button>
                <div>
                    <Heading headingLevel="h5" variant="section-title" className="text-center mb-1">Nama
                        Dokter</Heading>
                    <p className="text-center text-gray-500">Jam praktek 14:00-17:00</p>
                </div>
            </div>
            <div className="px-6 pb-6 flex-1 overflow-auto mt-4">
                <Tabs defaultValue="old-patinet">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="old-patinet">Pasien Lama</TabsTrigger>
                        <TabsTrigger value="new-patient">Pasien Baru</TabsTrigger>
                    </TabsList>
                    <TabsContent value="old-patinet" className="mt-6 px-1">
                        <OldPatientForm/>
                    </TabsContent>
                    <TabsContent value="new-patient" className="mt-6 px-1">
                        <NewPatientForm/>
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    )
}

export default Register