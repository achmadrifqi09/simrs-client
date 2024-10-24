"use client"
import {useParams} from "next/navigation";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import React, {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {useSession} from "next-auth/react";
import useGet from "@/hooks/use-get";
import {TicketX} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
type CallAdmissionQueueParam = {
    id: string
}

type CounterDTO = {
    id_ms_loket_antrian: number;
    nama_loket: string;
    jenis_loket: number;
}

const CallAdmissionQueue = () => {
    const param = useParams<CallAdmissionQueueParam>()
    const {data: session, status} = useSession();
    const [error, setError] = useState<string>()
    const {data: counter} = useGet<CounterDTO>({
        url: `/master/counter/${param.id}`,
    })
    const COUNTER_TYPE = 1;
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_WS_BASE_URL || 'http://localhost:3002');

        if (status === 'authenticated') {
            socket.emit('connect-counter', {
                counter_type: COUNTER_TYPE,
                user_id: session?.user.id,
                counter_id: Number(param.id),
            });
        }
        socket.on('exception', (response) => {
            setError(response?.error)
        })
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [status]);

    return (
        <>

            <Heading headingLevel="h3" variant="page-title">Panggil Antrean
                Admisi {counter?.nama_loket}</Heading>
            <Section>
                {
                    error ? (
                        <div className="h-[30dvh] flex flex-col justify-center items-center">
                              <div className="aspect-square bg-red-600 p-4 rounded-full border-8 text-white border-red-300">
                                  <TicketX className="w-8 h-8"/>
                              </div>
                            <Heading headingLevel="h6" variant="section-title" className="mb-1 mt-2">Terjadi Kesalahan</Heading>
                            <p className="mb-4 text-gray-500 text-sm">{error}</p>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/queue/admission-counter">
                                    Kembali
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <p>Content</p>
                    )
                }
            </Section>
        </>
    )
}

export default CallAdmissionQueue;