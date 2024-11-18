import Heading from "@/components/ui/heading";
import Section from "@/components/ui/section";
import React, {SetStateAction, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {AdmissionQueueWS} from "@/types/admission-queue";
import {useSession} from "next-auth/react";
import {toast} from "@/hooks/use-toast";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button";

interface SkippedQueueProps {
    counterId: number;
    queueCode: string | null;
    setCurrentQueue: React.Dispatch<SetStateAction<AdmissionQueueWS | null>>;
}

const SkippedQueue = ({counterId, queueCode, setCurrentQueue}: SkippedQueueProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [skippedQueues, setSkippedQueues] = useState<AdmissionQueueWS[] | null>(null);
    const {data: session, status} = useSession();

    const handleRecallQueue = (queue: AdmissionQueueWS) => {
        setCurrentQueue(queue)
        socket?.emit('admission-queue-calling', {
            id_antrian: queue?.id_antrian,
            id_ms_loket_antrian: counterId,
            user_id: session?.user.id
        })
    }

    const handleQueueCancellationInSkip = (queue: AdmissionQueueWS) => {
        socket?.emit('admission-queue-skipped-cancelled', {
            id_antrian: queue?.id_antrian,
            id_ms_loket_antrian: counterId,
            user_id: session?.user.id,
            kode_antrian: queue.kode_antrian,
        })
    }

    useEffect(() => {
        const admissionQueueSocket = io(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/admission-queue`, {
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

    useEffect(() => {
        if (!socket || status !== 'authenticated') return;

        socket.on(`error-${socket.id}`, (result) => {
            toast({
                description: result?.error,
            });
        });

        socket.on(`admission-queue-skipped-${counterId}`, (result) => {
            setSkippedQueues(result.data)
        });

        if (skippedQueues == null) {
            socket.emit('admission-queue-skipped-init', {
                queue_code: queueCode,
                counter_id: counterId
            });
        }

        return () => {
            socket.off(`error-${socket.id}`);
            socket.off(`admission-queue-skipped-${counterId}`);
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
                                                    >
                                                        Panggil
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleQueueCancellationInSkip(queue)}
                                                    >
                                                        Batal
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