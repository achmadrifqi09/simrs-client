import React from 'react'
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle,} from "@/components/ui/drawer"
import useGet from "@/hooks/use-get";
import {DoctorPracticeSchedule, PracticeHours, SchedulesPerDayOrPerDate} from "@/types/doctor-schedule";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {formatISODayToNormalDay} from "@/lib/formatter/date-formatter";
import {timeStringFormatter} from "@/utils/time-formatter";
import {checkDateIsNow} from "@/utils/time-checker";
import {Badge} from "@/components/ui/badge";

interface ScheduleDrawerProps {
    unitCode: string;
    doctorId: number | null;
    openSchedule: boolean;
    setOpenSchedule: React.Dispatch<React.SetStateAction<boolean>>
}

const ScheduleDrawer = ({unitCode, doctorId, openSchedule, setOpenSchedule}: ScheduleDrawerProps) => {
    const {data, loading, error} = useGet<DoctorPracticeSchedule>({
        isGuest: true,
        url: `/doctor-schedule/${unitCode}/doctor/${doctorId}`,
        keyword: '',
        cursor: 0,
        take: 20,
    })

    const checkIsCurrentDate = (day: Date | number) => {
        const date = new Date();
        if (typeof day === 'number') {
            return date.getDay() === day
        } else {
            return checkDateIsNow(day.toString())
        }
    }

    return (
        <Drawer open={openSchedule} onOpenChange={setOpenSchedule}>
            <DrawerContent>
                <div className="mx-auto max-w-screen-xl w-full min-h-[26dvh]">
                    <DrawerHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <DrawerTitle>
                                    {
                                        loading ? (
                                            <Skeleton className="w-48 lg:w-80 h-6"/>
                                        ) : (
                                            <div className="text-left">
                                                <span>Jadwal Praktek </span>
                                                <span>{data?.id_dokter ? `${data.gelar_depan} . ` : ''}</span>
                                                <span>{data?.nama_dokter}{" "}</span>
                                                <span>{data?.gelar_belakang}</span>
                                            </div>
                                        )
                                    }
                                </DrawerTitle>
                                <DrawerDescription className="hidden"></DrawerDescription>
                            </div>
                            {
                                loading ? (
                                    <Skeleton className="w-10 h-10"/>
                                ) : (
                                    <Button variant="ghost" size="icon" onClick={() => setOpenSchedule(false)}>
                                        <X className="text-gray-500"/>
                                    </Button>
                                )
                            }
                        </div>
                    </DrawerHeader>
                    <div
                        className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-6 gap-4 px-4">
                        {
                            loading ? (
                                 Array.from({length: 4}, (_, index: number) => (
                                    <Skeleton className="w-full h-28" key={index}/>
                                 ))
                            ) : (
                                data?.jadwal?.map((schedule: SchedulesPerDayOrPerDate, i: number) => {
                                    return (
                                        <div
                                            className="bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-md relative"
                                            key={i}>
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="font-medium">
                                                    {
                                                        formatISODayToNormalDay(Number(schedule.hari_praktek))
                                                    }
                                                </p>
                                                {checkIsCurrentDate(schedule.tgl_praktek ?? schedule.hari_praktek) && (
                                                    <Badge>Sekarang</Badge>
                                                )}
                                            </div>
                                            <ul className="mt-2 space-y-1 list-disc">
                                                {
                                                    schedule?.jam_praktek.map((practiceHour: PracticeHours, x: number) => {
                                                        return (
                                                            <li className="ml-5 text-sm text-gray-600" key={x}>
                                                                {timeStringFormatter(practiceHour.jam_buka_praktek.toString())} - {" "}
                                                                {timeStringFormatter(practiceHour.jam_tutup_praktek.toString())}
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    )
                                })
                            )
                        }
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ScheduleDrawer