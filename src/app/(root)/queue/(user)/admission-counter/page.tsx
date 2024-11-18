"use client"
import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import SolidCard from "@/components/ui/solid-card";
import React, {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {Skeleton} from "@/components/ui/skeleton";
import {useSession} from "next-auth/react";
import {toast} from "@/hooks/use-toast";
import {CallingCounter} from "@/types/counter";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const QueueData = () => {
    const [counters, setCounters] = useState<CallingCounter[]>([]);
    const [queueCode, setQueueCode] = useState<string | null>(null);
    const [selectedCounterId, setSelectedCounterId] = useState<number | null>(null)
    const [openSelectQueue, setOpenSelectQueue] = useState<boolean>(false);
    const COUNTER_TYPE = 1;
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket | null>(null);
    const {data: session, status} = useSession();

    const handleToCounter = (counterId: number) => {
        setSelectedCounterId(openSelectQueue ? null : counterId);
        setOpenSelectQueue(prev => !prev);
    }

    useEffect(() => {
        const counterSocket = io(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/counter`, {
            extraHeaders: {
                Authorization: `Bearer ${session?.accessToken}`,
            }
        });
        setSocket(counterSocket)
        return () => {
            if (counterSocket) {
                counterSocket.disconnect();
            }
        };
    }, [session?.accessToken]);


    useEffect(() => {
        if (!socket || status !== 'authenticated') return;
        setLoading(true);

        socket.on(`counter-type-${COUNTER_TYPE}`, (result) => {
            setLoading(false);
            setCounters(result.data || result);
            if (result.data?.length === 0) setIsEmpty(true);
        });

        socket.on('connect', () => {
            socket.on(`error-${socket.id}`, (result) => {
                setLoading(false);
                setIsEmpty(true);
                toast({
                    description: result?.error,
                });
            });

        });
        socket.emit('counter', {
            counter_type: COUNTER_TYPE
        });

        return () => {
            socket.off(`counter-${COUNTER_TYPE}`);
            socket.off(`error-type-${socket.id}`);
            socket.off('connect');
        };
    }, [status, socket]);

    return (
        <>
            <Heading headingLevel="h3" variant="page-title">Panggil Antrean Admisi</Heading>
            <Section>
                <Heading headingLevel="h4" variant="section-title">Pilih Loket Admisi</Heading>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {(loading || status === 'loading') ? (
                        Array.from({length: 3}, (_, index) => (
                            <Skeleton className="h-[72px] w-full rounded-xl" key={index}/>
                        ))
                    ) : (
                        counters.map((counter: CallingCounter) => (
                            <SolidCard
                                type="button"
                                disabled={counter?.is_used}
                                key={counter.id_ms_loket_antrian}
                                onClick={() => handleToCounter(counter.id_ms_loket_antrian)}
                            >
                                <p className="font-medium">{counter.nama_loket}{counter?.is_used && ' (Digunakan)'}</p>
                            </SolidCard>
                        ))
                    )}
                    {
                        (isEmpty) && (
                            <div className="md:col-span-2 lg:col-span-3 2xl:col-span-4 bg-gray-50 p-4 rounded-md">
                                <p className="text-gray-600">Loket admisi tidak ditemukan</p>
                            </div>
                        )
                    }
                </div>
            </Section>
            <Dialog open={openSelectQueue} onOpenChange={setOpenSelectQueue}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pilih kode antrean</DialogTitle>
                        <DialogDescription className="hidden">
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <Label>Kode antrean</Label>
                        <RadioGroup
                            className="grid grid-cols-1 md:grid-cols-2 items-center"
                            onValueChange={(value) => setQueueCode(value)}
                        >
                            <Label
                                className="flex items-center space-x-2 w-full px-3 py-4 border border-gray-300 rounded-md hover:cursor-pointer">
                                <RadioGroupItem value="A"/>
                                <span>Kode A</span>
                            </Label>
                            <Label
                                className="flex items-center space-x-2 w-full px-3 py-4 border border-gray-300 rounded-md hover:cursor-pointer">
                                <RadioGroupItem value="B"/>
                                <span>Kode B</span>
                            </Label>
                            <Label
                                className="flex items-center space-x-2 w-full px-3 py-4 border border-gray-300 rounded-md hover:cursor-pointer">
                                <RadioGroupItem value="C"/>
                                <span>Kode C</span>
                            </Label>
                            <Label
                                className="flex items-center space-x-2 w-full px-3 py-4 border border-gray-300 rounded-md hover:cursor-pointer">
                                <RadioGroupItem value="D"/>
                                <span>Kode D</span>
                            </Label>
                        </RadioGroup>
                    </div>
                    {
                        queueCode ? (
                            <Button asChild>
                                <Link
                                    href={`/queue/admission-counter/${selectedCounterId}?queue_code=${queueCode}`}>
                                    Lanjutkan
                                </Link>
                            </Button>
                        ) : (
                            <Button disabled={true}>
                                Lanjutkan
                            </Button>
                        )

                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default QueueData
