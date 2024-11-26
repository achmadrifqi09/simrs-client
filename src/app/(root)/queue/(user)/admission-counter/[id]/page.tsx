"use client"
import {useParams} from "next/navigation";
import Section from "@/components/ui/section";
import Heading from "@/components/ui/heading";
import React, {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useSession} from "next-auth/react";
import {CircleAlert, Expand, Minimize, TicketX} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {CounterWS} from "@/types/counter";
import SkippedQueue from "@/app/(root)/queue/(user)/admission-counter/[id]/components/skipped-queue";
import {toast} from "@/hooks/use-toast";
import CurrentQueueSkeleton from "@/app/(root)/queue/(user)/admission-counter/[id]/components/current-queue-skeleton";
import {Skeleton} from "@/components/ui/skeleton";
import CurrentQueue from "@/app/(root)/queue/(user)/admission-counter/[id]/components/current-queue";
import {AdmissionQueueWS} from "@/types/admission-queue";
import SkippedQueueSkeleton from "@/app/(root)/queue/(user)/admission-counter/[id]/components/skipped-queue-skeleton";
import SelectQueueCode from "@/app/(root)/queue/(user)/admission-counter/[id]/components/select-queue-code";

type CallAdmissionQueueParam = {
    id: string;
}

const CallAdmissionQueue = () => {
    const param = useParams<CallAdmissionQueueParam>()
    const {data: session, status} = useSession();
    const [error, setError] = useState<string>()
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFullScreen, setIsFullscreen] = useState<boolean>(false)
    const [counter, setCounter] = useState<CounterWS | null>(null);
    const [currentQueue, setCurrentQueue] = useState<AdmissionQueueWS | null>(null);
    const [skippedQueues, setSkippedQueues] = useState<AdmissionQueueWS[] | null>(null);
    const [queueCode, setQueueCode] = useState<string>("");
    const COUNTER_TYPE = 1;

    const handleFullscreen = () => {
        if (document) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {
                    toast({
                        description: 'Browser tidak mendukung fullscreen'
                    })
                });
                setIsFullscreen(true)
            } else if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {
                    toast({
                        description: 'Terjadi kesalahan saat minimize layar'
                    })
                });
                setIsFullscreen(false)
            }
        }
    }

    const onResetSkippedQueue = ()=>{
        setSkippedQueues(null)
    }

    useEffect(() => {
        const counterSocket = io(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/counter`, {
            extraHeaders: {
                Authorization: `Bearer ${session?.accessToken}`,
            }
        });
        setSocket(counterSocket)
        if (status === 'authenticated') {
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
                setLoading(false)
            });
        });

        socket.on(`counter-id-${param.id}`, (result) => {
            setLoading(false);
            setCounter(result.data || result);
        });

        return () => {
            socket.off('connect-counter');
            socket.off('connect');
            socket.off(`error-${socket.id}`);
        }
    }, [status, socket, param.id, session]);

    return (
        <div className={isFullScreen ? 'absolute inset-0 bg-white z-50 p-6' : 'static'}>
            <div className="flex justify-between flex-wrap items-center mb-4 gap-4">
                {
                    loading ? (
                        <>
                            <Skeleton className="w-40 lg:w-72 h-[32px] mt-2"/>
                            <Skeleton className="w-28 h-5 mt-2"/>
                        </>
                    ) : (
                        <>
                            <Heading headingLevel="h3" variant="page-title" className="mb-0">
                                Panggil Antrean Admisi {counter?.nama_loket}
                            </Heading>
                            <div className="space-x-4">
                                <SelectQueueCode
                                    onResetSkippedQueue={onResetSkippedQueue}
                                    setQueueCode={setQueueCode}
                                />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleFullscreen}
                                >

                                    {isFullScreen ? (
                                        <>
                                            <Minimize className="w-4 h-4 mr-2"/>
                                            <span>Layar kecil</span>
                                        </>
                                    ) : (
                                        <>
                                            <Expand className="w-4 h-4 mr-2"/>
                                            <span>Layar penuh</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )
                }

            </div>
            {
                error ? (
                    <Section>
                        <div className="h-[30dvh] flex flex-col justify-center items-center">
                            <div
                                className="aspect-square bg-red-600 p-4 rounded-full border-8 text-white border-red-300">
                                <TicketX className="w-8 h-8"/>
                            </div>
                            <Heading headingLevel="h6" variant="section-title" className="mb-1 mt-2">
                                Terjadi Kesalahan
                            </Heading>
                            <p className="mb-4 text-gray-500 text-sm">{error}</p>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/queue/admission-counter">
                                    Kembali
                                </Link>
                            </Button>
                        </div>
                    </Section>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-5 gap-6">
                            {
                                (!counter && loading) ? (
                                    <>
                                        <CurrentQueueSkeleton/>
                                        <SkippedQueueSkeleton/>
                                    </>
                                ) : (
                                    <>
                                        {queueCode && (
                                            <>
                                                <CurrentQueue
                                                    counterId={Number(param.id)}
                                                    queueCode={queueCode}
                                                    currentQueue={currentQueue}
                                                    setCurrentQueue={setCurrentQueue}
                                                />
                                                <SkippedQueue
                                                    counterId={Number(param.id)}
                                                    queueCode={queueCode}
                                                    setCurrentQueue={setCurrentQueue}
                                                    skippedQueues={skippedQueues}
                                                    setSkippedQueues={setSkippedQueues}
                                                />
                                            </>
                                        )}
                                            {!queueCode && (
                                                <Section className="col-span-2 flex gap-2 py-6">
                                                    <CircleAlert className="text-red-600"/>
                                                    <p>
                                                        Pilih kode antrean di kanan atas
                                                    </p>
                                                </Section>
                                            )}
                                    </>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CallAdmissionQueue;
