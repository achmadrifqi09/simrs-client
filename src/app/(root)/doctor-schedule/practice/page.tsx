"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import {Calendar} from "@/components/ui/calendar"
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {useSession} from "next-auth/react";
import {Skeleton} from "@/components/ui/skeleton";
import {id} from 'date-fns/locale'
import SchedulePerDate from "@/app/(root)/doctor-schedule/practice/schedule-table";
import {usePermissionsStore} from "@/lib/zustand/store";
import {Permission} from "@/types/permission";
import {Action} from "@/enums/action";

const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};


const TodaySchedule = () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [showCalenderDialog, setShowCalenderDialog] = useState<boolean>(false)
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const {getPermissions} = usePermissionsStore();
    const [actionType, setActionType] = useState<Action>(Action.CREATE);
    const [doctorSchedulePermission, setDoctorSchedulePermission] = useState<Permission | null>(null);
    const {status} = useSession()
    useEffect(() => {
        const permission = getPermissions('dokter-praktek');
        if (permission) setDoctorSchedulePermission(permission)
    }, [actionType])

    const onRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    }
    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Jadwal Dokter Praktek / Jaga</Heading>
            <div className="flex flex-col xl:flex-row xl:gap-6">
                <Section className="w-max h-max min-w-[286px] hidden xl:block">

                    {
                        status === 'loading' ? (
                            <div className="space-y-4">
                                <Skeleton className="w-32 h-4 rounded-sm"/>
                                <div className="grid grid-cols-5 gap-4">
                                    {
                                        Array.from({length: 18}, (_, index) => (
                                            <Skeleton className="w-6 h-6 rounded-sm" key={index}/>
                                        ))
                                    }
                                </div>
                            </div>
                        ) : (
                            <Calendar
                                mode="single"
                                selected={date}
                                locale={id}
                                onSelect={setDate}
                                className="rounded-md border border-none p-0"
                            />
                        )
                    }
                </Section>
                <Section className="flex-1 overflow-hidden">
                    <Heading
                        headingLevel="h4"
                        variant="section-title">
                        Jadwal {date?.toLocaleDateString('id-ID', options)}
                    </Heading>
                    {
                        status === 'loading' ? (
                            <>
                                <Skeleton className="w-1/2 h-5"/>
                                <Skeleton className="w-1/3 h-5 mt-4"/>
                            </>
                        ) : (
                            date ? (
                                doctorSchedulePermission?.can_view && (
                                    <>
                                        <div className="xl:hidden mb-6">
                                            <Dialog onOpenChange={setShowCalenderDialog} open={showCalenderDialog}>
                                                <DialogTrigger asChild>
                                                    <Button>Pilih Tanggal</Button>
                                                </DialogTrigger>
                                                <DialogContent className="w-max">
                                                    <DialogHeader>
                                                        <DialogTitle>Pilih tanggal praktek</DialogTitle>
                                                        <DialogDescription></DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex justify-center">
                                                        <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            locale={id}
                                                            onSelect={(value) => {
                                                                setDate(value)
                                                                setShowCalenderDialog(false)
                                                            }}
                                                            className="rounded-md border border-none p-0 mx-auto"
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <SchedulePerDate
                                            date={date}
                                            permission={doctorSchedulePermission}
                                            refreshTrigger={refreshTrigger}
                                            onRefresh={onRefresh} actionType={Action.VIEW}
                                            setAction={setActionType}/>
                                    </>
                                )
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <p className="text-gray-500">Pilih tanggal untuk menampilkan jadwal</p>
                                </div>
                            )
                        )
                    }

                </Section>
            </div>
        </>
    )
}

export default TodaySchedule
