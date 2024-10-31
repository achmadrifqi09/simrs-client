"use client"
import {useParams} from "next/navigation";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import React, {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useSession} from "next-auth/react";
import useGet from "@/hooks/use-get";
import {TicketX} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Counter} from "@/types/counter";

type CallAdmissionQueueParam = {
    id: string
}

const CallAdmissionQueue = () => {
    const param = useParams<CallAdmissionQueueParam>()
    const {data: session, status} = useSession();
    const [error, setError] = useState<string>()
    const [socket, setSocket] = useState<Socket | null>(null);
    const {data: counter} = useGet<Counter>({
        url: `/master/counter/${param.id}`,
    })
    const COUNTER_TYPE = 1;

    useEffect(() => {
        const counterSocket = io(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/counter`, {
            extraHeaders: {
                Authorization: `Bearer ${session?.accessToken}`,
            }
        });
        setSocket(counterSocket)
        if(status === 'authenticated') {
            counterSocket.emit('connect-counter', {
                counter_type: COUNTER_TYPE,
                user_id: session?.user.id,
                counter_id: Number(param.id),
            });
        }
        return () => {
            if (counterSocket) {
                counterSocket.disconnect();
            }
        };
    }, [status]);

    useEffect(() => {
        if (!socket || status !== 'authenticated') return;

        socket.on('connect', () => {
            socket.on(`error-${socket.id}`, (result) => {
                setError(result?.errors || result?.error)
            });
        });

        return () => {
            socket.off('connect-counter');
            socket.off('connect');
            socket.off(`error-${socket.id}`);
        }
    }, [status, socket, param.id, session]);

    return (
        <>

            <Heading headingLevel="h3" variant="page-title">Panggil Antrean
                Admisi {counter?.nama_loket}</Heading>
            <Section>
                {
                    error ? (
                        <div className="h-[30dvh] flex flex-col justify-center items-center">
                            <div
                                className="aspect-square bg-red-600 p-4 rounded-full border-8 text-white border-red-300">
                                <TicketX className="w-8 h-8"/>
                            </div>
                            <Heading headingLevel="h6" variant="section-title" className="mb-1 mt-2">Terjadi
                                Kesalahan</Heading>
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
