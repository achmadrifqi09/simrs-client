"use client"
import {Button} from "@/components/ui/button";
import React, {useEffect, useRef, useState} from "react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import useGet from "@/hooks/use-get";
import {Skeleton} from "@/components/ui/skeleton";
import {DoctorSchedule} from "@/types/doctor-schedule";
import {timeStringFormatter} from "@/utils/time-formatter";
import OldPatientForm from "@/app/(root)/queue/(guest)/unit/[unit_code]/[schedule_id]/forms/old-patient-form";
import NewPatientForm from "@/app/(root)/queue/(guest)/unit/[unit_code]/[schedule_id]/forms/new-patient-form";
import {RegisterResponse} from "@/types/queue-register";
import QueueTicket from "@/app/(root)/queue/(guest)/unit/[unit_code]/[schedule_id]/component/ticket";
import {useReactToPrint} from "react-to-print";
import AlertError from "@/app/(root)/queue/(guest)/unit/[unit_code]/[schedule_id]/component/alert-error";

type RegisterProps = {
    unit_code: string,
    schedule_id: string,
}


const Register = () => {
    const searchParams = useSearchParams()
    const param = useParams<RegisterProps>()
    const router = useRouter()
    const [registerResult, setRegisterResult] = useState<RegisterResponse | null>(null)
    const contentRef = useRef<HTMLDivElement>(null);
    const patientType = Number(searchParams.get('patient_type'));
    const {data, loading, error} = useGet<DoctorSchedule>({
        isGuest: true,
        url: `/doctor-schedule/${param.schedule_id}`,
        keyword: '',
    })

    const handleBackButton = () => {
        router.back();
    }

    const generateFormTitle = () => {
        switch (patientType) {
            case 1 :
                return 'Formulir Antrean Pasien BPJS (Baru)'
            case 2 :
                return 'Formulir Antrean Pasien BPJS (Lama)'
            case 3 :
                return 'Formulir Antrean Pasien Umum (Baru)'
            case 4 :
                return 'Formulir Antrean Pasien Umum (Lama)'
        }
    }

    const reactToPrintFn = useReactToPrint({
        contentRef: contentRef,
        onAfterPrint: () => {
            router.push('/ambil-antrean')
        }
    });

    const handlePrintTicket = (data: RegisterResponse) => {
        setRegisterResult(data);
    };

    useEffect(() => {
        if (isNaN(Number(searchParams.get('patient_type')))
            || ![1,2,3,4].includes(Number(searchParams.get('patient_type')))) {
            if (history) history.back()
        }
    }, [])

    useEffect(() => {
        if (registerResult && contentRef.current) {
            reactToPrintFn();
        }
    }, [registerResult]);

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl pb-6">
            <div
                className="h-20 flex flex-col md:flex-row justify-center items-center gap-4 bg-white sticky top-0 z-10 py-6 mx-6 pb-4 border-b border-b-gray-300">
                {
                    loading ? (
                        <Skeleton className="h-10 w-24 absolute left-0 hidden md:block"/>
                    ) : (
                        <Button variant="outline" onClick={handleBackButton}
                                className="absolute left-0 hidden md:block">
                            Kembali
                        </Button>
                    )
                }
                <div>
                    {
                        (loading && !data) ? (
                            <Skeleton className="h-6 md:w-48"/>
                        ) : (
                            <div className="text-center">
                                <h4
                                    className="text-center mb-0 text-xl font-semibold">
                                    {data?.unit?.nama_unit_kerja} -
                                    {" "}
                                    <span
                                        className="capitalize">{data?.pegawai?.gelar_depan?.toLocaleLowerCase()}. </span>
                                    <span
                                        className="capitalize">{data?.pegawai?.nama_pegawai?.toLocaleLowerCase()} </span>
                                    <span
                                        className="capitalize">{data?.pegawai?.gelar_belakang?.toLocaleLowerCase()}</span>
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {data?.jam_buka_praktek && data?.jam_tutup_praktek && (
                                        `${timeStringFormatter(data?.jam_buka_praktek)} - ${timeStringFormatter(data?.jam_tutup_praktek)}`
                                    )}
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="px-6 py-6">
                {
                    (loading && !data) ? (
                        <Skeleton className="h-6 w-48 md:w-64 mx-auto mb-6"/>
                    ) : (
                        <h4 className="text-xl text-center font-semibold mb-6"> {generateFormTitle()}</h4>
                    )
                }
                {
                    (loading && !data) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-2">
                            {
                                Array.from({length: (patientType == 1 || patientType == 3) ? 3 : 1}, (_, index) => (
                                    <div key={index}>
                                        <Skeleton className="h-5 w-32 mb-2"/>
                                        <Skeleton className="h-10 w-full"/>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <>
                            {(patientType == 1 || patientType == 3) && (
                                <NewPatientForm
                                    scheduleId={Number(param.schedule_id)}
                                    handlePrintTicket={handlePrintTicket}
                                    patientType={patientType}
                                />
                            )}
                            {(patientType == 2 || patientType == 4) && (
                                <OldPatientForm
                                    scheduleId={Number(param.schedule_id)}
                                    handlePrintTicket={handlePrintTicket}
                                    patientType={patientType}
                                />
                            )}
                        </>
                    )
                }
            </div>
            {
                registerResult && (
                    <div className="fixed left-[100vw]">
                        <QueueTicket data={registerResult} ref={contentRef}/>
                    </div>
                )
            }
            {
                error && (
                    <AlertError message={error} isShow={true} redirectUrl="/ambil-antrean"/>
                )
            }
        </div>
    )
}

export default Register