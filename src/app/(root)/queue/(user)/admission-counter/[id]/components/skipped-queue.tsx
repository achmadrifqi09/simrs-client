import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {SetStateAction, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {AdmissionQueueWS} from "@/types/admission-queue";
import {useSession} from "next-auth/react";
import {toast} from "@/hooks/use-toast";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import Cookies from "js-cookie";

interface SkippedQueueProps {
    counterId: number;
    queueCode: string | null;
    setCurrentQueue: React.Dispatch<SetStateAction<AdmissionQueueWS | null>>;
    skippedQueues: AdmissionQueueWS[] | null;
    setSkippedQueues: React.Dispatch<SetStateAction<AdmissionQueueWS[] | null>>;
}

const SkippedQueue = ({counterId, queueCode, setCurrentQueue, skippedQueues, setSkippedQueues}: SkippedQueueProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const {data: session, status} = useSession();

    const handleRecallQueue = (queue: AdmissionQueueWS) => {
        setCurrentQueue(queue)
        socket?.emit('recall-skipped', {
            id_antrian: queue?.id_antrian,
            user_id: session?.user.id,
            id_ms_loket_antrian: counterId,
            kode_antrian: queue?.kode_antrian
        })
        if (Cookies.get('ADMISSION_QUEUE_PENDING')) skipQueueOnPending()
    }

    const handleQueueCancellationInSkip = (queue: AdmissionQueueWS) => {
        socket?.emit('cancel', {
            id_antrian: queue?.id_antrian,
            user_id: session?.user.id,
            id_ms_loket_antrian: counterId,
            kode_antrian: queue?.kode_antrian
        })
    }

    const skipQueueOnPending = () => {
        socket?.emit('skip', {
            id_antrian: Number(Cookies.get('ADMISSION_QUEUE_PENDING')),
            id_user: session?.user.id,
            id_ms_loket_antrian: counterId,
            kode_antrian: queueCode
        })
        if (Cookies.get('ADMISSION_QUEUE_PENDING')) Cookies.remove('ADMISSION_QUEUE_PENDING')

    }

    useEffect(() => {
        const admissionQueueSocket = io(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/admission`, {
            extraHeaders: {
                Authorization: `Bearer ${session?.accessToken}`,
            }
        });
        setSocket(admissionQueueSocket)
        return () => {
            if (admissionQueueSocket) {
                admissionQueueSocket.disconnect();
            }
        };
    }, []);

    const checkIsAnotherCounter = (currentCounterId: number, callStatus: number) => {
        return (currentCounterId != counterId && callStatus == 3);
    }

    useEffect(() => {
        if (!socket || status !== 'authenticated') return;

        socket.on(`error-${socket.id}`, (result) => {
            toast({
                description: result?.error,
            });
        });

        socket.on(`skips-${queueCode}`, (result) => {
            setSkippedQueues(result?.data || [])
        });

        if (skippedQueues == null) {
            socket.emit('skipped-init', {
                kode_antrian: queueCode,
                id_ms_loket_antrian: counterId
            });
        }

        return () => {
            socket.off(`error-${socket.id}`);
            socket.off(`skips-${queueCode}`);
        };
    }, [socket, status, counterId, queueCode, skippedQueues]);

    return (
        <Section className="2xl:col-span-3">
            <Heading headingLevel="h4" variant="section-title">
                Daftar Antrean Dilewati
            </Heading>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-sm">No antrean</TableHead>
                        <TableHead className="text-sm">Nama pasien</TableHead>
                        <TableHead className="text-sm">Jenis penjamin</TableHead>
                        <TableHead className="text-sm">Kode poli tujuan</TableHead>
                        <TableHead className="text-sm">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        (skippedQueues && skippedQueues.length !== 0) ? (
                            skippedQueues?.map((queue: AdmissionQueueWS, idx: number) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>{queue.kode_antrian}-{queue.no_antrian}</TableCell>
                                            <TableCell>{queue.nama_pasien}</TableCell>
                                            <TableCell>{Number(queue.jenis_penjamin) === 1 ? 'Umum' : 'BPJS'}</TableCell>
                                            <TableCell>{queue?.jadwal_dokter?.kode_instalasi_bpjs || '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleRecallQueue(queue)}
                                                        disabled={checkIsAnotherCounter(queue?.id_ms_loket_antrian, queue.status_panggil)}
                                                    >
                                                        {checkIsAnotherCounter(queue?.id_ms_loket_antrian, queue.status_panggil) ? 'Diloket lain' : 'Panggil'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleQueueCancellationInSkip(queue)}
                                                        disabled={checkIsAnotherCounter(queue?.id_ms_loket_antrian, queue.status_panggil)}
                                                    >
                                                        {checkIsAnotherCounter(queue?.id_ms_loket_antrian, queue.status_panggil) ? 'Diloket lain' : 'Batal'}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Tidak ada data</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </Section>
    )
}

export default SkippedQueue