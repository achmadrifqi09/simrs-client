"use client"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Printer} from 'lucide-react'
import SolidCard from "@/components/ui/solid-card";
import {useEffect, useState} from "react";

type polyclinic = {
    name: string
}

const QueuePolyclinic = () => {
    const [polyclinic, setPolyclinic] = useState<polyclinic[]>([])

    useEffect(() => {
        setPolyclinic([
            {name: 'Bedah Umum'},
            {name: 'Anak'},
            {name: 'Bedah Saraf'},
            {name: 'Spesialis Paru'},
            {name: 'Spesialis THT'},
        ])
    }, [])

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl">
            <div
                className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-10 p-6">
                <Input className="max-w-[24em]" placeholder="Cari poliklinik"/>
                <Button variant="outline">
                    <Printer className="w-4 h-4 mr-2"/>
                    <span>Cetak Ulang Tiket</span>
                </Button>
            </div>
            <div className="px-6 pb-6 flex-1 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {
                        polyclinic.map((polyclinic: polyclinic, i: number) => {
                            return (
                                <SolidCard key={i} href="/queue/polyclinic/1">
                                    <p className="font-medium">Poliklinik {polyclinic.name}</p>
                                </SolidCard>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default QueuePolyclinic;