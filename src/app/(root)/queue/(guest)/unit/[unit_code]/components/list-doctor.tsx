import React, {useEffect, useState} from "react";
import Heading from "@/components/ui/heading";
import {Stethoscope} from 'lucide-react'
import {Progress} from "@/components/ui/progress"
import {Button} from "@/components/ui/button";
import {Doctor, QueueSchedule} from "@/types/doctor-schedule";
import {timeStringFormatter} from "@/utils/date-formatter";
import useGet from "@/hooks/use-get";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "@/hooks/use-toast";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import Link from "next/link";
import {checkDateIsNow, checkTimeMissed} from "@/utils/time-checker";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import ScheduleDrawer from "@/app/(root)/queue/(guest)/unit/components/doctor-schedule";

interface DoctorCardProps {
    unitCode: string
}

const ListDoctor = ({unitCode}: DoctorCardProps) => {
    const [selectedSchedule, setSelectedSchedule] = useState<QueueSchedule | null>();
    const [openSelectPatientType, setOpenSelectPatientType] = useState<boolean>(false);
    const [openSchedule, setOpenSchedule] = useState<boolean>(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [patientType, setPatientType] = useState<number | null>(null);
    const {data, loading, error} = useGet<Doctor[]>({
        isGuest: true,
        url: `/doctor-schedule/current/${unitCode}`,
        keyword: '',
    })

    const handleDoctorSchedule = (doctorId: number) => {
        setOpenSchedule(prev => !prev)
        setSelectedDoctorId(openSchedule ? null : doctorId)
    }

    const handleCloseDialog = () => {
        setSelectedSchedule(null)
        setOpenSelectPatientType(false)
    }
    const checkRegistrationAvailability = (doctorSchedule: QueueSchedule) => {
        if (doctorSchedule) {
            if (checkTimeMissed(doctorSchedule.jam_tutup_praktek)) return false

            if (doctorSchedule.kuota_terisi === doctorSchedule.kuota_onsite) return false;

            if (
                !checkTimeMissed(doctorSchedule.jam_tutup_praktek)
                && doctorSchedule.kuota_terisi === doctorSchedule.kuota_onsite
            ) return false

            if (doctorSchedule?.tanggal_libur && checkDateIsNow(doctorSchedule?.tanggal_libur)) return false;
        }
        return true;
    }

    useEffect(() => {
        if (error) {
            toast({
                title: 'Terjadi Kesalahan',
                description: error?.toString(),
            })
        }
        if (!openSchedule) setSelectedDoctorId(null)
    }, [error, openSchedule])

    return (
        <>
            {
                loading ? (
                    <>
                        <Skeleton className="w-full h-40 lg:h-80 xl:72"/>
                        <Skeleton className="w-full h-40 lg:h-80 xl:72"/>
                    </>
                ) : (
                    data?.map((doctor: Doctor, i: number) => {
                        return (
                            <div className="rounded-lg border border-gray-200 p-5 space-y-4 relative" key={i}>
                                <div className="flex gap-3 items-center justify-between">
                                    <div className="flex gap-3 items-center">
                                        <div className="p-2 text-white border-4 border-red-200 bg-red-600 rounded-full">
                                            <Stethoscope/>
                                        </div>
                                        <Heading headingLevel="h4" variant="section-title" className="m-0">
                                            <span
                                                className="capitalize">{doctor?.gelar_depan?.toLocaleLowerCase()}. </span>
                                            <span
                                                className="capitalize">{doctor.nama_dokter.toLocaleLowerCase()} </span>
                                            <span
                                                className="capitalize">{doctor?.gelar_belakang?.toLocaleLowerCase()}</span>
                                        </Heading>
                                    </div>
                                </div>
                                <div className="flex justify-between gap-4 flex-col md:flex-row items-stretch">
                                    {
                                        doctor.jadwal.map((schedule: QueueSchedule, index: number) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    {index === 1 && (
                                                        <div
                                                            className="w-0.5 md:h-32 lg:h-28 bg-gray-300 hidden md:block"></div>
                                                    )}
                                                    <div
                                                        className="w-full flex flex-col justify-between h-full md:min-h-32 lg:min-h-28">
                                                        <p className="font-medium">Jam Praktek {index + 1}</p>
                                                        <div>
                                                            <p className="text-gray-500 mb-2 mt-3">{timeStringFormatter(schedule.jam_buka_praktek)} - {timeStringFormatter(schedule.jam_tutup_praktek)}</p>
                                                            <div>
                                                                <p className="text-gray-500 mb-1">
                                                                    Kuota
                                                                    pasien {schedule.kuota_terisi} / {schedule.kuota_onsite}
                                                                </p>
                                                                <Progress
                                                                    value={schedule.kuota_terisi / schedule.kuota_onsite * 100}
                                                                    className="h-2.5"
                                                                />
                                                            </div>
                                                        </div>
                                                        {
                                                            (index === 0 && (doctor.jadwal[0]?.tanggal_libur && checkDateIsNow(doctor.jadwal[0]?.tanggal_libur))) && (
                                                                <Badge
                                                                    className="w-min absolute top-6 right-4">
                                                                    Libur
                                                                </Badge>
                                                            )
                                                        }
                                                        <div className="mt-4">
                                                            {
                                                                (!checkRegistrationAvailability(schedule)
                                                                    || (doctor.jadwal[0]?.tanggal_libur && checkDateIsNow(doctor.jadwal[0]?.tanggal_libur)))
                                                                    ? (
                                                                        <Button
                                                                            size="sm"
                                                                            disabled={true}
                                                                            className="w-min"
                                                                        >
                                                                            Tutup
                                                                        </Button>
                                                                    ) : (

                                                                        <Button
                                                                            className="w-min"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setOpenSelectPatientType(true)
                                                                                setSelectedSchedule(schedule)
                                                                            }}>
                                                                            Daftar
                                                                        </Button>
                                                                    )
                                                            }
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </div>
                                <div className="space-x-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDoctorSchedule(doctor.id_pegawai)}>
                                        Cek Jadwal Dokter
                                    </Button>
                                </div>
                            </div>
                        )
                    })
                )
            }
            {
                data?.length === 0 && (
                    <div className="lg:col-span-2 2xl:col-span-3">
                        <div className="relative w-64 h-64 md:h-96 md:w-96 mx-auto">
                            <Image src="/images/medicine.svg" alt="logo" fill/>
                        </div>
                        <p className="text-center w-max mx-auto text-gray-600">Tidak ada jadwal praktek dokter</p>
                    </div>
                )
            }
            <Dialog open={openSelectPatientType} onOpenChange={handleCloseDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pilih jenis pesien</DialogTitle>
                        <DialogDescription className="hidden">
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <Label>Jenis Pasien</Label>
                        <RadioGroup
                            className="grid grid-cols-1 md:grid-cols-2 items-center"
                            onValueChange={(value) => setPatientType(Number(value) || null)}
                        >
                            <Label
                                className="flex items-center space-x-2 w-full px-3 py-4 border border-gray-300 rounded-md hover:cursor-pointer">
                                <RadioGroupItem value="1"/>
                                <span>Pasien BPJS (baru)</span>
                            </Label>
                            <Label
                                className="flex items-center space-x-2 w-full px-3 py-4 border border-gray-300 rounded-md hover:cursor-pointer">
                                <RadioGroupItem value="2"/>
                                <span>Pasien BPJS (lama)</span>
                            </Label>
                            <Label
                                className="flex items-center space-x-2 w-full px-3 py-4 border border-gray-300 rounded-md hover:cursor-pointer">
                                <RadioGroupItem value="3"/>
                                <span>Pasien umum (baru)</span>
                            </Label>
                            <Label
                                className="flex items-center space-x-2 w-full px-3 py-4 border border-gray-300 rounded-md hover:cursor-pointer">
                                <RadioGroupItem value="4"/>
                                <span>Pasien umum (lama)</span>
                            </Label>
                        </RadioGroup>
                    </div>
                    {
                        (openSelectPatientType && selectedSchedule?.id_jadwal_dokter) && (
                            patientType ? (
                                <Button asChild>
                                    <Link
                                        href={`/queue/unit/${unitCode}/${selectedSchedule.id_jadwal_dokter}?patient_type=${patientType}`}>
                                        Lanjutkan
                                    </Link>
                                </Button>
                            ) : (
                                <Button disabled={true}>
                                    Lanjutkan
                                </Button>
                            )
                        )
                    }
                </DialogContent>
            </Dialog>
            {
                (selectedDoctorId && openSchedule) && (
                    <ScheduleDrawer
                        unitCode={unitCode}
                        doctorId={selectedDoctorId}
                        openSchedule={openSchedule}
                        setOpenSchedule={setOpenSchedule}
                    />
                )
            }
        </>
    )
}

export default ListDoctor