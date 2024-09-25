import {DoctorPractice} from "@/types/doctor";
import Heading from "@/components/ui/heading";
import {Stethoscope} from 'lucide-react'
import {Progress} from "@/components/ui/progress"
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";

interface DoctorCardProps {
    data: DoctorPractice,
    polyCode: string,
    showSchedule: (selectedDoctor: DoctorPractice) => void
}

const DoctorCard = ({data, showSchedule, polyCode}: DoctorCardProps) => {
    const handleSchedule = () => {
        showSchedule(data)
    }

    return (
        <div className="rounded-lg border border-gray-200 p-5 space-y-4">
            <div className="flex gap-3 items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="p-2 text-white border-4 border-red-200 bg-red-600 rounded-full">
                        <Stethoscope/>
                    </div>
                    <Heading headingLevel="h4" variant="section-title" className="m-0">
                        {data.name}
                    </Heading>
                </div>
                {data.is_off && (<Badge>Libur</Badge>)}
            </div>
            <div className="flex justify-between  gap-4 flex-col md:flex-row items-stretch">
                <div className="w-full flex flex-col justify-between h-full">
                    <p className="font-medium">Jam Praktek Pertama</p>
                    <div>
                        <p className="text-gray-500 mb-2 mt-3">{data.first_practice_hour}</p>
                        <div>
                            <p className="text-gray-500 mb-1">Kuota
                                pasien {data.first_remaining_quota} / {data.first_total_quota}</p>
                            <Progress value={data.first_remaining_quota / data.first_total_quota * 100}/>
                        </div>
                    </div>
                </div>
                <div className="w-0.5 md:h-32 lg:h-28 bg-gray-300 hidden md:block"></div>
                <div className="w-full flex flex-col justify-between h-full">
                    <p className="font-medium">Jam Praktek Kedua</p>
                    <div>
                        <p className="text-gray-500 mb-2 mt-3">{data.second_practice_hour}</p>
                        <div>
                            <p className="text-gray-500 mb-1">Kuota
                                pasien {data.second_remaining_quota} / {data.second_total_quota}</p>
                            <Progress value={data.second_remaining_quota / data.second_total_quota * 100}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-x-4">
                {
                    data.is_off ? (
                        <Button disabled={data.is_off}>
                            Tutup
                        </Button>
                    ) : (

                        <Button disabled={data.is_off} asChild>
                            <Link
                                href={`/queue/polyclinic/${polyCode}/register?code=${data.code}&practice_hours=14:00`}>Daftar</Link>
                        </Button>
                    )
                }
                <Button variant="outline" onClick={handleSchedule}>Jadwal Dokter</Button>
            </div>
        </div>
    )
}

export default DoctorCard