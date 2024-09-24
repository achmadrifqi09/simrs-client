"use client"
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {DoctorPractice, DoctorSchedules, PracticeHour} from "@/types/doctor";
import {useEffect, useState} from "react";
import DoctorCard from "@/components/ui/doctor-card";
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle,} from "@/components/ui/drawer"
import {Badge} from "@/components/ui/badge"

const data: DoctorPractice[] = [
    {
        name: "Dr. Andi Abdillah, dr.,Sp.B",
        code: "1234",
        first_practice_hour: "08:00-13:00",
        first_remaining_quota: 0,
        first_total_quota: 20,
        second_practice_hour: "15:00-17:00",
        second_remaining_quota: 10,
        second_total_quota: 15,
        is_off: false,
        schedules: [
            {
                day: 1,
                is_off: false,
                practice_hours: [
                    {open_practice_hour: "13:00", close_practice_hour: "17:00"},
                    {open_practice_hour: "18:00", close_practice_hour: "21:00"}
                ]
            },
            {
                day: 2,
                is_off: false,
                practice_hours: [
                    {open_practice_hour: "13:00", close_practice_hour: "17:00"},
                    {open_practice_hour: "18:00", close_practice_hour: "21:00"}
                ]
            },
            {
                day: 3,
                is_off: false,
                practice_hours: [
                    {open_practice_hour: "13:00", close_practice_hour: "17:00"},
                    {open_practice_hour: "18:00", close_practice_hour: "21:00"}
                ]
            }
        ],
    },{
        name: "Dr. Mochamad Aleq Sander, Sp.B",
        code: "0876",
        first_practice_hour: "13:00-17:00",
        first_remaining_quota: 0,
        first_total_quota: 20,
        second_practice_hour: "18:00-20:00",
        second_remaining_quota: 3,
        second_total_quota: 15,
        is_off: true,
        schedules: [
            {
                day: 1,
                is_off: false,
                practice_hours: [
                    {open_practice_hour: "13:00", close_practice_hour: "17:00"},
                    {open_practice_hour: "18:00", close_practice_hour: "21:00"}
                ]
            },
            {
                day: 2,
                is_off: true,
                practice_hours: [
                    {open_practice_hour: "13:00", close_practice_hour: "17:00"},
                    {open_practice_hour: "18:00", close_practice_hour: "21:00"}
                ]
            },
            {
                day: 3,
                is_off: true,
                practice_hours: [
                    {open_practice_hour: "13:00", close_practice_hour: "17:00"},
                    {open_practice_hour: "18:00", close_practice_hour: "21:00"}
                ]
            }
        ]
    }
]

const SelectDoctor = () => {
    const [doctors, setDoctors] = useState<DoctorPractice[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorPractice>();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const handleBackButton = () => {
        if (history) history.back()
    }

    const handleDrawerDoctorSchedules = (selectedDoctor: DoctorPractice) => {
        setSelectedDoctor(selectedDoctor)
        setOpenDrawer((prev) => !prev)
    }

    const convertDay = (isoDay: number) => {
        const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
        return hari[isoDay - 1];
    }

    const getCurrentIsoDay = () => {
        const today = new Date();
        return today.getDay();
    }

    useEffect(() => {
        setDoctors(data);
    }, [doctors])

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl">
            <div
                className="h-20 flex flex-col md:flex-row justify-center items-center gap-4 bg-white sticky top-0 z-10 py-6 mx-6 pb-4 border-b border-b-gray-300">
                <Button variant="outline" onClick={handleBackButton} className="absolute left-0 hidden md:block">
                    Kembail
                </Button>
                <div>
                    <Heading headingLevel="h4" variant="section-title" className="text-center">Poliklinik x</Heading>
                </div>
            </div>
            <div className="px-6 pb-6 flex-1 overflow-auto mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.map((doctor: DoctorPractice, index: number) => {
                        return (
                            <DoctorCard data={doctor} key={index} showSchedule={handleDrawerDoctorSchedules}/>
                        )
                    })
                    }
                </div>
            </div>
            <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Jadwal Praktek {selectedDoctor?.name || ""}</DrawerTitle>
                        <DrawerDescription className="hidden"></DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-8 flex flex-wrap gap-4 mt-6">
                        {
                            selectedDoctor?.schedules.map((schedule: DoctorSchedules, index: number) => {
                                return (
                                    <div key={index} className="p-3 border border-gray-200 rounded-md min-w-48">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="font-medium">{convertDay(schedule.day)}</p>
                                            <div className="flex gap-2">
                                                {getCurrentIsoDay() === schedule.day && (
                                                    <Badge>Hari Ini</Badge>
                                                )}
                                                {schedule.is_off && (
                                                    <Badge>Libur</Badge>
                                                )}
                                            </div>
                                        </div>
                                        <ul className="list-disc ms-5 mt-3">
                                            {schedule.practice_hours.map((hour: PracticeHour, i: number) => {
                                                return <li
                                                    key={i}>{hour.open_practice_hour}-{hour.close_practice_hour}</li>
                                            })}
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SelectDoctor