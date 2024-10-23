"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import SolidCard from "@/components/ui/solid-card";
import React, {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {Skeleton} from "@/components/ui/skeleton";

type User = {
    client_id?: string;
    user_id: number;
    user_name: string;
};

type CounterDTO = {
    id_ms_loket_antrian: number;
    nama_loket: string;
    jenis_loket: number;
    is_used?: boolean;
    user?: User;
}

const QueueData = () => {
    const [counters, setCounters] = useState<CounterDTO[]>([]);
    const COUNTER_TYPE = 1;
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true)
        const socket = io(process.env.NEXT_PUBLIC_WS_BASE_URL || 'http://localhost:3002');
        socket.on(`counter-${COUNTER_TYPE}`, (result) => {
            setLoading(false)
            setCounters(result.data || result);
        });

        socket.emit('counter', {"counter_type": COUNTER_TYPE})

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Panggil Antrean Admisi</Heading>
            <Section>
                <Heading headingLevel="h4" variant="section-title">Pilih Loket Admisi</Heading>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {loading ? (
                        Array.from({length: 3}, (_, index) => (
                            <Skeleton className="h-[72px] w-full rounded-xl" key={index}/>
                        ))
                    ) : (
                        counters.map((counter: CounterDTO) => (
                            <SolidCard
                                type={counter?.is_used ? 'button' : 'url'}
                                disabled={counter?.is_used}
                                key={counter.id_ms_loket_antrian}
                                href={`/queue/admission-counter/${counter?.id_ms_loket_antrian}`}
                            >
                                <p className="font-medium">{counter.nama_loket}{counter?.is_used && ' (Digunakan)'}</p>
                            </SolidCard>
                        ))
                    )}
                    {
                        counters?.length === 0 && (
                            <div className="md:col-span-2 lg:col-span-3 2xl:col-span-4 bg-gray-50 p-4 rounded-md">
                                <p className="text-gray-600">Loket admisi tidak ditemukan</p>
                            </div>
                        )
                    }
                </div>
            </Section>
        </>
    )
}

export default QueueData
